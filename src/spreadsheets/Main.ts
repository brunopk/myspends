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
    const formData = readAllRows(forms.main.spreadSheet.id, forms.main.spreadSheet.sheetName)
    const sheetData = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)?.filter((row) => {
      // TODO: esto tiene que validar en base a todas las columnas
      row[this.sheetConfig.columns.]
    })

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

spreadSheetHandlers.push(new Main(spreadSheetConfig.main))

console.info(`Handler for spreadsheet '${spreadSheetConfig.main.name}' loaded correctly`)
