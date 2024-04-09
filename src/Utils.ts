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

// TODO: column number for subcategories should be obtained from configuration of each sheet within each spreadsheet


function getColumnForSubCategory(categoryName: string, subCategory: string): number {
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

/**
 * Read and returns all rows from the main sheet within the main spreadsheet
 */
function getAllSpends(): any[][] {
  const rows = readAllRows(sheets.main.id, sheets.main.sheets.main.name)

  if (typeof rows === "undefined")
    throw new Error(
      `Undefined reading rows from sheet '${sheets.main.sheets.main.name}' within spreadsheet '${sheets.main.name}'`
    )

  return rows.slice(1)
}

/**
 * Groups spends by dates, category and sub-categories provided in parameters. The result will be an object like this :
 * ```
 * {
 *   "4/2024" : {
 *     "category_1" : 1
 *     "category_2" : 1
 *   },
 *   "5/2024" : {
 *     "category_1" : 1,
 *     "category_2" : 1
 *   },
 * }
 * ```
 * Notice only date and month of spends are considered for the first level keys. For example, if there are two spends one
 * in 3/4/2024" and another in "4/4/2024", both will account for the same sub-group "4/2024".
 *
 *
 * @param rows rows with spends from the main spreadsheet
 * @param dates list of dates to filter and group spends as described above
 * @param account account name to filter spends, or null to return spends made on any account
 * @param categories list of categories to filter and group as described above
 * @returns an object as described above
 */
function groupSpendsByDatesAndCategories(
  rows: any[][],
  dates: Date[],
  account: string | null,
  categories: string[]
): object {
  const accountColumn = 6
  const categoryColumn = 3
  const amountColumn = 7
  const dateColumn = 1

  const formattedDates = dates.map((date) => formatDate(date, 2))

  return rows.reduce((acc, row: any[]) => {
    const currentFormattedDate = formatDate(row[dateColumn], 2)
    const currentCategory = row[categoryColumn]
    const currentAccount = row[accountColumn]

    if (
      formattedDates.includes(currentFormattedDate) &&
      categories.includes(currentCategory) &&
      (account === null || account === currentAccount)
    ) {
      if (!acc[currentFormattedDate]) {
        acc[currentFormattedDate] = {}
      }

      if (!acc[currentFormattedDate][currentCategory]) {
        acc[currentFormattedDate][currentCategory] = row[amountColumn]
      } else {
        acc[currentFormattedDate][currentCategory] = acc[currentFormattedDate][currentCategory] + row[amountColumn]
      }
    }
    return acc
  }, {})
}

/**
 * Groups spends by dates, category and sub-categories provided in parameters. The result will be an object like this :
 *
 * ```
 * {
 *   "4/2024" : {
 *     "subcategory_1" : 1
 *     "subcategory_2" : 1
 *   },
 *   "5/2024" : {
 *     "subcategory_1" : 1,
 *     "subcategory_2" : 1
 *   },
 * }
 * ```
 *
 * Notice only date and month of spends are considered for the first level keys. For example, if there are two spends one
 * in 3/4/2024" and another in "4/4/2024", both will account for the same sub-group "4/2024".
 *
 * Previously check that sub-categories correspond to the given category, otherwise this function will return no results.
 *
 * @param rows rows with spends from the main spreadsheet
 * @param dates list of dates to filter and group spends as described above
 * @param category category name to filter and group spends as described above
 * @param subCategories list of sub-categories to filter and group as described above
 * @returns an object as described above
 */
function groupSpendsByDatesAndSubCategories(
  rows: any[][],
  dates: Date[],
  category: string,
  subCategories: string[]
): object {
  const dateColumn = 1
  const categoryColumn = 3
  const subCategoryColumn = 4
  const amountColumn = 7
  const formattedDates = dates.map((date) => formatDate(date, 2))

  return rows.reduce((acc, row: any[]) => {
    const currentFormattedDate = formatDate(row[dateColumn], 2)
    const currentCategory = row[categoryColumn]
    const currentSubCategory = row[subCategoryColumn]

    if (
      formattedDates.includes(currentFormattedDate) &&
      currentCategory === category &&
      subCategories.includes(currentSubCategory)
    ) {
      if (!acc[currentFormattedDate]) {
        acc[currentFormattedDate] = {}
      }

      if (!acc[currentFormattedDate][currentSubCategory]) {
        acc[currentFormattedDate][currentSubCategory] = row[amountColumn]
      } else {
        acc[currentFormattedDate][currentSubCategory] = acc[currentFormattedDate][currentSubCategory] + row[amountColumn]
      }
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
 * Formats a `Date` object into an string with one of these formats :
 * 1. DD/MM/YYYY
 * 2. MM/YYYY
 * @param date date to be formatted
 * @param format format to be used (1 or 2)
 * @returns formatted string
 */
function formatDate(date: Date, format = 1): string {
  if (format !== 1 && format !== 2) {
    throw new Error("Invalid format, possible values : 1 or 2")
  }

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")

  if (format === 1) {
    const day = date.getDate().toString().padStart(2, "0")
    return `${day}/${month}/${year}`
  } else {
    return `${month}/${year}`
  }
}

function testUpdateSpend() {
  updateSpend(new Date("2023-08-02"), "Psicólogo", 1000)
}
