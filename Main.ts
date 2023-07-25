const recurrentSpends = [
  {
    day: 25,
    value: 1000
  }
]


function processSpendFromForm() {
  var range = SpreadsheetApp.getActiveRange();
  var numRows = range.getNumRows();
  for (var i = 1; i <= numRows; i++) {
      const date = range.getCell(i, DATE_COLUMN).getValue() 
      const category = range.getCell(i, CATEGORY_COLUMN).getValue()
      const value = range.getCell(i, VALUE_COLUMN).getValue()
      console.log(value)
      updateSpend(date, category, value)
  }
}


function processRecurrentSpends() {
  const date = new Date("2023-08-03")
  console.log(date.getDay())
  // TODO: continue
}
