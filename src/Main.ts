import { tasks_v1 } from "googleapis"

const spreadSheetHandlers: { [spreadSheetId: string]: BaseSpreadSheetHandler } = {}

const originForms = "Google Forms"

const originTasks = "Google Tasks"

const originAppScript = "App Script"

const automaticRecurrentSpend = "Automatic"

const manualRecurrentSpend = "Manual"

/*************************************************************************************************************************/

function processGoogleFormInput() {
  const range = SpreadsheetApp.getActiveRange()
  const sheetName = SpreadsheetApp.getActiveSheet().getName()
  const numRows = range.getNumRows()
  const validSheetNames = [forms.sheets.main.name, forms.sheets.reimbursements.name]

  if (!validSheetNames.includes(sheetName))
    throw new Error(`Invalid sheet name "${sheetName}", valid sheet names are ${validSheetNames}`)

  // Normally active range contains one row (last inserted row)
  for (let i = 1; i <= numRows; i++) {
    const date = range.getCell(i, forms.sheets.main.columns!.date).getValue()
    const category = range.getCell(i, forms.sheets.main.columns!.category).getValue()
    const amount = range.getCell(i, forms.sheets.main.columns!.amount).getValue()
    const account = range.getCell(i, forms.sheets.main.columns!.account).getValue()
    const description = range.getCell(i, forms.sheets.main.columns!.description).getValue()
    const subCategory = range.getCell(i, forms.sheets.main.columns!.subCategory).getValue()

    if (sheetName === forms.sheets.main.name) {
      const newSpend: Spend = { date, category, amount, account, description, subCategory, origin: originForms }

      Object.keys(spreadSheetHandlers).forEach((spreadSheetId) => {
        spreadSheetHandlers[spreadSheetId].processSpend(newSpend)
      })
    } else {
      const newReimbursement: Reimbursement = {
        date,
        category,
        amount,
        account,
        description,
        subCategory,
        origin: originForms
      }

      Object.keys(spreadSheetHandlers).forEach((spreadSheetId) => {
        spreadSheetHandlers[spreadSheetId].processReimbursement(newReimbursement)
      })
    }
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
          amount: recurrentSpend.amount,
          description: recurrentSpend.description,
          subCategory: recurrentSpend.subCategory,
          origin: originAppScript
        }
        Object.keys(spreadSheetHandlers).forEach((spreadSheetId) => {
          spreadSheetHandlers[spreadSheetId].processSpend(spend)
        })
      } else {
        const row = buildPendingSpendRow(recurrentSpend, now, taskId)
        addRow(spreadSheets.main.id, spreadSheets.main.sheets.pending.name, row)
      }
      console.info(`Sending mail to "${recurrentSpendsMailRecipient}".`)
      MailApp.sendEmail(recurrentSpendsMailRecipient, "", recurrentSpend.mailSubject, recurrentSpend.mailBody)
    }
  }
}

function processPendingSpends() {
  const rows = readAllRows(spreadSheets.main.id, spreadSheets.main.sheets.pending.name)
  const tasks = listAllTasks(recurrentSpendsTaskList) as tasks_v1.Schema$Task[]

  for (let i = 1; i < rows!.length; i++) {
    const taskId = rows![i][spreadSheets.main.sheets.pending.columns!.taskId - 1]
    const task = tasks.find((task) => task.id === taskId)
    let newSpend: Spend | undefined

    if (typeof task === "undefined") {
      throw new Error(`Cannot find task "${taskId}" within task list "${recurrentSpendsTaskList}"`)
    } else if (rows[i][spreadSheets.main.sheets.pending.columns!.completed - 1] && !task.completed) {
      completeTask(recurrentSpendsTaskList, taskId)
      newSpend = mapPendingSpendToSpend(rows![i])
    } else if (!rows[i][spreadSheets.main.sheets.pending.columns!.completed - 1] && task.completed) {
      setValue(
        spreadSheets.main.id,
        spreadSheets.main.sheets.pending.name,
        i + 1,
        spreadSheets.main.sheets.pending.columns!.completed,
        true
      )
      newSpend = mapPendingSpendToSpend(rows![i])
    }

    if (typeof newSpend !== "undefined") {
      Object.keys(spreadSheetHandlers).forEach((spreadSheetId) => {
        spreadSheetHandlers[spreadSheetId].processSpend(newSpend)
      })
    }
  }
}

/*************************************************************************************************************************/

/**
 * Validate all amounts in all spreadsheets for the current month.
 * @param spreadSheetName .
 */
function validateSpreadSheets() {
  Object.keys(spreadSheetHandlers).forEach((spreadSheetId) => {
    const spreadSheetHandler = spreadSheetHandlers[spreadSheetId]
    try {
      spreadSheetHandler.validate()
    } catch (ex) {
      console.error((ex as Error).stack)
    }
  })
}
