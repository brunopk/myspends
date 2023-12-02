class Category extends BaseSheetHandler {
  private categoryName: string

  constructor(spreadSheetConfig: SpreadSheetConfig, sheetConfig: SheetConfig) {
    super(spreadSheetConfig, sheetConfig)
    this.categoryName = sheetConfig.name
  }

  processSpend(spend: Spend) {
    // TODO: CONTINUE HERE !!!
  
    /*const newRow = [
      new Date(),
      spend.date,
      spend.formName,
      spend.category,
      spend.subCategory,
      spend.description,
      spend.account,
      spend.discountApplied,
      spend.value
    ]
    addRow(this.spreadSheetId, this.sheetName, newRow)*/
  }

  private getNumberOfExtraColumns(): number {
    // total column
    return 1
  }
}
