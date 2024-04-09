/*************************************************************************************************/
/*                                         SHEETS                                                */
/*************************************************************************************************/

class AllCategories extends BaseSheetHandler {
  processSpend(spend: Spend): void {
    const monthRow = this.getRowForMonth(spend.date.getMonth())
    if (!monthRow) {
      const newRowAux = Array(getNumberOfCategories() + this.getNumberOfExtraColumns()).fill(0)
      const newRow: (Date | number)[] = [spend.date].concat(newRowAux)
      newRow[this.sheetConfig.columns![spend.category]] = spend.value
      // TODO: totalColumn should be a required key in sheet config
      newRow[this.sheetConfig.extra.totalColum] = spend.value

      addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
    } else {
      const currentCategoryValue = getValue(
        this.spreadSheetConfig.id,
        this.sheetConfig.name,
        monthRow,
        this.sheetConfig.columns![spend.category]
      )
      setValue(
        this.spreadSheetConfig.id,
        this.sheetConfig.name,
        monthRow,
        this.sheetConfig.columns![spend.category],
        currentCategoryValue + spend.value
      )

      const columnForTotalSpend = this.getColumnForTotal()
      const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, columnForTotalSpend)
      setValue(
        this.spreadSheetConfig.id,
        this.sheetConfig.name,
        monthRow,
        columnForTotalSpend,
        currentTotal + spend.value
      )
    }
  }

  validate(): void {
    let currentSheetRows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    if (typeof currentSheetRows === "undefined")
      throw new Error(
        `Undefined reading rows from sheet '${this.sheetConfig.name}' within spreadsheet '${this.spreadSheetConfig.name}'`
      )
    const categoriesInCurrentSheet = currentSheetRows[0].slice(1, currentSheetRows[0].length - 1)

    currentSheetRows = currentSheetRows.slice(1)

    const datesInCurrentSheet = currentSheetRows.map((currentSheetRow) => currentSheetRow[0])
    const allSpends = getAllSpends()
    const groupedSpends = groupSpendsByDatesAndCategories(
      allSpends,
      datesInCurrentSheet,
      null,
      categoriesInCurrentSheet
    )

    currentSheetRows.forEach((currentSheetRow) => {
      let printRows = false
      let expectedMonthAmount = 0
      const date = currentSheetRow[0]
      const expectedRow = [date, ...Array(categoriesInCurrentSheet.length).fill(0), expectedMonthAmount]
      const formattedDate = formatDate(date, 2)
      categoriesInCurrentSheet.forEach((category) => {
        const categoryColumn = this.sheetConfig.columns![category]
        if (Object.keys(groupedSpends[formattedDate]).includes(category)) {
          const expectedCategoryAmount = groupedSpends[formattedDate][category]
          const actualCategoryAmount = currentSheetRow[categoryColumn]
          printRows = printRows || expectedCategoryAmount != actualCategoryAmount
          expectedMonthAmount += expectedCategoryAmount
          expectedRow[categoryColumn] = expectedCategoryAmount
        }
      })
      expectedRow[expectedRow.length - 1] = expectedMonthAmount
      if (printRows) {
        console.error(`Expected row : ${expectedRow}\nActual row : ${currentSheetRow}\n`)
      }
    })
  }

  private getNumberOfExtraColumns(): number {
    // total column
    return 1
  }

  private getColumnForTotal(): number {
    // month column + categories  + 1
    return getNumberOfCategories() + 2
  }
}

class Category extends BaseSheetHandler {
  private category: string

  constructor(spreadSheetConfig: SpreadSheetConfig, sheetConfig: SheetConfig) {
    super(spreadSheetConfig, sheetConfig)
    this.category = sheetConfig.name
  }

  processSpend(spend: Spend) {
    if (spend.category === this.category) {
      const subcategoryColumn = getColumnForSubCategory(spend.category, spend.subCategory)
      const categoryConfig = getCategoryConfiguration(spend.category)
      // TODO: totalColumn should be a required key in sheet config
      const totalColum = categoryConfig.totalColumn
      const monthRow = this.getRowForMonth(spend.date.getMonth())
      if (!monthRow) {
        const newRowAux = Array(getNumberOfSubcategories(spend.category) + 1).fill(0)
        const newRow: (Date | number)[] = [spend.date].concat(newRowAux)
        newRow[subcategoryColumn - 1] = spend.value
        newRow[totalColum - 1] = spend.value
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
          currentSubcategoryTotal + spend.value
        )

        const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, totalColum)
        setValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, totalColum, currentTotal + spend.value)
      }
    }
  }

  validate(): void {
    let currentSheetRows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    if (typeof currentSheetRows === "undefined")
      throw new Error(
        `Undefined reading rows from sheet '${this.sheetConfig.name}' within spreadsheet '${this.spreadSheetConfig.name}'`
      )
    const subCategoriesInCurrentSheet = currentSheetRows[0].slice(1, currentSheetRows[0].length - 1)

    currentSheetRows = currentSheetRows.slice(1)

    const datesInCurrentSheet = currentSheetRows.map((row) => row[0])
    const allSpends = getAllSpends()
    const groupedSpends = groupSpendsByDatesAndSubCategories(
      allSpends,
      datesInCurrentSheet,
      this.category,
      subCategoriesInCurrentSheet
    )

    let mismatchFound = false
    currentSheetRows.forEach((currentSheetRow) => {
      let printRows = false
      let expectedMonthAmount = 0
      const date = currentSheetRow[0]
      const expectedRow = [date, ...Array(subCategoriesInCurrentSheet.length).fill(0), expectedMonthAmount]
      const formattedDate = formatDate(date, 2)
      subCategoriesInCurrentSheet.forEach((subCategory) => {
        const categoryColumn = getColumnForSubCategory(this.category, subCategory) - 1
        if (Object.keys(groupedSpends[formattedDate]).includes(subCategory)) {
          const expectedCategoryAmount = groupedSpends[formattedDate][subCategory]
          const actualCategoryAmount = currentSheetRow[categoryColumn]
          printRows = printRows || expectedCategoryAmount != actualCategoryAmount
          mismatchFound = mismatchFound || expectedCategoryAmount != actualCategoryAmount
          expectedMonthAmount += expectedCategoryAmount
          expectedRow[categoryColumn] = expectedCategoryAmount
        }
      })
      expectedRow[expectedRow.length - 1] = expectedMonthAmount
      if (printRows) {
        console.error(`Expected row : ${expectedRow}\nActual row : ${currentSheetRow}\n`)
      }
    })
    if (mismatchFound) {
      console.error("Check amounts for each category")
      console.error(
        `Check if the first row in sheet '${this.sheetConfig.name}' within spreadsheet '${this.spreadSheetConfig.name}' contains valid categories names`
      )
    }
  }
}

class Account extends BaseSheetHandler {
  processSpend(spend: Spend) {
    if (spend.account === this.sheetConfig.name) {
      const monthRow = this.getRowForMonth(spend.date.getMonth())
      if (!monthRow) {
        const newRowAux = Array(getNumberOfCategories() + 1).fill(0)
        const newRow: (Date | number)[] = [spend.date].concat(newRowAux)
        newRow[this.sheetConfig.columns![spend.category]] = spend.value
        newRow[newRow.length - 1] = spend.value

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
          currentCategoryAmount + spend.value
        )

        const totalColum = this.getColumnForTotal()
        const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, totalColum)
        setValue(this.spreadSheetConfig.id, this.sheetConfig.name, monthRow, totalColum, currentTotal + spend.value)
      }
    }
  }

  validate(): void {
    let currentSheetRows = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)
    if (typeof currentSheetRows === "undefined")
      throw new Error(
        `Undefined reading rows from sheet '${this.sheetConfig.name}' within spreadsheet '${this.spreadSheetConfig.name}'`
      )
    const categoriesInCurrentSheet = currentSheetRows[0].slice(1, currentSheetRows[0].length - 1)

    currentSheetRows = currentSheetRows.slice(1)

    const datesInCurrentSheet = currentSheetRows.map((currentSheetRow) => currentSheetRow[0])
    const allSpends = getAllSpends()
    const groupedSpends = groupSpendsByDatesAndCategories(
      allSpends,
      datesInCurrentSheet,
      this.sheetConfig.name,
      categoriesInCurrentSheet
    )

    currentSheetRows.forEach((currentSheetRow) => {
      let printRows = false
      let expectedMonthAmount = 0
      const date = currentSheetRow[0]
      const expectedRow = [date, ...Array(categoriesInCurrentSheet.length).fill(0), expectedMonthAmount]
      const formattedDate = formatDate(date, 2)
      categoriesInCurrentSheet.forEach((category) => {
        const categoryColumn = this.sheetConfig.columns![category]
        if (Object.keys(groupedSpends[formattedDate]).includes(category)) {
          const expectedCategoryAmount = groupedSpends[formattedDate][category]
          const actualCategoryAmount = currentSheetRow[categoryColumn]
          printRows = printRows || expectedCategoryAmount != actualCategoryAmount
          expectedMonthAmount += expectedCategoryAmount
          expectedRow[categoryColumn] = expectedCategoryAmount
        }
      })
      expectedRow[expectedRow.length - 1] = expectedMonthAmount
      if (printRows) {
        console.error(`Expected row : ${expectedRow}\nActual spend : ${currentSheetRow}\n`)
      }
    })
  }

  private getColumnForTotal(): number {
    // month column + categories  + 1
    return getNumberOfCategories() + 2
  }
}

/*************************************************************************************************/
/*                                         SPREAD SHEETS                                         */
/*************************************************************************************************/

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

spreadSheetHandlers.push(new Monthly(sheets.monthly))

console.info(`Handler for spreadsheet '${sheets.monthly.name}' loaded correctly`)
