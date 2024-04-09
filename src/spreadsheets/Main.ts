/*************************************************************************************************/
/*                                         SHEETS                                                */
/*************************************************************************************************/

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
      spend.value
    ]
    addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
  }

  validate(): void {
    const currentSheetRows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    if (typeof currentSheetRows === "undefined")
      throw new Error(
        `Undefined reading rows from sheet '${this.sheetConfig.name}' within spreadsheet '${this.spreadSheetConfig.name}'`
      )

    const allSpends = readAllRows(forms.main.spreadSheet.id, forms.main.spreadSheet.name)
    if (typeof allSpends === "undefined")
      throw new Error(
        `Undefined reading rows from sheet '${forms.main.spreadSheet.sheet.name}' within spreadsheet '${forms.main.spreadSheet.name}'`
      )

    if (currentSheetRows.length !== allSpends.length)
      console.error(
        `Expected number of rows on sheet '${this.sheetConfig.name}' within spreadsheet '${this.spreadSheetConfig.name}': ${allSpends.length}\nActual number of rows on sheet '${this.sheetConfig.name}' within spreadsheet '${this.spreadSheetConfig.name}': ${currentSheetRows.length}`
      )
  }
}

/*************************************************************************************************/
/*                                         SPREAD SHEETS                                         */
/*************************************************************************************************/

class Main extends BaseSpreadSheetHandler {
  constructor(spreadSheetConfig: SpreadSheetConfig) {
    super(spreadSheetConfig, [new MainSheet(spreadSheetConfig, spreadSheetConfig.sheets.main)])
  }
}

spreadSheetHandlers.push(new Main(sheets.main))

console.info(`Handler for spreadsheet '${sheets.main.name}' loaded correctly`)
