/*************************************************************************************************************************/
/*                                                       SHEETS                                                          */
/*************************************************************************************************************************/

class MainSheet extends BaseSheetHandler {
  processSpend(spend: Spend) {
    const newRow = [
      new Date(),
      spend.date,
      spend.origin,
      spend.category,
      spend.subCategory,
      spend.description,
      spend.account,
      spend.amount
    ]
    addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
  }

  /**
   * Only validates spends from Google Forms are all included in the main sheet
   */
  validate(): void {
    const rows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
      ?.slice(1)
      .filter((row) => row[this.sheetConfig.columns!.origin - 1] === originForms)
      .sort((rowA, rowB) => rowA[this.sheetConfig.columns!.date - 1] - rowB[this.sheetConfig.columns!.date - 1])
    const spendsFromForms = readAllRows(forms.main.spreadSheet.id, forms.main.spreadSheet.sheet.name)
      ?.slice(1)
      .sort(
        (rowA, rowB) =>
          rowA[forms.main.spreadSheet.sheet.columns!.date - 1] - rowB[forms.main.spreadSheet.sheet.columns!.date - 1]
      )

    for (let i = 0; i < rows!.length; i++) {
      const currentDateInRows = rows![i][this.sheetConfig.columns!.date - 1]
      const currentDateInSpendsFromForms = spendsFromForms![i][forms.main.spreadSheet.sheet.columns!.date - 1]
      if (!sameDates(currentDateInRows, currentDateInSpendsFromForms)) {
        console.warn(`Row [${formatRow(spendsFromForms![i], 3)}] from sheet "${forms.main.spreadSheet.sheet.name}" within spreadsheet "${forms.main.spreadSheet.name}" not found in sheet "${this.sheetConfig.name}" within spreadsheet "${this.spreadSheetConfig.name}"`)
        break
      }
    }
}

/*************************************************************************************************************************/
/*                                                SPREAD SHEET HANDLER                                                   */
/*************************************************************************************************************************/

class Main extends BaseSpreadSheetHandler {
  constructor(spreadSheetConfig: SpreadSheetConfig) {
    super(spreadSheetConfig, [new MainSheet(spreadSheetConfig, spreadSheetConfig.sheets.main)])
  }
}

spreadSheetHandlers.push(new Main(spreadSheets.main))

console.info(`Handler for spreadsheet '${spreadSheets.main.name}' loaded correctly`)
