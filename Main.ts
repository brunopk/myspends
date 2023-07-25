
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
