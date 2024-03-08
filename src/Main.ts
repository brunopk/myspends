const spreadSheetHandlers: BaseSpreadSheetHandler[] = []

function processMainForm() {
  const range = SpreadsheetApp.getActiveRange()
  const numRows = range.getNumRows()
  const origin = "Forms"

  // Normally active range contains one row (last inserted row)
  for (let i = 1; i <= numRows; i++) {
    const date = range.getCell(i, forms.main.spreadSheet.columns.date).getValue()
    const category = range.getCell(i, forms.main.spreadSheet.columns.category).getValue()
    const value = range.getCell(i, forms.main.spreadSheet.columns.value).getValue()
    const account = range.getCell(i, forms.main.spreadSheet.columns.account).getValue()
    const description = range.getCell(i, forms.main.spreadSheet.columns.description).getValue()
    const subCategory = range.getCell(i, forms.main.spreadSheet.columns.subCategory).getValue()

    const newSpend: Spend = { date, category, value, account, description, subCategory, origin }

    spreadSheetHandlers.forEach((handler) => {
      handler.processSpend(newSpend)
    })
  }
}

// TODO: SEGUIR CON LA VALIDACIÓN DE PLANILLAS

function processRecurrentSpends() {
  const today = new Date()
  for (let i = 0; i < recurrentSpends.length; i++) {
    const recurrentSpend = recurrentSpends[i]
    if (today.getDate() == recurrentSpend.dayOfMonth) {
      createTask(recurrentSpendsTaskList, recurrentSpend.taskTitle, recurrentSpend.taskDescription, today)
      spreadSheetHandlers.forEach((handler) => {
        handler.processSpend(recurrentSpend)
      })
      console.info(`Sending mail to ${recurrentSpendsMailRecipient} ...`)
      MailApp.sendEmail(recurrentSpendsMailRecipient, "", recurrentSpend.mailSubject, recurrentSpend.mailBody)
    }
  }
}

function validate(spreadSheetName: string, sheetName: string, month: number) {
  const spreadSheetHandler = findSpreadSheetHandlerByName(spreadSheetHandlers, spreadSheetName)
  if (typeof spreadSheetHandler === "undefined") throw new Error(`Spreadsheet '${spreadSheetName}' not found.`)

  // TODO: seguir aca (buscar sheet y empezar a validar todas las columnas)
  spreadSheetHandler.validate()
}
