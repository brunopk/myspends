import { sheets } from "googleapis/build/src/apis/sheets"

/**
 * Read and returns all rows from the reimbursements form
 */
function getAllReimbursements(): any[][] {
  const rows = readAllRows(forms.spreadSheetId, forms.sheets.reimbursements.name)

  if (typeof rows === "undefined")
    throw new Error(
      `Undefined reading rows from sheet '${forms.sheets.reimbursement.name}' within spreadsheet '${forms.spreadSheetName}'`
    )

  return rows.slice(1)
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
 * Groups spends by dates, category and sub-categories provided in parameters (see groupRowsByDatesAndCategories description).
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
  return groupRowsByDatesAndCategories(rows, spreadSheets.main.sheets.main, dates, account, categories)
}

/**
 * Groups spends by dates, category and sub-categories provided in parameters (see groupRowsByDatesAndSubCategories 
 * description).
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
  return groupRowsByDatesAndSubCategories(rows, spreadSheets.main.sheets.main, dates, category, subCategories)
}

/**
 * Groups reimbursements by dates, category and sub-categories provided in parameters (see groupRowsByDatesAndCategories
 * description).
 *
 * @param rows rows with spends from the main spreadsheet
 * @param dates list of dates to filter and group spends as described above
 * @param account account name to filter spends, or null to return spends made on any account
 * @param categories list of categories to filter and group as described above
 * @returns an object as described above
 */
function groupReimbursementsByDatesAndCategories(
  rows: any[][],
  dates: Date[],
  account: string | null,
  categories: string[]
): object {
  return groupRowsByDatesAndCategories(rows, forms.sheets.reimbursements, dates, account, categories)
}

/**
 * Groups reimbursments by dates, category and sub-categories provided in parameters (see groupRowsByDatesAndSubCategories 
 * description).
 *
 * @param rows rows with spends from the main spreadsheet
 * @param dates list of dates to filter and group spends as described above
 * @param category category name to filter and group spends as described above
 * @param subCategories list of sub-categories to filter and group as described above
 * @returns an object as described above
 */
function groupReimbursementsByDatesAndSubCategories(
  rows: any[][],
  dates: Date[],
  category: string,
  subCategories: string[]
): object {
  return groupRowsByDatesAndSubCategories(rows, forms.sheets.reimbursements, dates, category, subCategories)
}

/**
 * Groups rows (spends or reimbursements, both have the same columns) by dates, category and sub-categories provided in parameters. 
 * The result will be an object like this :
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
function groupRowsByDatesAndCategories(
  rows: any[][],
  sheetConfig: SheetConfig,
  dates: Date[],
  account: string | null,
  categories: string[]
): object {
  const formattedDates = dates.map((date) => formatDate(date, 2))

  return rows.reduce((acc, row: any[]) => {
    const currentFormattedDate = formatDate(row[sheetConfig.columns!.date - 1], 2)
    const currentCategory = row[sheetConfig.columns!.category - 1]
    const currentAccount = row[sheetConfig.columns!.account - 1]

    if (
      formattedDates.includes(currentFormattedDate) &&
      categories.includes(currentCategory) &&
      (account === null || account === currentAccount)
    ) {
      if (!acc[currentFormattedDate]) {
        acc[currentFormattedDate] = {}
      }

      if (!acc[currentFormattedDate][currentCategory]) {
        acc[currentFormattedDate][currentCategory] = row[sheetConfig.columns!.amount - 1]
      } else {
        acc[currentFormattedDate][currentCategory] =
          acc[currentFormattedDate][currentCategory] + row[sheetConfig.columns!.amount - 1]
      }
    }
    return acc
  }, {})
}

/**
 * Groups rows (spends or reimbursements, both have the same columns) by dates, category and sub-categories provided in
 * parameters. The result will be an object like this :
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
function groupRowsByDatesAndSubCategories(
  rows: any[][],
  sheetConfig: SheetConfig,
  dates: Date[],
  category: string,
  subCategories: string[]
): object {
  const formattedDates = dates.map((date) => formatDate(date, 2))

  return rows.reduce((acc, row: any[]) => {
    const currentFormattedDate = formatDate(row[sheetConfig.columns!.date - 1], 2)
    const currentCategory = row[sheetConfig.columns!.category - 1]
    const currentSubCategory = row[sheetConfig.columns!.subCategory - 1]

    if (
      formattedDates.includes(currentFormattedDate) &&
      currentCategory === category &&
      subCategories.includes(currentSubCategory)
    ) {
      if (!acc[currentFormattedDate]) {
        acc[currentFormattedDate] = {}
      }

      if (!acc[currentFormattedDate][currentSubCategory]) {
        acc[currentFormattedDate][currentSubCategory] = row[sheetConfig.columns!.amount - 1]
      } else {
        acc[currentFormattedDate][currentSubCategory] =
          acc[currentFormattedDate][currentSubCategory] + row[sheetConfig.columns!.amount - 1]
      }
    }
    return acc
  }, {})
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
 * 3. DD/MM/YYYY HH:MM:SS
 * @param date date to be formatted
 * @param format format to be used (1 or 2)
 * @returns formatted string
 */
function formatDate(date: Date, format = 1): string {
  if (format !== 1 && format !== 2 && format !== 3) {
    throw new Error("Invalid format, possible values : 1, 2 or 3")
  }

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")

  if (format === 1) {
    return `${day}/${month}/${year}`
  } else if (format === 2) {
    return `${month}/${year}`
  } else {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }
}

/**
 * If a `Date` element is found, maps it to the formatted representation using the `formatDate` function in Utils.ts
 * @param row row to map
 * @param dateFormat see date formats in function `formatDate` from Utils.ts
 */
function formatRow(row: any[], dateFormat: number) {
  return row.map((elem) => (elem instanceof Date ? formatDate(elem, dateFormat) : elem))
}

/**
 * Returns `true` if both dates are equal considering up to seconds.
 * @param a date a
 * @param b date b
 */
function sameDates(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate() &&
    a.getHours() === b.getHours() &&
    a.getMinutes() === b.getMinutes() &&
    a.getSeconds() === b.getSeconds()
  )
}

function buildRecurrentSpendHtmlMailBody(language: string, template: string) {
  let result = `<span>${template}</span><br>`

  switch (language) {
    case "es":
      result += `<span>Fecha: ${formatDate(new Date(), 1)}</span><br>`
      break
    case "en":
      result += `<span>Date: ${formatDate(new Date(), 1)}</span><br>`
      break
    default:
      throw new Error(`Invalid language ${language}, allowed values are 'es' or 'en'}`)
  }

  return result
}