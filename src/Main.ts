function processSpendFromForm() {
  const range = SpreadsheetApp.getActiveRange();
  const numRows = range.getNumRows();
  for (let i = 1; i <= numRows; i++) {
    const date = range.getCell(i, DATE_COLUMN).getValue() 
    const category = range.getCell(i, CATEGORY_COLUMN).getValue()
    const value = range.getCell(i, VALUE_COLUMN).getValue()
    console.log(value)
    updateSpend(date, category, value)
  }
}

function processRecurrentSpends() {
  const today = new Date()
  console.log(date.getDay())
  for (let i = 0; i < RECURRENT_SPENDS.length; i++) {
    const currentSpend = RECURRENT_SPENDS[i]
    if (today.getDay() == currentSpend.day) {
      let newRow = []
      addRow(currentSpend.sheetName, newRow)
    }
  }
}
