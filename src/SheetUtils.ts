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

function getSubcategoryColumn(category: string, subCategory: string): number {
  const errorMessage = "Cannot obtain column for category 'C' and subcategory 'S'"
  switch (category) {
    case CATEGORY_1:
      switch (subCategory) {
        case CATEGORY_1_SUBCATEGORY_1:
          return 2
        case CATEGORY_1_SUBCATEGORY_2:
          return 3
        default:
          throw new Error(errorMessage.replace("C", category).replace("S", subCategory))
      }
    case CATEGORY_2:
      switch (subCategory) {
        case "Bus":
          return 2
        case "Nafta":
          return 3
        case "Taxi":
          return 4
        case "Uber":
          return 5
        default:
          throw new Error(errorMessage.replace("C", category).replace("S", subCategory))
      }
    default:
      throw new Error(errorMessage.replace("C", category).replace("S", subCategory))
  }
}

function getNumberOfSubcategories(category: string): number {
  switch (category) {
    case CATEGORY_1:
      return CATEGORY_1_NUMBER_OF_SUBCATEGORIES
    case CATEGORY_2:
      return CATEGORY_2_NUMBER_OF_SUBCATEGORIES
    default:
      throw new Error(`Cannot obtain number of subcategories for category '${category}'`)
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

function getTotalColumnForAccountSheet(accountSheetName: string) {
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

function getTotalColumnForCategorySheet(sheetName: string) {
  switch (sheetName) {
    case CATEGORY_1_SHEET_NAME:
      return CATEGORY_1_NUMBER_OF_SUBCATEGORIES + 2
    case CATEGORY_2_SHEET_NAME:
      return CATEGORY_2_NUMBER_OF_SUBCATEGORIES + 2
    default:
      throw new Error(`Cannot obtain total column for sheet '${sheetName}'`)
  }
}

function updateSheet(sheetName, date, value, category, subcategory) {
  const rowForCurrentMonth = getRowForCurrentMonth(sheetName, date)
  const updatingSheetLogMessage = "Updating sheet 'S' ..."
  if (sheetName === MONTHLY_SHEET_NAME) {
    console.log(updatingSheetLogMessage.replace("S", sheetName))
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
    console.log(updatingSheetLogMessage.replace("S", sheetName))
    if (!rowForCurrentMonth) {
      const newRow = [date, 0, 0, 0, 0, 0, 0, value]
      newRow[getSpendColumn(category) - 1] = value
      addRow(sheetName, newRow)
    } else {
      const currentCategoryAmount = getValue(sheetName, rowForCurrentMonth, getSpendColumn(category))
      setValue(sheetName, rowForCurrentMonth, getSpendColumn(category), currentCategoryAmount + value)

      const totalColum = getTotalColumnForAccountSheet(sheetName)
      const currentTotal = getValue(sheetName, rowForCurrentMonth, totalColum)
      setValue(sheetName, rowForCurrentMonth, totalColum, currentTotal + value)
    }
  } else if (sheetName == SHEET_FOR_ACCOUNT_3) {
    console.log(updatingSheetLogMessage.replace("S", sheetName))
    if (!rowForCurrentMonth) {
      const newRow = [date, value]
      addRow(sheetName, newRow)
    } else {
      const totalColum = getTotalColumnForAccountSheet(sheetName)
      const currentTotal = getValue(sheetName, rowForCurrentMonth, totalColum)
      setValue(sheetName, rowForCurrentMonth, totalColum, currentTotal + value)
    }
  } else if (sheetName == CATEGORY_1_SHEET_NAME || sheetName == CATEGORY_2_SHEET_NAME) {
    console.log(updatingSheetLogMessage.replace("S", sheetName))
    const subcategoryColumn = getSubcategoryColumn(category, subcategory)
    const totalColum = getTotalColumnForCategorySheet(sheetName)
    if (!rowForCurrentMonth) {
      const newRow = [date].concat(Array(getNumberOfSubcategories(category) + 1).fill(0))
      newRow[subcategoryColumn - 1] = value
      newRow[totalColum - 1] = value
      addRow(sheetName, newRow)
    } else {
      const currentSubcategoryTotal = getValue(sheetName, rowForCurrentMonth, subcategoryColumn)
      setValue(sheetName, rowForCurrentMonth, subcategoryColumn, currentSubcategoryTotal + value)

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
