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

    updateSheet(MONTHLY_SHEET_NAME, date, value, category, subCategory)
    const accountSheet = getAccountSheet(account, category, subCategory)
    updateSheet(accountSheet, date, value, category, subCategory)
    if (category == CATEGORY_1) {
      updateSheet(CATEGORY_1_SHEET_NAME, date, value, category, subCategory)
    }
    if (category == CATEGORY_2) {
      updateSheet(CATEGORY_2_SHEET_NAME, date, value, category, subCategory)
    }
  }
}

function processRecurrentSpends() {
  const today = new Date()
  for (let i = 0; i < RECURRENT_SPENDS.length; i++) {
    const currentSpend = RECURRENT_SPENDS[i]
    if (today.getDate() == currentSpend.day) {
      const taskTitle = TASK_TITLE_TEMPLATE.replace("X", currentSpend.name).replace("Y", currentSpend.account)
      const taskTitleDescription = TASK_DESCRIPTION_TEMPLATE.replace("X", currentSpend.name)
        .replace("Y", currentSpend.account)
        .replace("Z", formatDate(today))
      const task = createTask(TASKS_LIST, taskTitle, taskTitleDescription, today)

      const newRow1 = [today, currentSpend.value, currentSpend.account, task.id, false]
      addRow(currentSpend.sheetName, newRow1)

      const newRow2 = [
        today,
        formatDate(today),
        currentSpend.category,
        currentSpend.subCategory,
        null,
        null,
        null,
        currentSpend.value
      ]
      addRow(FORM_ASSOCIATED_SHEET, newRow2)
    }

    const allRows = readAllRows(currentSpend.sheetName)
    const tasksToSetCompleted: string[] = []
    if (allRows)
      for (let i = 0; i < allRows.length; i++) {
        console.log(allRows[i])
        if (allRows[i][4]) tasksToSetCompleted.push(allRows[i][3])
      }

    // TODO: set task completed (in tasksToSetCompleted) if its not completed yet
    // TODO: process all task (completed) set row "chequeado" with "TRUE"
    // TODO: send mail to indicate which task were set as completed
    // TODO: send mail to indicate which row were set with "chequeado" as "TRUE"
    // TODO: update spends
  }
}
