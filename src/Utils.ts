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
  if (typeof subcategoryKey === "undefined") throw new Error(`Unknown sub category "${subCategoryName}" for category "${categoryConfig.name}"`)
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

function getAllCategories(): string[] {
  return Object.keys(categories).map((key) => categories[key].name)
}

function getSheetConfiguration(spreadSheetConfig: SpreadSheetConfig, sheetName: string): SheetConfig {
  for (const key in spreadSheetConfig.sheets) {
    if (spreadSheetConfig.sheets[key].name === sheetName) {
      return spreadSheetConfig.sheets[key]
    }
  }
  throw new Error(`Configuration for sheet "${sheetName}" of spreadsheet "${spreadSheetConfig.name}" not found `)
}

/**
 * Filters spends on the main sheet based on the provided filter criteria passed as a parameter
 * @param categoryNames category names
 * @returns returns all rows matching the indicated criteria
 */
function filterSpends(categoryNames: string[]): any[] {
  const rows = readAllRows(spreadSheetConfig.main.id, spreadSheetConfig.main.sheets.main.name)
  if (typeof rows === "undefined")
    throw new Error(
      `Undefined array after reading rows from sheet '${spreadSheetConfig.main.id}' spreadsheet '${spreadSheetConfig.main.sheets.main.name}'`
    )
  return rows.filter((row) => categoryNames.indexOf(row[spreadSheetConfig.main.sheets.main.extra.categoryColumn]) !== -1)
}

// TODO: SEGUIR ACA PERO HACER QUE AGRUPE CON UNAS FECHAS ESPECIFICAS (PASADO COMO PARAMETRO) TENIENDO EN CUENTA SOLO MES/ANO , ESAS FECHAS VIENEN DE LAS PLANILLAS QUE SE VAN A VALIDAR
function groupSumSpendsByDatesAndCategory(rows: any[][]): object {
  return rows.reduce((acc, row: any[]) => {
    const formattedDate = formatDate(row[spreadSheetConfig.main.sheets.main.extra.dateColumn])
    if (!acc[formattedDate]) {
      acc[formattedDate] = {}
    }

    const category = row[spreadSheetConfig.main.sheets.main.extra.categoryColumn]
    if (!acc[formattedDate][category]) {
      acc[formattedDate][category] = row[spreadSheetConfig.main.sheets.main.extra.amountColumn]
    } else {
      acc[formattedDate][category] =
        acc[formattedDate][category] + row[spreadSheetConfig.main.sheets.main.extra.amountColumn]
    }
    return acc
  }, {})
}

function findSpreadSheetHandlerByName(
  spreadSheetHandlers: BaseSpreadSheetHandler[],
  spreadSheetName: string
): BaseSpreadSheetHandler | undefined {
  return spreadSheetHandlers.find((spreadSheetHandler) => spreadSheetHandler.config.name == spreadSheetName)
}

/**
 * Formats a {@code Date} object into an string with the pattern DD/MM/YYYY
 * @param date Form
 * @returns formatted string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${day}/${month}/${year}`
}

function testUpdateSpend() {
  updateSpend(new Date("2023-08-02"), "Psicólogo", 1000)
}
