/*************************************************************************************************************************/
/*                                                     COMMON FUNCTIONS                                                  */
/*************************************************************************************************************************/

/**
 * Validate sheets like `AllCategories` and `Category` which have the same format.
 * @param groupedSpends result of invoking `groupSpendsByDatesAndSubCategories` or
 * `groupSpendsByDatesAndCategories` in Utils.ts
 * @param groupedReimbursements result of invoking `groupReimbursementsByDatesAndSubCategories` or
 * `groupReimbursementsByDatesAndCategories` in Utils.ts
 * @param data
 * data to validate
 * @param groupingElements categories or subcategories (see `groupRowsByDatesAndSubCategories` and
 * `groupRowsByDatesAndCategories` in Utils.ts)
 */
function validateSheet(
  spreadSheetConfig: SpreadSheetConfig,
  sheetConfig: SheetConfig,
  groupedSpends: object,
  groupedReimbursements: object,
  data: any[][],
  groupingElements: string[]
) {
  let currentDate = data![0][0]
  let validationPass = true
  data!.forEach((row) => {
    currentDate = row![0]
    let printRows = false
    let expectedMonthTotal = 0
    let expectedMonthReimbursement = 0
    const numberOfColumns = getNumberOfColumns(spreadSheetConfig.id, sheetConfig.name)
    const totalColumn = getTotalColumn(sheetConfig)
    const totalReimbursementColumn = getTotalReimbursementColumn(sheetConfig)
    const expectedRow = Array(numberOfColumns).fill(0)
    const formattedDate = formatDate(currentDate, 2)

    expectedRow[0] = currentDate

    groupingElements?.forEach((groupingElement) => {
      const groupingElementIndex = sheetConfig.columns![groupingElement] - 1

      if (typeof groupingElementIndex === "undefined") {
        throw new Error(`Undefined index for column "${groupingElement}"`)
      }

      let expectedAmount = 0
      if (
        Object.keys(groupedSpends).includes(formattedDate) &&
        Object.keys(groupedSpends[formattedDate]).includes(groupingElement)
      ) {
        expectedAmount = groupedSpends[formattedDate][groupingElement]
      }

      if (typeof expectedAmount === "undefined") throw new Error(`Expected amount undefined`)

      const actualAmount = row[groupingElementIndex]

      if (typeof actualAmount === "undefined") throw new Error(`Actual amount undefined`)

      let expectedReimbursement = 0
      if (
        typeof totalReimbursementColumn !== "undefined" &&
        Object.keys(groupedReimbursements).includes(formattedDate) &&
        Object.keys(groupedReimbursements[formattedDate]).includes(groupingElement)
      ) {
        expectedReimbursement = groupedReimbursements[formattedDate][groupingElement]
        expectedRow[totalReimbursementColumn - 1] = expectedReimbursement
      }

      printRows = printRows || expectedAmount != actualAmount
      validationPass = validationPass && !printRows
      expectedMonthTotal += expectedAmount - expectedReimbursement
      expectedMonthReimbursement += expectedReimbursement
      expectedRow[groupingElementIndex] = expectedAmount
    })

    const actualMonthTotal = row[totalColumn - 1]
    let actualMonthReimbursement = 0
    expectedRow[totalColumn - 1] = expectedMonthTotal
    if (typeof totalReimbursementColumn !== "undefined") {
      expectedRow[totalReimbursementColumn - 1] = expectedMonthReimbursement
      actualMonthReimbursement = row[totalReimbursementColumn - 1]
    }

    printRows =
      printRows || expectedMonthTotal !== actualMonthTotal || expectedMonthReimbursement !== actualMonthReimbursement
    if (printRows) {
      console.warn(`Expected row : ${formatRow(expectedRow, 1)}\nActual row : ${formatRow(row, 1)}\n`)
    }
  })

  const tips: string[] = []
  if (!validationPass) {
    tips.push("Check amounts for each category")
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
    const totalColumn = getTotalColumn(this.sheetConfig)
    const rowForMonth = this.getRowForMonth(spend.date.getFullYear(), spend.date.getMonth())
    if (!rowForMonth) {
      const numberOfColumns = getNumberOfColumns(this.spreadSheetConfig.id, this.sheetConfig.name)
      const newRow = Array(numberOfColumns).fill(0)
      newRow[0] = spend.date
      newRow[categoryColumn - 1] = spend.amount
      newRow[totalColumn - 1] = spend.amount

      addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
    } else {
      setValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, 1, formatDate(spend.date))

      const currentCategoryValue = getValue(
        this.spreadSheetConfig.id,
        this.sheetConfig.name,
        rowForMonth,
        categoryColumn
      )
      setValue(
        this.spreadSheetConfig.id,
        this.sheetConfig.name,
        rowForMonth,
        categoryColumn,
        currentCategoryValue + spend.amount
      )

      const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, totalColumn)
      setValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, totalColumn, currentTotal + spend.amount)
    }
  }

  validate(): void {
    const currentSheetRows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    const [headers, data] = [currentSheetRows?.slice(0, 1)[0], currentSheetRows?.slice(1)]

    const categories = headers?.slice(1, headers.length - 1)
      .filter((category) => category !== "Devolución" && category !== "Reimbursements")

    const dates = data?.map((row) => row[0])

    const allSpends = getAllSpends()
    const groupedSpends = groupSpendsByDatesAndCategories(allSpends, dates!, null, categories!)

    const allReimbursements = getAllReimbursements()
    const groupedReimbursements = groupReimbursementsByDatesAndCategories(allReimbursements, dates!, null, categories!)

    validateSheet(this.spreadSheetConfig, this.sheetConfig, groupedSpends, groupedReimbursements, data!, categories!)
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
      const totalColumn = getTotalColumn(this.sheetConfig)
      const rowForMonth = this.getRowForMonth(spend.date.getFullYear(), spend.date.getMonth())
      if (!rowForMonth) {
        const numberOfColumns = getNumberOfColumns(this.spreadSheetConfig.id, this.sheetConfig.name)
        const newRow = Array(numberOfColumns).fill(0)
        newRow[0] = spend.date
        newRow[subcategoryColumn - 1] = spend.amount
        newRow[totalColumn - 1] = spend.amount

        addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
      } else {
        setValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, 1, formatDate(spend.date))

        const currentSubcategoryTotal = getValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          rowForMonth,
          subcategoryColumn
        )
        setValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          rowForMonth,
          subcategoryColumn,
          currentSubcategoryTotal + spend.amount
        )

        const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, totalColumn)
        setValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          rowForMonth,
          totalColumn,
          currentTotal + spend.amount
        )
      }
    }
  }

  processReimbursement(reimbursement: Spend): void {
    if (reimbursement.category == this.category) {
      super.processReimbursement(reimbursement)
    }
  }

  validate(): void {
    const currentSheetRows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    const [headers, data] = [currentSheetRows?.slice(0, 1)[0], currentSheetRows?.slice(1)]

    const subCategories = headers?.slice(1, headers.length - 1)
      .filter((category) => category !== "Devolución" && category !== "Reimbursements")

    const dates = data?.map((row) => row[0])

    const allSpends = getAllSpends()
    const groupedSpends = groupSpendsByDatesAndSubCategories(allSpends, dates!, this.category, subCategories!)

    const allReimbursements = getAllReimbursements()
    const groupedReimbursements = groupReimbursementsByDatesAndSubCategories(
      allReimbursements,
      dates!,
      this.category,
      subCategories!
    )

    validateSheet(this.spreadSheetConfig, this.sheetConfig, groupedSpends, groupedReimbursements, data!, subCategories!)
  }
}

/*************************************************************************************************************************/

class Account extends BaseSheetHandler {
  private account: string

  constructor(spreadSheetConfig: SpreadSheetConfig, sheetConfig: SheetConfig) {
    super(spreadSheetConfig, sheetConfig)
    this.account = sheetConfig.name
  }
  processReimbursement(reimbursement: Spend): void {
    if (reimbursement.account == this.account) {
      super.processReimbursement(reimbursement)
    }
  }

  processSpend(spend: Spend) {
    if (spend.account === this.sheetConfig.name) {
      const rowForMonth = this.getRowForMonth(spend.date.getFullYear(), spend.date.getMonth())
      const numberOfColumns = getNumberOfColumns(this.spreadSheetConfig.id, this.sheetConfig.name)
      const totalColumn = getTotalColumn(this.sheetConfig)
      if (!rowForMonth) {
        const newRow = Array(numberOfColumns).fill(0)
        newRow[0] = spend.date
        newRow[this.sheetConfig.columns![spend.category] - 1] = spend.amount
        newRow[totalColumn - 1] = spend.amount

        addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
      } else {
        setValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, 1, formatDate(spend.date))

        const columnForCategory = this.sheetConfig.columns![spend.category]
        const currentCategoryAmount = getValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          rowForMonth,
          columnForCategory
        )
        setValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          rowForMonth,
          columnForCategory,
          currentCategoryAmount + spend.amount
        )

        const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, totalColumn)
        setValue(
          this.spreadSheetConfig.id,
          this.sheetConfig.name,
          rowForMonth,
          totalColumn,
          currentTotal + spend.amount
        )
      }
    }
  }

  validate(): void {
    const currentSheetRows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    const [headers, data] = [currentSheetRows?.slice(0, 1)[0], currentSheetRows?.slice(1)]

    const categories = headers
      ?.slice(1, headers.length - 1)
      .filter((category) => category !== "Devolución" && category !== "Reimbursements")

    const dates = data?.map((row) => row[0])

    const allSpends = getAllSpends()
    const groupedSpends = groupSpendsByDatesAndCategories(allSpends, dates!, this.sheetConfig.name, categories!)

    const allReimbursements = getAllReimbursements()
    const groupedReimbursements = groupReimbursementsByDatesAndCategories(
      allReimbursements,
      dates!,
      this.sheetConfig.name,
      categories!
    )

    validateSheet(this.spreadSheetConfig, this.sheetConfig, groupedSpends, groupedReimbursements, data!, categories!)
  }
}

/*************************************************************************************************************************/
/*                                                    SPREAD SHEET HANDLER                                               */
/*************************************************************************************************************************/

class Monthly extends BaseSpreadSheetHandler {
  constructor(spreadSheetConfig: SpreadSheetConfig) {
    const sheetHandlers: BaseSheetHandler[] = []
    Object.keys(spreadSheetConfig.sheets).forEach((key) => {
      const sheetConfig = spreadSheetConfig.sheets[key]
      switch (sheetConfig.class) {
        case "AllCategories":
          sheetHandlers.push(new AllCategories(spreadSheetConfig, sheetConfig))
          break
        case "Category":
          sheetHandlers.push(new Category(spreadSheetConfig, sheetConfig))
          break
        case "Account":
          sheetHandlers.push(new Account(spreadSheetConfig, sheetConfig))
          break
        default:
          throw new Error(`Unknown sheet class "${sheetConfig.class}"`)
      }
    })
    super(spreadSheetConfig, sheetHandlers)
  }
}

Object.keys(spreadSheets).forEach((key) => {
  const spreadSheetConfig = spreadSheets[key]
  switch (spreadSheetConfig.class) {
    case "Monthly":
      if (Object.keys(spreadSheets).includes(spreadSheetConfig.id))
        throw new Error(`Duplicated entry for spread sheet "${spreadSheetConfig.id}" in spreadSheetHandlers`)
      spreadSheetHandlers[spreadSheetConfig.id] = new Monthly(spreadSheetConfig)
      console.info(`Handler for spreadsheet '${spreadSheetConfig.name}' loaded correctly`)
      break
    case "Main":
      break
    default:
      throw new Error(`Invalid spread sheet type '${spreadSheetConfig.class}'`)
  }
})
