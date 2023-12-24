function getCategoryConfiguration(categoryName: string): CategoryConfig {
  const categoryKey = Object.keys(categories)
    .filter((key) => categories[key].name === categoryName)
    .at(0)
  if (typeof categoryKey === "undefined") throw new Error(`Configuration for category '${categoryName}' not found.`)
  return categories[categoryKey]
}

function getSubcategoryConfiguration(categoryConfig: CategoryConfig, subCategoryName: string) {
  if (typeof categoryConfig.subCategories === "undefined")
    throw new Error(`No sub categories defined for category "${categoryConfig.name}"`)
  const subcategoryKey = Object.keys(categoryConfig.subCategories)
    .filter(
      (key) =>
        typeof categoryConfig.subCategories !== "undefined" &&
        categoryConfig.subCategories[key].name === subCategoryName
    )
    .at(0)
  if (typeof subcategoryKey === "undefined") throw new Error(`Unknown sub category "${subCategoryName}"`)
  return categoryConfig.subCategories[subcategoryKey]
}

function getColumnForCategory(categoryName: string) {
  const categoryConfig = getCategoryConfiguration(categoryName)
  return categoryConfig.column
}

function getColumnForSubcategory(categoryName: string, subCategory: string): number {
  const categoryConfig = getCategoryConfiguration(categoryName)
  return getSubcategoryConfiguration(categoryConfig, subCategory).column
}

function getNumberOfSubcategories(categoryName: string): number {
  const categoryConfig = getCategoryConfiguration(categoryName)
  if (typeof categoryConfig.subCategories === "undefined")
    throw new Error(`No subcategories defined for category '${categoryName}'.`)
  return Object.keys(categoryConfig.subCategories).length
}

function getNumberOfCategories(): number {
  return Object.keys(categories).length
}

function getSheetConfiguration(spreadSheetConfig: SpreadSheetConfig, sheetName: string): SheetConfig {
  for (const key in spreadSheetConfig.sheets) {
    if (spreadSheetConfig.sheets[key].name === sheetName) {
      return spreadSheetConfig.sheets[key]
    }
  }
  throw new Error(`Configuration for sheet "${sheetName}" of spreadsheet "${spreadSheetConfig.name}" not found `)
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