class Monthly extends BaseSpreadSheetHandler {
  constructor(spreadSheetConfig: SpreadSheetConfig) {
    const sheetNames = Object.keys(spreadSheetConfig.sheets)
      .filter((key) => typeof spreadSheetConfig.sheets[key].type !== "undefined")
      .map((key) => spreadSheetConfig.sheets[key].name)
    const sheetHandlers: BaseSheetHandler[] = [
      new AllCategories(spreadSheetConfig, spreadSheetConfig.sheets.all_categories)
    ]
    sheetNames.forEach((sheetName) => {
      const sheetType = spreadSheetConfig.sheets[sheetName].type
      const sheetConfig = spreadSheetConfig.sheets[sheetName]
      switch (sheetType) {
        case MONTHLY_SHEET_TYPES.CATEGORY:
          sheetHandlers.push(new Category(spreadSheetConfig, sheetConfig))
          break
        case MONTHLY_SHEET_TYPES.ACCOUNT:
          sheetHandlers.push(new Account(spreadSheetConfig, sheetConfig))
          break
        default:
          throw new Error(`Unknown sheet type "${sheetType}"`)
      }
    })
    super(spreadSheetConfig, sheetHandlers)
  }
}

spreadSheetHandlers.push(new Main(spreadSheetConfig.monthly))

console.info(`Handler for spreadsheet "${spreadSheetConfig.monthly.name}" loaded.`)
