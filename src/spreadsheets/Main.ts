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
    const allSpendsFromForms = readAllRows(forms.main.spreadSheet.id, forms.main.spreadSheet.sheet.name)?.slice(1)

    if (rows?.length !== allSpendsFromForms?.length) {
      console.warn(
        `There are ${allSpendsFromForms?.length} rows in sheet '${forms.main.spreadSheet.sheet.name}' within \\
        '${forms.main.spreadSheet.name}' but there are ${rows?.length} rows in sheet '${this.sheetConfig.name}' \\
        within '${this.spreadSheetConfig.name}' with origin "Google Forms".`
      )
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
