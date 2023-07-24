function processSpend() {
  var range = SpreadsheetApp.getActiveRange();
    var numRows = range.getNumRows();
    console.log(numRows)
    for (var i = 1; i <= numRows; i++) {
        console.log(range.getCell(i, 1).getValue());
        console.log(range.getCell(i, 2).getValue());
        console.log(range.getCell(i, 3).getValue());
    }
}
