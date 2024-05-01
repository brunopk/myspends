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
  const rows = readAllRows(spreadSheets.main.id, spreadSheets.main.sheets.main.name)

  if (typeof rows === "undefined")
    throw new Error(
      `Undefined reading rows from sheet '${spreadSheets.main.sheets.main.name}' within spreadsheet '${spreadSheets.main.name}'`
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
  const formattedDates = dates.map((date) => formatDate(date, 2))

  return rows.reduce((acc, row: any[]) => {
    const currentFormattedDate = formatDate(row[spreadSheets.main.sheets.main.columns!.date - 1], 2)
    const currentCategory = row[spreadSheets.main.sheets.main.columns!.category - 1]
    const currentAccount = row[spreadSheets.main.sheets.main.columns!.account - 1]

    if (
      formattedDates.includes(currentFormattedDate) &&
      categories.includes(currentCategory) &&
      (account === null || account === currentAccount)
    ) {
      if (!acc[currentFormattedDate]) {
        acc[currentFormattedDate] = {}
      }

      if (!acc[currentFormattedDate][currentCategory]) {
        acc[currentFormattedDate][currentCategory] = row[spreadSheets.main.sheets.main.columns!.amount - 1]
      } else {
        acc[currentFormattedDate][currentCategory] =
          acc[currentFormattedDate][currentCategory] + row[spreadSheets.main.sheets.main.columns!.amount - 1]
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
  const formattedDates = dates.map((date) => formatDate(date, 2))

  return rows.reduce((acc, row: any[]) => {
    const currentFormattedDate = formatDate(row[spreadSheets.main.sheets.main.columns!.date - 1], 2)
    const currentCategory = row[spreadSheets.main.sheets.main.columns!.category - 1]
    const currentSubCategory = row[spreadSheets.main.sheets.main.columns!.subCategory - 1]

    if (
      formattedDates.includes(currentFormattedDate) &&
      currentCategory === category &&
      subCategories.includes(currentSubCategory)
    ) {
      if (!acc[currentFormattedDate]) {
        acc[currentFormattedDate] = {}
      }

      if (!acc[currentFormattedDate][currentSubCategory]) {
        acc[currentFormattedDate][currentSubCategory] = row[spreadSheets.main.sheets.main.columns!.amount - 1]
      } else {
        acc[currentFormattedDate][currentSubCategory] =
          acc[currentFormattedDate][currentSubCategory] + row[spreadSheets.main.sheets.main.columns!.amount - 1]
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

function buildPendingSpendRow(recurrentSpend: RecurrentSpendConfig, now: Date, taskId: string): any[] {
  const row = Array(Object.keys(spreadSheets.main.sheets.pending.columns!).length).fill(0)
  row[spreadSheets.main.sheets.pending.columns!.category - 1] = recurrentSpend.category
  row[spreadSheets.main.sheets.pending.columns!.subCategory - 1] =
    typeof recurrentSpend.subCategory !== "undefined" ? recurrentSpend.subCategory : ""
  row[spreadSheets.main.sheets.pending.columns!.timestamp - 1] = now
  row[spreadSheets.main.sheets.pending.columns!.amount - 1] = recurrentSpend.amount
  row[spreadSheets.main.sheets.pending.columns!.account - 1] = recurrentSpend.account
  row[spreadSheets.main.sheets.pending.columns!.taskId - 1] = taskId
  row[spreadSheets.main.sheets.pending.columns!.description - 1] = recurrentSpend.description
  row[spreadSheets.main.sheets.pending.columns!.completed - 1] = false
  return row
}

function mapPendingSpendToSpend(row: any[]): Spend {
  const spend: Spend = {
    account: row[spreadSheets.main.sheets.pending.columns!.account - 1],
    category: row[spreadSheets.main.sheets.pending.columns!.category - 1],
    date: new Date(),
    description: row[spreadSheets.main.sheets.pending.columns!.description - 1],
    origin: originTasks,
    amount: row[spreadSheets.main.sheets.pending.columns!.amount - 1]
  }
  if (row[spreadSheets.main.sheets.pending.columns!.subCategory - 1] !== "") {
    spend.subCategory = row[spreadSheets.main.sheets.pending.columns!.subCategory - 1]
  }
  return spend
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
