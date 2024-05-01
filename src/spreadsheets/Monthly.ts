/*************************************************************************************************************************/
/*                                                     COMMON FUNCTIONS                                                  */
/*************************************************************************************************************************/

/**
 * If a `Date` element is found, maps it to the formatted representation using the `formatDate` function in Utils.ts
 * @param row row to map
 */
function mapDates(row: any[]) {
  return row.map((elem) => (elem instanceof Date ? formatDate(elem, 2) : elem))
}

/**
 * Validate sheets like `AllCategories` and `Category` which have the same format.
 * @param groupedSpends the result of invoking `groupSpendsByDatesAndSubCategories` or `groupSpendsByDatesAndCategories`
 *  in Utils.ts
 * @param data data to validate
 * @param groupingElements categories or subcategories (see `groupSpendsByDatesAndSubCategories` and
 * `groupSpendsByDatesAndCategories` in Utils.ts)
 */
function validateSheet(
  spreadSheetConfig: SpreadSheetConfig,
  sheetConfig: SheetConfig,
  groupedSpends: object,
  data: any[][],
  groupingElements: string[]
) {
  let currentDate = data![0][0]
  let rowMismatch = false
  let quantityMismatch = false
  data!.forEach((row) => {
    currentDate = row![0]
    let printRows = false
    let expectedMonthAmount = 0
    const expectedRow = [currentDate, ...Array(groupingElements?.length).fill(0), expectedMonthAmount]
    const formattedDate = formatDate(currentDate, 2)

    rowMismatch = rowMismatch || !Object.keys(groupedSpends).includes(formattedDate)
    if (rowMismatch) {
      console.warn(`There is a row for date ${formatDate(currentDate, 1)} but no spends found for that date.`)
    } else {
      groupingElements?.forEach((groupingElement) => {
        const index = sheetConfig.columns![groupingElement] - 1
        if (Object.keys(groupedSpends[formattedDate]).includes(groupingElement)) {
          const expectedAmount = groupedSpends[formattedDate][groupingElement]
          const actualAmount = row[index]
          printRows = printRows || expectedAmount != actualAmount
          quantityMismatch = quantityMismatch || expectedAmount != actualAmount
          expectedMonthAmount += expectedAmount
          expectedRow[index] = expectedAmount
        }
      })
    }

    // Hide quantity mismatch errors if there was a row mismatch type error
    if (!rowMismatch) {
      expectedRow[expectedRow.length - 1] = expectedMonthAmount
      if (printRows) {
        console.warn(`Expected row : ${mapDates(expectedRow)}\nActual row : ${mapDates(row)}\n`)
      }
    }
  })

  const tips: string[] = []
  if (quantityMismatch) {
    tips.push("Check amounts for each category")
  }
  if (quantityMismatch || rowMismatch) {
    tips.push(`Check category/subcategory names are correct for all spends.`)
    tips.push(
      `Check if the first row in sheet '${sheetConfig.name}' within spreadsheet '${spreadSheetConfig.name}' contains valid category/subcategory names`
    )
    console.warn(tips.join("\n"))
  }
}

/*************************************************************************************************************************/
/*                                                         SHEETS                                                        */
/*************************************************************************************************************************/

class AllCategories extends BaseSheetHandler {
  processSpend(spend: Spend): void {
    const categoryColumn = this.sheetConfig.columns![spend.category]
    const numberOfColumns = getNumberOfColumns(this.spreadSheetConfig.id, this.sheetConfig.name)
    const monthRow = this.getRowForMonth(spend.date.getMonth())
    if (!monthRow) {
      const newRow = Array(this.sheetConfig.numberOfColumns).fill(0)
      newRow[0] = spend.date
      newRow[categoryColumn - 1] = spend.amount
      newRow[numberOfColumns - 1] = spend.amount

      addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
    } else {
      const currentCategoryValue = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, categoryColumn)
      setValue(
        this.spreadSheetConfig.id,
        this.sheetConfig.name,
        monthRow,
        categoryColumn,
        currentCategoryValue + spend.amount
      )

      const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, numberOfColumns)
      setValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, numberOfColumns, currentTotal + spend.amount)
    }
  }

  validate(): void {
    const rows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    const [headers, data] = [rows?.slice(0, 1)[0], rows?.slice(1)]
    const categories = headers?.slice(1, headers.length - 1)
    const dates = data?.map((row) => row[0])
    const allSpends = getAllSpends()
    const groupedSpends = groupSpendsByDatesAndCategories(allSpends, dates!, null, categories!)
    validateSheet(this.spreadSheetConfig, this.sheetConfig, groupedSpends, data!, categories!)
  }
}

/*************************************************************************************************************************/

class Category extends BaseSheetHandler {
  private category: string

  constructor(spreadSheetConfig: SpreadSheetConfig, sheetConfig: SheetConfig) {
    super(spreadSheetConfig, sheetConfig)
    this.category = sheetConfig.name
  }

  processSpend(spend: Spend) {
    if (spend.category === this.category) {
      const subcategoryColumn = this.sheetConfig.columns![spend.subCategory!]
      const numberOfColumns = getNumberOfColumns(this.spreadSheetConfig.id, this.sheetConfig.name)
      const monthRow = this.getRowForMonth(spend.date.getMonth())
      if (!monthRow) {
        const newRow = Array(this.sheetConfig.numberOfColumns).fill(0)
        newRow[0] = spend.date
        newRow[subcategoryColumn - 1] = spend.amount
        newRow[numberOfColumns - 1] = spend.amount
        addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
      } else {
        const currentSubcategoryTotal = getValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          monthRow,
          subcategoryColumn
        )
        setValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          monthRow,
          subcategoryColumn,
          currentSubcategoryTotal + spend.amount
        )

        const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, numberOfColumns)
        setValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          monthRow,
          numberOfColumns,
          currentTotal + spend.amount
        )
      }
    }
  }

  validate(): void {
    const rows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    const [headers, data] = [rows?.slice(0, 1)[0], rows?.slice(1)]
    const subCategories = headers?.slice(1, headers.length - 1)
    const dates = data?.map((row) => row[0])
    const allSpends = getAllSpends()
    const groupedSpends = groupSpendsByDatesAndSubCategories(allSpends, dates!, this.category, subCategories!)
    validateSheet(this.spreadSheetConfig, this.sheetConfig, groupedSpends, data!, subCategories!)
  }
}

/*************************************************************************************************************************/

class Account extends BaseSheetHandler {
  processSpend(spend: Spend) {
    if (spend.account === this.sheetConfig.name) {
      const monthRow = this.getRowForMonth(spend.date.getMonth())
      const numberOfColumns = getNumberOfColumns(this.spreadSheetConfig.id, this.sheetConfig.name)
      if (!monthRow) {
        const newRow = Array(this.sheetConfig.numberOfColumns).fill(0)
        newRow[0] = spend.date
        newRow[this.sheetConfig.columns![spend.category] - 1] = spend.amount
        newRow[numberOfColumns - 1] = spend.amount

        addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
      } else {
        const columnForCategory = this.sheetConfig.columns![spend.category]
        const currentCategoryAmount = getValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          monthRow,
          columnForCategory
        )
        setValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          monthRow,
          columnForCategory,
          currentCategoryAmount + spend.amount
        )

        const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, numberOfColumns)
        setValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          monthRow,
          numberOfColumns,
          currentTotal + spend.amount
        )
      }
    }
  }

  validate(): void {
    const rows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    const [headers, data] = [rows?.slice(0, 1)[0], rows?.slice(1)]
    const categories = headers?.slice(1, headers.length - 1)
    const dates = data?.map((row) => row[0])
    const allSpends = getAllSpends()
    const groupedSpends = groupSpendsByDatesAndCategories(allSpends, dates!, this.sheetConfig.name, categories!)
    validateSheet(this.spreadSheetConfig, this.sheetConfig, groupedSpends, data!, categories!)
  }
}

/*************************************************************************************************************************/
/*                                                    SPREAD SHEET HANDLER                                               */
/*************************************************************************************************************************/

class Monthly extends BaseSpreadSheetHandler {
  constructor(spreadSheetConfig: SpreadSheetConfig) {
    const sheetHandlers: BaseSheetHandler[] = [
      new AllCategories(spreadSheetConfig, spreadSheetConfig.sheets.all_categories)
    ]

    const sheetNames = Object.keys(spreadSheetConfig.sheets)
      .filter(
        (key) =>
          typeof spreadSheetConfig.sheets[key].extra !== "undefined" &&
          typeof spreadSheetConfig.sheets[key].extra.type !== "undefined"
      )
      .map((key) => spreadSheetConfig.sheets[key].name)
    sheetNames.forEach((sheetName) => {
      const sheetConfig = getSheetConfiguration(spreadSheetConfig, sheetName)
      switch (sheetConfig.extra.type) {
        case sheetType.category:
          sheetHandlers.push(new Category(spreadSheetConfig, sheetConfig))
          break
        case sheetType.account:
          sheetHandlers.push(new Account(spreadSheetConfig, sheetConfig))
          break
        default:
          throw new Error(`Unknown sheet type "${sheetConfig.extra.type}"`)
      }
    })
    super(spreadSheetConfig, sheetHandlers)
  }
}

spreadSheetHandlers.push(new Monthly(spreadSheets.monthly))

console.info(`Handler for spreadsheet '${spreadSheets.monthly.name}' loaded correctly`)
