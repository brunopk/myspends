function getSpendCategory(range: GoogleAppsScript.Spreadsheet.Range): string {
  return range.getCell(1, 2).getValue()
}

function getSpendCategoryColumn(category) {
  switch (category) {
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
  const activeSpreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  const monthlySheet = activeSpreadSheet.getSheetByName("Mensual")

  activeSpreadSheet.setActiveSheet(monthlySheet)
  const dataRange = monthlySheet.getDataRange()

  console.log(dataRange.getRow())
  let currentMonthRow = null
  const data = dataRange.getValues()
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i+1][0].getMonth() == date.getMonth()) {
      currentMonthRow = i + 1
      break
    }
  }

  if (!currentMonthRow) {
    const newRow = [date, 0, 0, 0, 0, 0, 117168, 0, 117168] 
    newRow[getSpendCategoryColumn(category) - 1] = value
    newRow[6] = newRow[6] - value
    activeSpreadSheet.appendRow(newRow)
  }

  console.log(currentMonthRow)
}

function test() {
  updateSpend(new Date(), "Psicólogo", 1000)
}