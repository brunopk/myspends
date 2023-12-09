function getCategoryConfiguration(categoryName: string): CategoryConfig | undefined {
  const categoryConfig = Object.keys(categories)
    .filter((key) => categories[key].name === categoryName)
    .map((key) => categories[key])
    .at(0)
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
  if (typeof categoryConfig === "undefined") throw new Error(`Unknown category "${categoryName}"`)
  return categoryConfig.column
}

function getColumnForSubcategory(categoryName: string, subCategory: string): number {
  const categoryConfig = getCategoryConfiguration(categoryName)
  if (typeof categoryConfig === "undefined") throw new Error(`Unknown category "${categoryName}"`)
  return getSubcategoryConfiguration(categoryConfig, subCategory).column
}

function getNumberOfSubcategories(categoryName: string): number {
  if (categoryName === categories.category_1.name) {
    return 2
  } else {
    const categoryConfig = getCategoryConfiguration(categoryName)
    if (typeof categoryConfig === "undefined") {
      throw new Error(`Unknown category "${categoryName}"`)
    }
    if (typeof categoryConfig.subCategories === "undefined") {
      throw new Error(`No subcategories defined for "${categoryName}"`)
    }
    return Object.keys(categoryConfig.subCategories).length
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

function getSheetConfiguration(spreadSheetConfig: SpreadSheetConfig, sheetName: string): SheetConfig {
  for (let key in spreadSheetConfig.sheets) {
    if (spreadSheetConfig.sheets[key].name === sheetName) {
      return spreadSheetConfig.sheets[key]
    }
  }
  throw new Error(`Configuration for sheet "${sheetName}" of spreadsheet "${spreadSheetConfig.name}" not found `)
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