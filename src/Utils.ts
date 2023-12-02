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

function getColumnForSubcategory(category: string, subCategory: string, discountApplied: boolean): number {
  const errorMessage = "Cannot obtain column for category '%C' and subcategory '%S'"
  switch (category) {
    case CATEGORIES.CATEGORY_1.NAME:
      return discountApplied ? 2 : 3
    case CATEGORIES.CATEGORY_2.NAME:
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

function getColumnForTotal(): number {
  // month column + categories  + 1
  return getNumberOfCategories() + 2
}

function getNumberOfSubcategoriesColumns(category: string): number {
  switch (category) {
    case CATEGORIES.CATEGORY_1.NAME:
      return 2
    case CATEGORIES.CATEGORY_2.NAME:
      return Object.keys(CATEGORIES.CATEGORY_2.SUBCATEGORIES).length
    default:
      throw new Error(`Cannot obtain number of subcategories for category '${category}'`)
  }
}

function getNumberOfCategories(): number {
  return Object.keys(CATEGORIES).length
}

function getTotalColumnForCategorySheet(sheetName: string) {
  switch (sheetName) {
    case CATEGORIES.CATEGORY_1.NAME:
      return 4
    case CATEGORIES.CATEGORY_2.NAME:
      return Object.keys(CATEGORIES.CATEGORY_2.SUBCATEGORIES).length + 2
    default:
      throw new Error(`Cannot obtain total column for sheet '${sheetName}'`)
  }
}

function updateSheet(
  spreadSheetId: string,
  sheetName: string,
  formName: string | null,
  date: Date,
  value: number,
  account: string,
  discountApplied: boolean,
  category: string,
  subcategory: string,
  description: string
) {
  const rowForCurrentMonth = getRowForCurrentMonth(spreadSheetId, sheetName, date)

  if (spreadSheetId === SPREADSHEETS.MAIN.ID) {
  } else if (spreadSheetId === SPREADSHEETS.MONTHLY.ID) {
    if (sheetName === SPREADSHEETS.MONTHLY.CATEGORIES_MAIN_SHEET) {
      console.info(updatingSheetLogMessage.replace("X", sheetName).replace("Y", spreadSheetId))
      if (!rowForCurrentMonth) {
        const newRowAux = Array(getNumberOfCategories() + getNumberOfExtraColumns()).fill(0)
        const newRow: (Date | number)[] = [date].concat(newRowAux)
        newRow[getColumnForCategory(category) - 1] = value
        newRow[getColumnForTotal() - 1] = value

        addRow(spreadSheetId, sheetName, newRow)
      } else {
        const columnForCategory = getColumnForCategory(category)
        const currentCategoryAmount = getValue(spreadSheetId, sheetName, rowForCurrentMonth, columnForCategory)
        setValue(spreadSheetId, sheetName, rowForCurrentMonth, columnForCategory, currentCategoryAmount + value)

        const columnForTotalSpend = getColumnForTotal()
        const currentTotal = getValue(spreadSheetId, sheetName, rowForCurrentMonth, columnForTotalSpend)
        setValue(spreadSheetId, sheetName, rowForCurrentMonth, columnForTotalSpend, currentTotal + value)
      }
    } else if (SPREADSHEETS.MONTHLY.ACCOUNT_SHEETS.indexOf(sheetName) !== -1) {
      console.info(updatingSheetLogMessage.replace("X", sheetName).replace("Y", spreadSheetId))
      if (!rowForCurrentMonth) {
        const newRowAux = Array(getNumberOfCategories() + 1).fill(0)
        const newRow: (Date | number)[] = [date].concat(newRowAux)
        newRow[getColumnForCategory(category) - 1] = value
        newRow[newRow.length - 1] = value

        addRow(spreadSheetId, sheetName, newRow)
      } else {
        const columnForCategory = getColumnForCategory(category)
        const currentCategoryAmount = getValue(spreadSheetId, sheetName, rowForCurrentMonth, columnForCategory)
        setValue(spreadSheetId, sheetName, rowForCurrentMonth, columnForCategory, currentCategoryAmount + value)

        const totalColum = getColumnForTotal()
        const currentTotal = getValue(spreadSheetId, sheetName, rowForCurrentMonth, totalColum)
        setValue(spreadSheetId, sheetName, rowForCurrentMonth, totalColum, currentTotal + value)
      }
    } else if (SPREADSHEETS.MONTHLY.CATEGORIES_SHEET.indexOf(sheetName) !== -1) {
      console.info(updatingSheetLogMessage.replace("X", sheetName).replace("Y", spreadSheetId))
      const subcategoryColumn = getColumnForSubcategory(category, subcategory, discountApplied)
      const totalColum = getTotalColumnForCategorySheet(sheetName)
      if (!rowForCurrentMonth) {
        const newRowAux = Array(getNumberOfSubcategoriesColumns(category) + 1).fill(0)
        const newRow: (Date | number)[] = [date].concat(newRowAux)
        newRow[subcategoryColumn - 1] = value
        newRow[totalColum - 1] = value
        addRow(spreadSheetId, sheetName, newRow)
      } else {
        const currentSubcategoryTotal = getValue(spreadSheetId, sheetName, rowForCurrentMonth, subcategoryColumn)
        setValue(spreadSheetId, sheetName, rowForCurrentMonth, subcategoryColumn, currentSubcategoryTotal + value)

        const currentTotal = getValue(spreadSheetId, sheetName, rowForCurrentMonth, totalColum)
        setValue(spreadSheetId, sheetName, rowForCurrentMonth, totalColum, currentTotal + value)
      }
    } else {
      throw new Error(`Sheet '${sheetName}' not found on spread sheet '${spreadSheetId}'`)
    }
  } else {
    throw new Error(`Sheet '${sheetName}' not found on spread sheet '${spreadSheetId}'`)
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${day}/${month}/${year}`
}

function testUpdateSpend() {
  updateSpend(new Date("2023-08-02"), "Psicólogo", 1000)
}
