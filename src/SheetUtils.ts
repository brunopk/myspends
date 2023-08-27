function getColumnForCategory(category) {
  switch (category) {
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

function getColumnForAccount(account: string) {
  switch (account) {
    case ACCOUNT_1:
      return getNumberOfCategories() + getNumberOfExtraColumns() + 1
    case ACCOUNT_2:
      return getNumberOfCategories() + getNumberOfExtraColumns() + 2
    case ACCOUNT_3:
      return getNumberOfCategories() + getNumberOfExtraColumns() + 3
    case ACCOUNT_4:
      return getNumberOfCategories() + getNumberOfExtraColumns() + 4
    default:
      throw new Error(`Unknown account '${account}'`)
  }
}

function getColumnForSubcategory(category: string, subCategory: string): number {
  const errorMessage = "Cannot obtain column for category '%C' and subcategory '%S'"
  switch (category) {
    case CATEGORY_1:
      switch (subCategory) {
        case CATEGORY_1_SUBCATEGORY_1:
          return 2
        case CATEGORY_1_SUBCATEGORY_2:
          return 3
        default:
          throw new Error(errorMessage.replace("%C", category).replace("%S", subCategory))
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
      throw new Error(errorMessage.replace("%C", category).replace("%S", subCategory))
  }
}

function getColumnForRemainingAmount() {
  // month column + categories + 1
  return getNumberOfCategories() + 2
}

function getColumnForTotalSpend(): number {
  // month column + categories  + remaining + 1
  return getNumberOfCategories() + 3
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

function getNumberOfCategories(): number {
  return 6
}

function getNumberOfAccounts(): number {
  return 4
}

function getNumberOfExtraColumns(): number {
  // month column + remaining amount column + total column
  return 3
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

function getAccountSheet(account: string): string | null {
  switch (account) {
    case ACCOUNT_1:
      return SHEET_FOR_ACCOUNT_1
    case ACCOUNT_2:
      return SHEET_FOR_ACCOUNT_2
    case ACCOUNT_4:
      return SHEET_FOR_ACCOUNT_4
    default:
      return null
  }
}

function getCategorySheet(category: string): string | null {
  switch (category) {
    case CATEGORY_1:
      return CATEGORY_1_SHEET_NAME
    case CATEGORY_2:
      return CATEGORY_2_SHEET_NAME
    default:
      return null
  }
}

function getTotalColumnForAccountSheet(accountSheetName: string) {
  switch (accountSheetName) {
    case SHEET_FOR_ACCOUNT_1:
      return 8
    case SHEET_FOR_ACCOUNT_2:
      return 8
    case SHEET_FOR_ACCOUNT_4:
      return 8
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

function updateSheet(
  sheetName: string,
  date: Date,
  account: string,
  value: number,
  category: string,
  subcategory: string
) {
  const rowForCurrentMonth = getRowForCurrentMonth(sheetName, date)
  const updatingSheetLogMessage = "Updating sheet 'S' ..."
  if (sheetName === MONTHLY_SHEET_NAME) {
    console.info(updatingSheetLogMessage.replace("S", sheetName))
    if (!rowForCurrentMonth) {
      const newRowAux = Array(getNumberOfCategories() + getNumberOfAccounts() + getNumberOfExtraColumns()).fill(0)
      const newRow: (Date | number)[] = [date].concat(newRowAux)
      newRow[getColumnForCategory(category) - 1] = value
      newRow[getColumnForAccount(account) - 1] = value
      newRow[getColumnForTotalSpend() - 1] = value
      newRow[getColumnForRemainingAmount() - 1] = INCOME - value
      newRow[newRow.length - 1] = INCOME

      addRow(sheetName, newRow)
    } else {
      const columnForCategory = getColumnForCategory(category)
      const currentCategoryAmount = getValue(sheetName, rowForCurrentMonth, columnForCategory)
      setValue(sheetName, rowForCurrentMonth, columnForCategory, currentCategoryAmount + value)

      const columnForTotalSpend = getColumnForTotalSpend()
      const currentTotal = getValue(sheetName, rowForCurrentMonth, columnForTotalSpend)
      setValue(sheetName, rowForCurrentMonth, columnForTotalSpend, currentTotal + value)

      const columnForRemainingAmount = getColumnForRemainingAmount()
      const currentRemainingAmount = getValue(sheetName, rowForCurrentMonth, columnForRemainingAmount)
      setValue(sheetName, rowForCurrentMonth, columnForRemainingAmount, currentRemainingAmount - value)

      const columnForAccount = getColumnForAccount(account)
      const currentAccountTotal = getValue(sheetName, rowForCurrentMonth, columnForAccount)
      setValue(sheetName, rowForCurrentMonth, columnForAccount, currentAccountTotal + value)
    }
  } else if (ACCOUNT_SHEETS.indexOf(sheetName) !== -1) {
    console.info(updatingSheetLogMessage.replace("S", sheetName))
    if (!rowForCurrentMonth) {
      const newRowAux = Array(getNumberOfCategories() + 1).fill(0)
      const newRow: (Date | number)[] = [date].concat(newRowAux)
      newRow[getColumnForCategory(category) - 1] = value
      newRow[newRow.length - 1] = value
      addRow(sheetName, newRow)
    } else {
      const columnForCategory = getColumnForCategory(category)
      const currentCategoryAmount = getValue(sheetName, rowForCurrentMonth, columnForCategory)
      setValue(sheetName, rowForCurrentMonth, columnForCategory, currentCategoryAmount + value)

      const totalColum = getTotalColumnForAccountSheet(sheetName)
      const currentTotal = getValue(sheetName, rowForCurrentMonth, totalColum)
      setValue(sheetName, rowForCurrentMonth, totalColum, currentTotal + value)
    }
  } else if (sheetName == CATEGORY_1_SHEET_NAME || sheetName == CATEGORY_2_SHEET_NAME) {
    console.info(updatingSheetLogMessage.replace("S", sheetName))
    const subcategoryColumn = getColumnForSubcategory(category, subcategory)
    const totalColum = getTotalColumnForCategorySheet(sheetName)
    if (!rowForCurrentMonth) {
      const newRowAux = Array(getNumberOfSubcategories(category) + 1).fill(0)
      const newRow: (Date | number)[] = [date].concat(newRowAux)
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
  console.log(`Adding new row on sheet "${sheetName}"`)
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
