function readAllRows(spreadSheetId: string, sheetName: string): any[][] | undefined {
  const spreadSheet = SpreadsheetApp.openById(spreadSheetId)
  const sheet = spreadSheet.getSheetByName(sheetName)
  const dataRange = sheet?.getDataRange()
  return dataRange?.getValues()
}

function addRow(spreadSheetId: string, sheetName: string, row: any[]) {
  const spreadSheet = SpreadsheetApp.openById(spreadSheetId)
  const spreadSheetName = spreadSheet.getName()
  const sheet = spreadSheet.getSheetByName(sheetName)
  sheet?.appendRow(row)
  console.info(`New row added on sheet "${sheetName}" of "${spreadSheetName}"`)
}

/**
 * Return the number of columns based on headers
 * @param spreadSheetId spread sheet id
 * @param sheetName sheet name within the spreadsheet
 */
function getNumberOfColumns(spreadSheetId: string, sheetName: string): number {
  const allRows = readAllRows(spreadSheetId, sheetName)
  return allRows![0].length!
}

// TODO: actualizar README explicando estás columnas especiales  

function getTotalColumn(sheetConfig: SheetConfig): number {
  const columnNumber = sheetConfig.columns!["Total"]
  if (typeof columnNumber === "undefined")
    throw new Error(`Total column not configured for sheet "${sheetConfig.name}"`)
  return columnNumber
}

function getTotalReimbursementColumn(sheetConfig: SheetConfig): number | undefined {
  let columnNumber = typeof sheetConfig.columns !== "undefined" ? sheetConfig.columns["Devolución"] : undefined
  if (typeof columnNumber === "undefined" && typeof sheetConfig.columns !== "undefined")
    columnNumber = sheetConfig.columns["Reimbursement"]
  return columnNumber
}

function getIncomeColumn(sheetConfig: SheetConfig): number {
  let columnNumber = typeof sheetConfig.columns !== "undefined" ? sheetConfig.columns["Ingreso"] : undefined
  if (typeof columnNumber === "undefined" && typeof sheetConfig.columns !== "undefined")
    columnNumber = sheetConfig.columns["Income"]
  if (typeof columnNumber === "undefined")
    throw new Error(`Income column not configured for sheet "${sheetConfig.name}"`)
  return columnNumber
}

function getSavedAmountColumn(sheetConfig: SheetConfig): number {
  let columnNumber = typeof sheetConfig.columns !== "undefined" ? sheetConfig.columns["Ahorrado"] : undefined
  if (typeof columnNumber === "undefined" && typeof sheetConfig.columns !== "undefined")
    columnNumber = sheetConfig.columns["Saved"]
  if (typeof columnNumber === "undefined")
    throw new Error(`Saved amount column not configured for sheet "${sheetConfig.name}"`)
  return columnNumber
}

function getSavedPercentageColumn(sheetConfig: SheetConfig): number {
  let columnNumber =
    typeof sheetConfig.columns !== "undefined" ? sheetConfig.columns["Ahorrado (porcentaje)"] : undefined
  if (typeof columnNumber === "undefined" && typeof sheetConfig.columns !== "undefined")
    columnNumber = sheetConfig.columns["Saved (percentage)"]
  if (typeof columnNumber === "undefined")
    throw new Error(`Saved percentage column not configured for sheet "${sheetConfig.name}"`)
  return columnNumber
}

/**
 * Get value
 * @param spreadSheetId .
 * @param sheetName .
 * @param row row in the range 1..n
 * @param column column in the range 1..n
 * @returns .
 */
function getValue(spreadSheetId: string, sheetName: string, row: number, column: number): any {
  const spreadSheet = SpreadsheetApp.openById(spreadSheetId)
  const sheet = spreadSheet.getSheetByName(sheetName)
  const dataRange = sheet?.getDataRange()
  return dataRange?.getCell(row, column).getValue()
}

/**
 * Get value
 * @param spreadSheetId .
 * @param sheetName .
 * @param row row in the range 1..n
 * @param column column in the range 1..n
 * @returns .
 */
function setValue(spreadSheetId: string, sheetName: string, row: number, column: number, newValue: any) {
  console.info(`Updating cell on row ${row} and column ${column} of sheet "${sheetName}"`)
  const spreadSheet = SpreadsheetApp.openById(spreadSheetId)
  const sheet = spreadSheet.getSheetByName(sheetName)
  const dataRange = sheet?.getDataRange()
  return dataRange?.getCell(row, column).setValue(newValue)
}

function testReadAllRows() {
  console.log(readAllRows(""))
}
