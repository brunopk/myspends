const spreadSheetHandlers: BaseSpreadSheetHandler[] = []

const originForms = "Google Forms"

function processMainForm() {
  const range = SpreadsheetApp.getActiveRange()
  const numRows = range.getNumRows()

  // Normally active range contains one row (last inserted row)
  for (let i = 1; i <= numRows; i++) {
    const date = range.getCell(i, forms.main.spreadSheet.sheet.columns!.date).getValue()
    const category = range.getCell(i, forms.main.spreadSheet.sheet.columns!.category).getValue()
    const value = range.getCell(i, forms.main.spreadSheet.sheet.columns!.value).getValue()
    const account = range.getCell(i, forms.main.spreadSheet.sheet.columns!.account).getValue()
    const description = range.getCell(i, forms.main.spreadSheet.sheet.columns!.description).getValue()
    const subCategory = range.getCell(i, forms.main.spreadSheet.sheet.columns!.subCategory).getValue()

    const newSpend: Spend = { date, category, value, account, description, subCategory, origin: originForms }

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
