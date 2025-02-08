import { tasks_v1 } from "googleapis"

const spreadSheetHandlers: { [spreadSheetId: string]: BaseSpreadSheetHandler } = {}

const originForms = "Google Forms"

const originTasks = "Google Tasks"

const originAppScript = "App Script"

const automaticRecurrentSpend = "Automatic"

const manualRecurrentSpend = "Manual"

/*************************************************************************************************************************/
/*                                      FUNCTIONS TRIGGERED AFTER FORM COMPLETION                                        */
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
    if (sheetName === forms.sheets.main.name) {
      const date = range.getCell(i, forms.sheets.main.columns!.date).getValue()
      const category = range.getCell(i, forms.sheets.main.columns!.category).getValue()
      const amount = range.getCell(i, forms.sheets.main.columns!.amount).getValue()
      const account = range.getCell(i, forms.sheets.main.columns!.account).getValue()
      const description = range.getCell(i, forms.sheets.main.columns!.description).getValue()
      const subCategory = range.getCell(i, forms.sheets.main.columns!.subCategory).getValue()

      const newSpend: Spend = { date, category, amount, account, description, subCategory, origin: originForms }

      Object.keys(spreadSheetHandlers).forEach((spreadSheetId) => {
        spreadSheetHandlers[spreadSheetId].processSpend(newSpend)
      })
    } else {
      const date = range.getCell(i, forms.sheets.reimbursements.columns!.date).getValue()
      const category = range.getCell(i, forms.sheets.reimbursements.columns!.category).getValue()
      const amount = range.getCell(i, forms.sheets.reimbursements.columns!.amount).getValue()
      const account = range.getCell(i, forms.sheets.reimbursements.columns!.account).getValue()
      const subCategory = range.getCell(i, forms.sheets.reimbursements.columns!.subCategory).getValue()

      const newReimbursement: Reimbursement = {
        date,
        category,
        amount,
        account,
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
    validateRecurrentSpend(recurrentSpends[i])
  }

  for (let i = 0; i < recurrentSpends.length; i++) {
    const recurrentSpend = recurrentSpends[i]
    if (now.getDate() == recurrentSpend.dayOfMonth) {
      let taskId: string | undefined
      if (recurrentSpend.sendTask) {
        taskId = createRecurrentSpendTask(recurrentSpend)
      } else {
        console.log("Not creating task")
      }

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
        if (recurrentSpend.type === manualRecurrentSpend && typeof taskId === "undefined") {
          throw new Error(
            `Task id undefined, if recurrent spend type is "${manualRecurrentSpend}", ensure sendTask is enabled for recurrent spend ${JSON.stringify(
              recurrentSpend
            )}"`
          )
        }
        const row = buildRecurrentSpendRow(recurrentSpend, now, taskId)
        addRow(spreadSheets.main.id, spreadSheets.main.sheets.recurrentSpends.name, row)
      }

      if (recurrentSpend.sendMail) {
        console.info(`Sending mail to "${recurrentSpendsMailRecipient}".`)
        const htmlBody = buildRecurrentSpendHtmlMailBody(recurrentSpend, taskId)
        MailApp.sendEmail(recurrentSpendsMailRecipient, recurrentSpend.mailSubject, "", { htmlBody })
      } else {
        console.log("Not sending mails")
      }
    }
  }
}

/*************************************************************************************************************************/
/*                                       FUNCTIONS TRIGGERED BY TIME EVENTS                                              */
/*************************************************************************************************************************/

function confirmRecurrentSpends() {
  const rows = readAllRows(spreadSheets.main.id, spreadSheets.main.sheets.recurrentSpends.name)?.slice(1)
  const tasks = listAllTasks(recurrentSpendsTaskList) as tasks_v1.Schema$Task[]

  for (let i = 0; i < rows!.length; i++) {
    const currentRow = rows![i]
    const taskId = currentRow[spreadSheets.main.sheets.recurrentSpends.columns!.taskId - 1]
    const task = tasks.find((task) => task.id === taskId)

    if (typeof task === "undefined") {
      throw new Error(`Cannot find task "${taskId}" within task list "${recurrentSpendsTaskList}"`)
    }

    console.info(`Processing task '${taskId}'`)

    if (!currentRow[spreadSheets.main.sheets.recurrentSpends.columns!.completed - 1] && task.completed) {
      setValue(
        spreadSheets.main.id,
        spreadSheets.main.sheets.recurrentSpends.name,
        i + 2,
        spreadSheets.main.sheets.recurrentSpends.columns!.completed,
        true
      )

      const amount = extractAmountFromRecurrentSpendTask(task)
      currentRow[spreadSheets.main.sheets.recurrentSpends.columns!.amount - 1] = amount
      setValue(
        spreadSheets.main.id,
        spreadSheets.main.sheets.recurrentSpends.name,
        i + 2,
        spreadSheets.main.sheets.recurrentSpends.columns!.amount,
        amount
      )

      const newSpend = generateSpendWithRecurrentSpendRow(currentRow)

      Object.keys(spreadSheetHandlers).forEach((spreadSheetId) => {
        spreadSheetHandlers[spreadSheetId].processSpend(newSpend)
      })
    }
  }
}

function sendHistoricData() {
  console.info("Building chart")
  const chart = buildColumnChart()

  console.info("Building mail")
  const mail = buildHistoricDataMail(chart)

  console.info(`Content type: ${chart.getBlob().getContentType()}`)

  const mailRecipient = "brunopiaggiok@gmail.com"
  MailApp.sendEmail(mailRecipient, "Chart", "", mail)
}

/*************************************************************************************************************************/
/*                                      FUNCTIONS INTENDED TO BE MANUALLY TRIGGERED                                      */
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
