function getSpendColumn(category) {
  switch(category) {
    case "Celular":
      return 2
    case "Comida":
      return 3
    case "Psicólogo":
      return 4
    case "Salud":
      return 5
    case "Transporte":
      return 6
    case "Otros":
      return 7
    default:
      throw new Error(`Unknown category '${category}'`)
  }
}

function getRowForCurrentMonth(sheetName: string, date: Date): number {
  let rowForCurrentMonth
  const data = readAllRows(sheetName)?.slice(1)
  for (let i = 0; i < data.length; i++) {
    if (data[i][0].getMonth() == date.getMonth()) {
      // 1 (because of header row) + 1 (because first row index is 1)
      rowForCurrentMonth = i + 2
      break
    }
  }
  return rowForCurrentMonth
}

function getAccountSheet(account: string, category: string, subCategory: string): string {
  switch (account) {
    case ACCOUNT_1:
      return SHEET_FOR_ACCOUNT_1
    case ACCOUNT_2:
      return SHEET_FOR_ACCOUNT_2
    default:
      switch (category) {
        case CATEGORY_1:
          switch (subCategory) {
            case CATEGORY_1_SUBCATEGORY_1:
              return SHEET_FOR_ACCOUNT_1
            case CATEGORY_1_SUBCATEGORY_2:
              return SHEET_FOR_ACCOUNT_3
            default:
              throw new Error(
                `Cannot determine account sheet with account '${account}', category '${category}' and subcategory ${subCategory}`
              )
          }
        default:
          throw new Error(`Cannot determine account sheet with account '${account}' and category '${category}'`)
      }
  }
}

function getAccountSheetTotalColumn(accountSheetName: string) {
  switch (accountSheetName) {
    case SHEET_FOR_ACCOUNT_1:
      return ACCOUNT_1_SHEET_TOTAL_COLUMN
    case SHEET_FOR_ACCOUNT_2:
      return ACCOUNT_2_SHEET_TOTAL_COLUMN
    case SHEET_FOR_ACCOUNT_3:
      return ACCOUNT_3_SHEET_TOTAL_COLUMN
    default:
      throw new Error(`Cannot obtain total column for account sheet '${accountSheetName}'`)
  }
}

function updateSheet(sheetName, date, category, value) {
  const rowForCurrentMonth = getRowForCurrentMonth(sheetName, date)
  if (sheetName === MONTHLY_SHEET_NAME) {
    if (!rowForCurrentMonth) {
      const newRow = [date, 0, 0, 0, 0, 0, 0, value, INCOME, INCOME - value]
      newRow[getSpendColumn(category) - 1] = value
      newRow[MONTHLY_SHEET_REMAINING_AMOUNT_COLUMN - 1] = newRow[MONTHLY_SHEET_REMAINING_AMOUNT_COLUMN - 1] - value
      addRow(sheetName, newRow)
    } else {
      const currentCategoryAmount = getValue(sheetName, rowForCurrentMonth, getSpendColumn(category))
      setValue(sheetName, rowForCurrentMonth, getSpendColumn(category), currentCategoryAmount + value)

      const currentTotal = getValue(sheetName, rowForCurrentMonth, MONTHLY_SHEET_TOTAL_COLUMN)
      setValue(sheetName, rowForCurrentMonth, MONTHLY_SHEET_TOTAL_COLUMN, currentTotal + value)

      const currentRemainingAmount = getValue(sheetName, rowForCurrentMonth, MONTHLY_SHEET_REMAINING_AMOUNT_COLUMN)
      setValue(sheetName, rowForCurrentMonth, MONTHLY_SHEET_REMAINING_AMOUNT_COLUMN, currentRemainingAmount - value)
    }
  } else if (sheetName == SHEET_FOR_ACCOUNT_1 || sheetName == SHEET_FOR_ACCOUNT_2) {
    if (!rowForCurrentMonth) {
      const newRow = [date, 0, 0, 0, 0, 0, 0, value]
      newRow[getSpendColumn(category) - 1] = value
      addRow(sheetName, newRow)
    } else {
      const currentCategoryAmount = getValue(sheetName, rowForCurrentMonth, getSpendColumn(category))
      setValue(sheetName, rowForCurrentMonth, getSpendColumn(category), currentCategoryAmount + value)

      const totalColum = getAccountSheetTotalColumn(sheetName)
      const currentTotal = getValue(sheetName, rowForCurrentMonth, totalColum)
      setValue(sheetName, rowForCurrentMonth, totalColum, currentTotal + value)
    }
  } else if (sheetName == SHEET_FOR_ACCOUNT_3) {
    if (!rowForCurrentMonth) {
      const newRow = [date, value]
      addRow(sheetName, newRow)
    } else {
      const totalColum = getAccountSheetTotalColumn(sheetName)
      const currentTotal = getValue(sheetName, rowForCurrentMonth, totalColum)
      setValue(sheetName, rowForCurrentMonth, totalColum, currentTotal + value)
    }
  } else {
    throw new Error(`Cannot update sheet '${sheetName}', unknown sheet name`)
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
