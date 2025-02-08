import { tasks_v1 } from "googleapis"
import { sheets } from "googleapis/build/src/apis/sheets"

/**
 * Calculate saved percentage
 * @param savedAmount use `calculateSavedAmount` to obtain this value
 * @param income income amount
 * @returns returns saved percentage or `undefined` if income is 0
 */
function calculateSavedPercentage(savedAmount: number, income: number): number {
  return Math.round((savedAmount * 100) / income)
}

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

function generateSpendWithRecurrentSpendRow(row: any[]): Spend {
  const spend: Spend = {
    account: row[spreadSheets.main.sheets.recurrentSpends.columns!.account - 1],
    category: row[spreadSheets.main.sheets.recurrentSpends.columns!.category - 1],
    description: row[spreadSheets.main.sheets.recurrentSpends.columns!.description - 1],
    amount: row[spreadSheets.main.sheets.recurrentSpends.columns!.amount - 1],
    origin: originTasks,
    date: new Date()
  }
  if (row[spreadSheets.main.sheets.recurrentSpends.columns!.subCategory - 1] !== "") {
    spend.subCategory = row[spreadSheets.main.sheets.recurrentSpends.columns!.subCategory - 1]
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

function createRecurrentSpendTask(recurrentSpend: RecurrentSpend): string {
  const now = new Date()
  const taskId = createTask(recurrentSpendsTaskList, recurrentSpend.taskTitle, now)
  const taskDescription = buildRecurrentSpendTaskDescription(recurrentSpend)
  const taskTitle = buildRecurrentSpendTaskTitle(recurrentSpend, taskId)
  updateTaskDescription(recurrentSpendsTaskList, taskId, taskDescription)
  updateTaskTitle(recurrentSpendsTaskList, taskId, taskTitle)
  return taskId
}

function extractAmountFromRecurrentSpendTask(task: tasks_v1.Schema$Task): number {
  const taskDescription = task.notes
  if (typeof taskDescription === "undefined" || taskDescription == "") {
    throw new Error(`Empty task description`)
  }

  let regex
  switch (recurrentSpendsLanguage) {
    case "es":
      regex = /.*\s+Fecha\s*:\s*\d{1,2}\/\d{1,2}\/\d{4}\s+Costo\s*:\s*(\d+)/
      break
    case "en":
      regex = /.*\s+Date\s*:\s*\d{1,2}\/\d{1,2}\/\d{4}\s+Amount\s*:\s*(\d+)/
      break
    default:
      throw new Error(`Invalid language ${recurrentSpendsLanguage}, allowed values are 'es' or 'en'}`)
  }

  const match = taskDescription?.match(regex)
  if (match) {
    return parseInt(match[1], 10)
  } else {
    throw Error(`Cannot extract amount from task description: "${taskDescription}"`)
  }
}

function buildRecurrentSpendTaskDescription(recurrentSpend: RecurrentSpend) {
  const currentDate = formatDate(new Date())
  let result = `${recurrentSpend.taskDescription}\n\n`

  switch (recurrentSpendsLanguage) {
    case "es":
      result += `Fecha: ${currentDate}\nCosto: ${recurrentSpend.amount}
      `
      break
    case "en":
      result += `Date: ${currentDate}\nAmount: ${recurrentSpend.amount}
      `
      break
    default:
      throw new Error(`Invalid language ${recurrentSpendsLanguage}, allowed values are 'es' or 'en'}`)
  }

  return result
}

function buildRecurrentSpendTaskTitle(recurrentSpend: RecurrentSpend, taskId: string) {
  return `${recurrentSpend.taskTitle} (${taskId})`
}

function buildRecurrentSpendRow(recurrentSpend: RecurrentSpend, now: Date, taskId: string): any[] {
  const row = Array(Object.keys(spreadSheets.main.sheets.recurrentSpends.columns!).length).fill(0)
  row[spreadSheets.main.sheets.recurrentSpends.columns!.category - 1] = recurrentSpend.category
  row[spreadSheets.main.sheets.recurrentSpends.columns!.timestamp - 1] = now
  row[spreadSheets.main.sheets.recurrentSpends.columns!.amount - 1] = recurrentSpend.amount
  row[spreadSheets.main.sheets.recurrentSpends.columns!.account - 1] = recurrentSpend.account
  row[spreadSheets.main.sheets.recurrentSpends.columns!.taskId - 1] = taskId
  row[spreadSheets.main.sheets.recurrentSpends.columns!.description - 1] = recurrentSpend.description
  row[spreadSheets.main.sheets.recurrentSpends.columns!.completed - 1] = false
  row[spreadSheets.main.sheets.recurrentSpends.columns!.subCategory - 1] =
    typeof recurrentSpend.subCategory !== "undefined" ? recurrentSpend.subCategory : ""
  return row
}

function buildRecurrentSpendHtmlMailBody(recurrentSpend: RecurrentSpend, recurrentSpendTaskId: string) {
  let result = `<span>${recurrentSpend.mailBody}</span><br><br>`
  result += `<span>Task ID: ${recurrentSpendTaskId}</span><br>`

  switch (recurrentSpendsLanguage) {
    case "es":
      result += `<span>Fecha: ${formatDate(new Date(), 1)}</span><br>`
      break
    case "en":
      result += `<span>Date: ${formatDate(new Date(), 1)}</span><br>`
      break
    default:
      throw new Error(`Invalid language ${recurrentSpendsLanguage}, allowed values are 'es' or 'en'}`)
  }

  return result
}

function validateRecurrentSpend(recurrentSpend: RecurrentSpend) {
  if (![manualRecurrentSpend, automaticRecurrentSpend].includes(recurrentSpend.type)) {
    throw new Error(`Invalid recurrent spend type "${recurrentSpend.type}"`)
  }

  if (recurrentSpend.sendTask && typeof recurrentSpend.taskTitle === "undefined") {
    throw new Error(`No taskTitle defined for recurrent spend ${JSON.stringify(recurrentSpend)}`)
  }

  if (recurrentSpend.sendTask && typeof recurrentSpend.taskDescription === "undefined") {
    throw new Error(`No taskDescription defined for recurrent spend ${JSON.stringify(recurrentSpend)}`)
  }

  if (recurrentSpend.sendMail && typeof recurrentSpend.mailBody === "undefined") {
    throw new Error(`No mailBody defined for recurrent spend ${JSON.stringify(recurrentSpend)}`)
  }

  if (recurrentSpend.sendMail && typeof recurrentSpend.mailSubject === "undefined") {
    throw new Error(`No mailSubject defined for recurrent spend ${JSON.stringify(recurrentSpend)}`)
  }
}
