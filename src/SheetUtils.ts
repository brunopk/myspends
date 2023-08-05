function updateSheet(date, category, value) {
  const monthlySheetName = "Mensual"
  let rowForCurrentMonth = null
  const data = readAllRows(monthlySheetName)?.slice(1)
  for (let i = 0; i < data.length; i++) {
    if (data[i][0].getMonth() == date.getMonth()) {
      // 1 (because of header row) + 1 (because first row index is 1)
      rowForCurrentMonth = i + 2
      break
    }
  }

  const columnForRemainingAmount = 7
  if (!rowForCurrentMonth) {
    const newRow = [date, 0, 0, 0, 0, 0, 117168, 0, 117168] 
    newRow[getSpendColumn(category) - 1] = value
    newRow[columnForRemainingAmount - 1] = newRow[columnForRemainingAmount - 1] - value
    addRow(monthlySheetName, newRow)
  } else {
    const currentCategoryAmount = getValue(monthlySheetName, rowForCurrentMonth, getSpendColumn(category))
    setValue(monthlySheetName, rowForCurrentMonth, getSpendColumn(category), currentCategoryAmount + value)
    const currentRemainingAmount = getValue(monthlySheetName, rowForCurrentMonth, columnForRemainingAmount)
    setValue(monthlySheetName, rowForCurrentMonth, columnForRemainingAmount, currentRemainingAmount - value)
  }
}

function readAllRows(sheetName: string): any[][] | undefined {
  const activeSpreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = activeSpreadSheet.getSheetByName(sheetName)
  const dataRange = sheet?.getDataRange()
  return dataRange?.getValues()
}

function addRow(sheetName: string, row: any[]) {
  const activeSpreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = activeSpreadSheet.getSheetByName(sheetName)
  activeSpreadSheet.setActiveSheet(sheet)
  console.log(`Adding new row (${row}) to sheet "${sheetName}"`)
  sheet?.appendRow(row)
}

function getValue(sheetName: string, row: number, column: number): any {
  const activeSpreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = activeSpreadSheet.getSheetByName(sheetName)
  const dataRange = sheet?.getDataRange()
  return dataRange?.getCell(row, column).getValue()
}

function setValue(sheetName: string, row: number, column: number, newValue: any) {
  const activeSpreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = activeSpreadSheet.getSheetByName(sheetName)
  const dataRange = sheet?.getDataRange()
  return dataRange?.getCell(row, column).setValue(newValue)
}

function testReadAllRows() {
  console.log(readAllRows(""))
}
