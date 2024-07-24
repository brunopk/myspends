/*************************************************************************************************************************/
/*                                                       SHEETS                                                          */
/*************************************************************************************************************************/

class MainSheet extends BaseSheetHandler {
  processSpend(spend: Spend) {
    const newRow = [
      new Date(),
      formatDate(spend.date),
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
    const spendsFromForms = readAllRows(forms.spreadSheetId, forms.sheets.main.name)
      ?.slice(1)
      .sort(
        (rowA, rowB) =>
          rowA[forms.sheets.main.columns!.date - 1] - rowB[forms.sheets.main.columns!.date - 1]
      )

    for (let i = 0; i < rows!.length; i++) {
      const currentDateInRows = rows![i][this.sheetConfig.columns!.date - 1]
      const currentDateInSpendsFromForms = spendsFromForms![i][forms.sheets.main.columns!.date - 1]
      // console.info(`Row [${formatRow(spendsFromForms![i], 3)}] was found on sheet "${forms.main.spreadSheet.sheet.name}" from "${forms.main.spreadSheet.name}", and row [${formatRow(rows![i], 3)}] was found on sheet "${this.sheetConfig.name}" from "${this.spreadSheetConfig.name}" OK`)
      if (!sameDates(currentDateInRows, currentDateInSpendsFromForms)) {
        console.warn(`Mismatch, row [${formatRow(spendsFromForms![i], 3)}] was found on sheet "${forms.sheets.main.name}" from "${forms.spreadSheetName}", but row [${formatRow(rows![i], 3)}] was found on sheet "${this.sheetConfig.name}" from "${this.spreadSheetConfig.name}"`)
        console.warn("Uncomment previously commented console.info to debug the mismatch if it's not evident seeing sheets.")
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

Object.keys(spreadSheets).forEach((key) => {
  const spreadSheetConfig = spreadSheets[key]
  switch (spreadSheetConfig.class) {
    case "Monthly":
      break
    case "Main":
      if (Object.keys(spreadSheets).includes(spreadSheetConfig.id))
        throw new Error(`Duplicated entry for spread sheet "${spreadSheetConfig.id}" in spreadSheetHandlers`)
      spreadSheetHandlers[spreadSheetConfig.id] = new Main(spreadSheetConfig)
      console.info(`Handler for spreadsheet '${spreadSheetConfig.name}' loaded correctly`)
      break
    default:
      throw new Error(`Invalid spread sheet type '${spreadSheetConfig.class}'`)
  }
})