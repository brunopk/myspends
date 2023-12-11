const spreadSheetHandlers: BaseSpreadSheetHandler[] = []

function processMainForm() {
  const range = SpreadsheetApp.getActiveRange()
  const numRows = range.getNumRows()
  const origin = spendOrigin.mainForm

  // Normally active range contains one row (last inserted row)
  for (let i = 1; i <= numRows; i++) {
    const date = range.getCell(i, forms.main.columns.date).getValue()
    const category = range.getCell(i, forms.main.columns.category).getValue()
    const value = range.getCell(i, forms.main.columns.value).getValue()
    const account = range.getCell(i, forms.main.columns.account).getValue()
    const description = range.getCell(i, forms.main.columns.description).getValue()
    const subCategory = range.getCell(i, forms.main.columns.subCategory).getValue()

    const newSpend: Spend = { date, category, value, account, description, subCategory, origin }

    spreadSheetHandlers.forEach((handler) => {
      handler.processSpend(newSpend)
    })
  }
}

// TODO: volver a correr este metodo 

function processRecurrentSpends() {
  const today = new Date()
  for (let i = 0; i < RECURRENT_SPENDS.length; i++) {
    const currentSpend = RECURRENT_SPENDS[i]
    if (today.getDate() == currentSpend.day) {
      const taskDescription = TASK_DESCRIPTION_TEMPLATE.replace("X", currentSpend.name)
        .replace("Y", currentSpend.account)
        .replace("Z", formatDate(today))
      const taskTitle = TASK_TITLE_TEMPLATE.replace("X", currentSpend.name)
      createTask(TASKS_LIST, taskTitle, taskDescription, today)

      const newRow = [
        today,
        today,
        null,
        currentSpend.category,
        currentSpend.subCategory,
        RECURRENT_SPEND_DESCRIPTION,
        currentSpend.account,
        false,
        currentSpend.value
      ]
      addRow(SPREADSHEETS.MAIN.ID, SPREADSHEETS.MAIN.SHEETS.MAIN, newRow)

      updateSheet(
        SPREADSHEETS.MONTHLY.ID,
        SPREADSHEETS.MONTHLY.CATEGORIES_MAIN_SHEET,
        null,
        today,
        currentSpend.value,
        currentSpend.account,
        false,
        currentSpend.category,
        currentSpend.subCategory,
        RECURRENT_SPEND_DESCRIPTION
      )
      updateSheet(
        SPREADSHEETS.MONTHLY.ID,
        currentSpend.account,
        null,
        today,
        currentSpend.value,
        currentSpend.account,
        false,
        currentSpend.category,
        currentSpend.subCategory,
        RECURRENT_SPEND_DESCRIPTION
      )
      if (SPREADSHEETS.MONTHLY.CATEGORIES_SHEET.indexOf(currentSpend.category) !== -1) {
        updateSheet(
          SPREADSHEETS.MONTHLY.ID,
          currentSpend.category,
          null,
          today,
          currentSpend.value,
          currentSpend.account,
          false,
          currentSpend.category,
          currentSpend.subCategory,
          RECURRENT_SPEND_DESCRIPTION
        )
      }

      console.info(`Sending mail to ${MAIL_RECIPIENT} ...`)
      const mailBody = MAIL_BODY.replace("%S", currentSpend.name)
        .replace("%A", currentSpend.account)
        .replace("%D", formatDate(today))
      MailApp.sendEmail(MAIL_RECIPIENT, "", MAIL_SUBJECT, mailBody)
    }
  }
}
