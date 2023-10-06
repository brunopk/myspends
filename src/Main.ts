let SpreadSheetHandlers = {}

function processMainForm() {
  const range = SpreadsheetApp.getActiveRange()
  const numRows = range.getNumRows()

  // Normally active range contains one row (last inserted row)
  for (let i = 1; i <= numRows; i++) {
    const date = range.getCell(i, FORMS.MAIN.COLUMNS.DATE).getValue()
    const category = range.getCell(i, FORMS.MAIN.COLUMNS.CATEGORY).getValue()
    const value = range.getCell(i, FORMS.MAIN.COLUMNS.VALUE).getValue()
    const account = range.getCell(i, FORMS.MAIN.COLUMNS.ACCOUNT).getValue()
    const description = range.getCell(i, FORMS.MAIN.COLUMNS.DESCRIPTION).getValue()
    const subCategory = range.getCell(i, FORMS.MAIN.COLUMNS.SUBCATEGORY).getValue()
    let discountApplied = range.getCell(i, FORMS.MAIN.COLUMNS.DISCOUNT_APPLIED).getValue()

    if (discountApplied === YES) {
      discountApplied = true
    } else {
      discountApplied = false
    }

    // TODO: From this line and on, code will change

    updateSheet(
      SPREADSHEETS.MAIN.ID,
      SPREADSHEETS.MAIN.SHEETS.MAIN,
      FORMS.MAIN.NAME,
      date,
      value,
      account,
      discountApplied,
      category,
      subCategory,
      description
    )

    updateSheet(
      SPREADSHEETS.MONTHLY.ID,
      SPREADSHEETS.MONTHLY.CATEGORIES_MAIN_SHEET,
      FORMS.MAIN.NAME,
      date,
      value,
      account,
      discountApplied,
      category,
      subCategory,
      description
    )

    if (SPREADSHEETS.MONTHLY.ACCOUNT_SHEETS.indexOf(account) !== -1) {
      updateSheet(
        SPREADSHEETS.MONTHLY.ID,
        account,
        FORMS.MAIN.NAME,
        date,
        value,
        account,
        discountApplied,
        category,
        subCategory,
        description
      )
    }

    if (SPREADSHEETS.MONTHLY.CATEGORIES_SHEET.indexOf(category) !== -1) {
      updateSheet(
        SPREADSHEETS.MONTHLY.ID,
        category,
        FORMS.MAIN.NAME,
        date,
        value,
        account,
        discountApplied,
        category,
        subCategory,
        description
      )
    }
  }
}

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
