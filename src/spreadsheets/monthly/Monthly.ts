class Monthly extends BaseSpreadSheetHandler {
  constructor(spreadSheetConfig: SpreadSheetConfig) {
    const sheetNames = Object.keys(spreadSheetConfig.sheets).map((key) => spreadSheetConfig.sheets[key].name)
    const sheetHandlers = sheetNames.map((sheetName) => {
      const sheetType = spreadSheetConfig.sheets[sheetName].type
      const sheetConfig = spreadSheetConfig.sheets[sheetName]
      switch (sheetType) {
        case MONTHLY_SHEET_TYPES.CATEGORY:
          return new Category(spreadSheetConfig, sheetConfig)
        case MONTHLY_SHEET_TYPES.ACCOUNT:
          return new Account(spreadSheetConfig, sheetConfig)
        default:
          throw new Error(`Unknown sheet type "${sheetType}"`)
      }
    })
    super(spreadSheetConfig, sheetHandlers)
  }
}

spreadSheetHandlers.push(new Main(spreadSheetConfig.monthly))

console.info(`Handler for spreadsheet "${spreadSheetConfig.monthly.name}" loaded.`)
