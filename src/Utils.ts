function getCategoryConfiguration(categoryName: string): CategoryConfig {
  const categoryConfig = Object.keys(categories)
    .filter((key) => categories[key].name === categoryName)
    .map((key) => categories[key])
    .at(0)
  if (typeof categoryConfig === "undefined") throw new Error(`Unknown category "${categoryName}"`)
  return categoryConfig
}

function getSubcategoryConfiguration(categoryConfig: CategoryConfig, subCategoryName: string) {
  if (typeof categoryConfig.subCategories === "undefined")
    throw new Error(`No sub categories defined for category "${categoryConfig.name}"`)
  const subcategoryConfig = Object.keys(categoryConfig.subCategories)
    .filter(
      (key) =>
        typeof categoryConfig.subCategories !== "undefined" &&
        typeof categoryConfig.subCategories[key].name === subCategoryName
    )
    .map((key) => categories[key])
    .at(0)
  if (typeof subcategoryConfig === "undefined") throw new Error(`Unknown sub category "${subCategoryName}"`)
  return categoryConfig
}

function getColumnForCategory(categoryName: string) {
  const categoryConfig = getCategoryConfiguration(categoryName)
  return categoryConfig.column
}

function getColumnForSubcategory(category: string, subCategory: string, discountApplied: boolean): number {
  const errorMessage = "Cannot obtain column for category '%C' and subcategory '%S'"
  switch (category) {
    case categories.category_1.name:
      // TODO: it should not depend on an extra param (discountApplied) there should be two subcategories to represent wether discount was applied or not
      return discountApplied ? 2 : 3
    case categories.category_2.name:
      return getSubcategoryConfiguration(getCategoryConfiguration(category), subCategory).column
    default:
      throw new Error(errorMessage.replace("%C", category).replace("%S", subCategory))
  }
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
  return Object.keys(categories).length
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
    } else if (SPREADSHEETS.MONTHLY.ACCOUNT_SHEETS.indexOf(sheetName) !== -1) {
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
