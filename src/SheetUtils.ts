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

function getValue(spreadSheetId: string, sheetName: string, row: number, column: number): any {
  const spreadSheet = SpreadsheetApp.openById(spreadSheetId)
  const sheet = spreadSheet.getSheetByName(sheetName)
  const dataRange = sheet?.getDataRange()
  return dataRange?.getCell(row, column).getValue()
}

function setValue(spreadSheetId: string, sheetName: string, row: number, column: number, newValue: any) {
  const spreadSheet = SpreadsheetApp.openById(spreadSheetId)
  const sheet = spreadSheet.getSheetByName(sheetName)
  const dataRange = sheet?.getDataRange()
  return dataRange?.getCell(row, column).setValue(newValue)
}

function testReadAllRows() {
  console.log(readAllRows(""))
}
