function processSpendFromForm() {
  const range = SpreadsheetApp.getActiveRange()
  const numRows = range.getNumRows()

  // Normally active range contains one row (last inserted row)
  for (let i = 1; i <= numRows; i++) {
    const date = range.getCell(i, DATE_COLUMN).getValue()
    const category = range.getCell(i, CATEGORY_COLUMN).getValue()
    const value = range.getCell(i, VALUE_COLUMN).getValue()
    const account = range.getCell(i, ACCOUNT_COLUMN).getValue()
    let subCategory = range.getCell(i, SUBCATEGORY_COLUMN).getValue()
    subCategory = subCategory == "" ? range.getCell(i, SUBCATEGORY_COLUMN_1).getValue() : subCategory
    subCategory = subCategory == "" ? range.getCell(i, SUBCATEGORY_COLUMN_2).getValue() : subCategory

    // Copy subcategory (from different columns) to one specific column to make it more visible
    range.getCell(i, SUBCATEGORY_COLUMN).setValue(subCategory)

    updateSheet(MONTHLY_SHEET_NAME, date, account, value, category, subCategory)
    const accountSheet = getAccountSheet(account)
    if (accountSheet && ACCOUNT_SHEETS.indexOf(accountSheet) !== -1) {
      updateSheet(accountSheet, date, account, value, category, subCategory)
    }
    if (category == CATEGORY_1) {
      updateSheet(CATEGORY_1_SHEET_NAME, date, account, value, category, subCategory)
    }
    if (category == CATEGORY_2) {
      updateSheet(CATEGORY_2_SHEET_NAME, date, account, value, category, subCategory)
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
        formatDate(today),
        currentSpend.category,
        currentSpend.subCategory,
        null,
        null,
        RECURRENT_SPEND_DESCRIPTION_FOR_FORM_SHEET,
        currentSpend.account,
        currentSpend.value
      ]
      addRow(FORM_SHEET, newRow)

      updateSheet(
        MONTHLY_SHEET_NAME,
        today,
        currentSpend.account,
        currentSpend.value,
        currentSpend.category,
        currentSpend.subCategory
      )
      const accountSheet = getAccountSheet(currentSpend.account, currentSpend.category, currentSpend.subCategory)
      updateSheet(
        accountSheet,
        today,
        currentSpend.account,
        currentSpend.value,
        currentSpend.category,
        currentSpend.subCategory
      )
      const categorySheet = getCategorySheet(currentSpend.category)
      if (categorySheet !== null) {
        updateSheet(
          categorySheet,
          today,
          currentSpend.account,
          currentSpend.value,
          currentSpend.category,
          currentSpend.subCategory
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
