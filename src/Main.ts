const spreadSheetHandlers: BaseSpreadSheetHandler[] = []

const originForms = "Google Forms"

const originAppScript = "App Script"

const automaticRecurrentSpend = "Automatic"

const manualRecurrentSpend = "Manual"

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
          value: recurrentSpend.value,
          description: recurrentSpend.description,
          subCategory: recurrentSpend.subCategory,
          origin: originAppScript
        }
        spreadSheetHandlers.forEach((handler) => {
          handler.processSpend(spend)
        })
      } else {
        const row = Array(Object.keys(spreadSheets.main.sheets.pending.columns!).length).fill(0)
        // TODO: CONTINUE
        // TODO: make function to confirm spends after completing its corresponding task
        // addRow(recurrentSpendSpreadSheetId, recurrentSpendSheetName, [now, ])
      }
      console.info(`Sending mail to ${recurrentSpendsMailRecipient} ...`)
      MailApp.sendEmail(recurrentSpendsMailRecipient, "", recurrentSpend.mailSubject, recurrentSpend.mailBody)
    }
  }
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
