class MainSheet extends BaseSheetHandler {
  constructor(spreadSheetId: string, sheetName: string) {
    super(spreadSheetId, sheetName)
  }

  processSpend(spend: Spend) {
    const newRow = [
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
    addRow(this.spreadSheetId, this.sheetName, newRow)
  }
}
