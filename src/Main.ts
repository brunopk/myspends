// TODO: Probar ingresar un gasto desde el formulario

// TODO: Probar validar todas las planillas

// TODO: Arreglar lo de las categorias (ver el TODO en src/Utils.ts:23)
const spreadSheetHandlers: BaseSpreadSheetHandler[] = []

function processMainForm() {
  const range = SpreadsheetApp.getActiveRange()
  const numRows = range.getNumRows()
  const origin = "Forms"

  // TODO: hardcode column number instead of getting them from config

  // Normally active range contains one row (last inserted row)
  for (let i = 1; i <= numRows; i++) {
    const date = range.getCell(i, forms.main.spreadSheet.sheet.extra.dateColumn).getValue()
    const category = range.getCell(i, forms.main.spreadSheet.sheet.extra.categoryColumn).getValue()
    const value = range.getCell(i, forms.main.spreadSheet.sheet.extra.valueColumn).getValue()
    const account = range.getCell(i, forms.main.spreadSheet.sheet.extra.accountColumn).getValue()
    const description = range.getCell(i, forms.main.spreadSheet.sheet.extra.descriptionColumn).getValue()
    const subCategory = range.getCell(i, forms.main.spreadSheet.sheet.extra.subCategoryColumn).getValue()

    const newSpend: Spend = { date, category, value, account, description, subCategory, origin }

    spreadSheetHandlers.forEach((handler) => {
      handler.processSpend(newSpend)
    })
  }
}

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

/**
 * Validate all amounts in all spreadsheets for the current month.
 * @param spreadSheetName .
 */
function validateAllSpreadSheets() {
  spreadSheetHandlers.forEach((spreadSheetHandler) => {
    try {
      spreadSheetHandler.validate()
    } catch (ex) {
      console.error((ex as Error).stack)
    }
  })
}
