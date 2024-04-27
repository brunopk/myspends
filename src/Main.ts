const spreadSheetHandlers: BaseSpreadSheetHandler[] = []

const originForms = "Google Forms"

const originAppScript = "App Script"

const automaticRecurrentSpend = "Automatic"

const manualRecurrentSpend = "Manual"

/*************************************************************************************************************************/

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
  const now = new Date()
  for (let i = 0; i < recurrentSpends.length; i++) {
    const recurrentSpend = recurrentSpends[i]
    if (now.getDate() == recurrentSpend.dayOfMonth) {
      if (![manualRecurrentSpend, automaticRecurrentSpend].includes(recurrentSpend.type)) {
        throw new Error(`Invalid recurrent spend type "${recurrentSpend.type}"`)
      }
      const taskId = createTask(recurrentSpendsTaskList, recurrentSpend.taskTitle, recurrentSpend.taskDescription, now)
      if (recurrentSpend.type === automaticRecurrentSpend) {
        const spend: Spend = {
          date: now,
          category: recurrentSpend.category,
          account: recurrentSpend.account,
          value: recurrentSpend.amount,
          description: recurrentSpend.description,
          subCategory: recurrentSpend.subCategory,
          origin: originAppScript
        }
        spreadSheetHandlers.forEach((handler) => {
          handler.processSpend(spend)
        })
      } else {
        const row = Array(Object.keys(spreadSheets.main.sheets.pending.columns!).length).fill(0)
        row[spreadSheets.main.sheets.pending.columns!.category - 1] = recurrentSpend.category
        row[spreadSheets.main.sheets.pending.columns!.subCategory - 1] = recurrentSpend.subCategory
        row[spreadSheets.main.sheets.pending.columns!.timestamp - 1] = now
        row[spreadSheets.main.sheets.pending.columns!.amount - 1] = recurrentSpend.amount
        row[spreadSheets.main.sheets.pending.columns!.account - 1] = recurrentSpend.account
        row[spreadSheets.main.sheets.pending.columns!.taskId - 1] = taskId
        row[spreadSheets.main.sheets.pending.columns!.description - 1] = recurrentSpend.description
        row[spreadSheets.main.sheets.pending.columns!.completed - 1] = false
        addRow(spreadSheets.main.id, spreadSheets.main.sheets.main.name, row)
      }
      console.info(`Sending mail to ${recurrentSpendsMailRecipient} ...`)
      MailApp.sendEmail(recurrentSpendsMailRecipient, "", recurrentSpend.mailSubject, recurrentSpend.mailBody)
    }
  }
}

function processPendingSpends() {
  const rows = readAllRows(spreadSheets.main.id, spreadSheets.main.sheets.pending.name)
  // TODO: CONTINUE
}

/**
 * Validate all amounts in all spreadsheets for the current month.
 * @param spreadSheetName .
 */
function validateSpreadSheets() {
  spreadSheetHandlers.forEach((spreadSheetHandler) => {
    try {
      spreadSheetHandler.validate()
    } catch (ex) {
      console.error((ex as Error).stack)
    }
  })
}
