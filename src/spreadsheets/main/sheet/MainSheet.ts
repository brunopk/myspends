class MainSheet extends BaseSheetHandler {
  processSpend(spend: Spend) {
    const newRow = [
      new Date(),
      spend.date,
      spend.formName,
      spend.category,
      spend.subCategory,
      spend.description,
      spend.account,
      spend.value
    ]
    addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
  }
}
