function getSpendCategory(range: GoogleAppsScript.Spreadsheet.Range): string {
  return range.getCell(1, 2).getValue()
}

function getSpendColumn(category) {
  switch(category) {
    case "Celular":
      return 2
    case "Psicólogo":
      return 3
    case "Salud":
      return 4
    case "Transporte":
      return 5
    case "Otros":
      return 6
    default:
      throw new Error(`Unknown category '${category}'`)
  }
}

function updateSpend(date, category, value) {
  const monthlySheetName = "Mensual"
  const activeSpreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  const monthlySheet = activeSpreadSheet.getSheetByName(monthlySheetName)

  activeSpreadSheet.setActiveSheet(monthlySheet)
  const dataRange = monthlySheet.getDataRange()
  
  let rowForCurrentMonth = null
  const data = dataRange.getValues().slice(1)
  for (let i = 0; i < data.length; i++) {
    if (data[i][0].getMonth() == date.getMonth()) {
      // 1 (because of header row) + 1 (because first row index is 1)
      rowForCurrentMonth = i+2
      break
    }
  }
  
  const columnForRemainingAmount = 7
  if (!rowForCurrentMonth) {
    const newRow = [date, 0, 0, 0, 0, 0, 117168, 0, 117168] 
    newRow[getSpendColumn(category) - 1] = value
    newRow[columnForRemainingAmount - 1] = newRow[columnForRemainingAmount - 1] - value
    console.log(`Adding new row (${newRow}) to sheet "${monthlySheetName}"`)
    activeSpreadSheet.appendRow(newRow)
  } else {
    const cellForCategory = dataRange.getCell(rowForCurrentMonth, getSpendColumn(category))
    cellForCategory.setValue(cellForCategory.getValue() + value)
    const cellForRemainingAmount = dataRange.getCell(rowForCurrentMonth, columnForRemainingAmount)
    cellForRemainingAmount.setValue(cellForRemainingAmount.getValue() - value)
  }
}

function test() {
  updateSpend(new Date("2023-08-02"), "Psicólogo", 1000)
}