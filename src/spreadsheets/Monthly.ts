/*************************************************************************************************/
/*                                         SHEETS                                                */
/*************************************************************************************************/

class AllCategories extends BaseSheetHandler {
  processSpend(spend: Spend): void {
    const monthRow = this.getRowForMonth(spend.date.getMonth())
    if (!monthRow) {
      const newRowAux = Array(getNumberOfCategories() + this.getNumberOfExtraColumns()).fill(0)
      const newRow: (Date | number)[] = [spend.date].concat(newRowAux)
      newRow[getColumnForCategory(spend.category) - 1] = spend.value
      newRow[this.getColumnForTotal() - 1] = spend.value

      addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
    } else {
      const columnForCategory = getColumnForCategory(spend.category)
      const currentCategoryValue = getValue(
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
  processSpend(spend: Spend) {
    if (spend.category === this.sheetConfig.name) {
      const subcategoryColumn = getColumnForSubcategory(spend.category, spend.subCategory)
      const categoryConfig = getCategoryConfiguration(spend.category)
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
}

class Account extends BaseSheetHandler {
  processSpend(spend: Spend) {
    if (spend.account === this.sheetConfig.name) {
      const monthRow = this.getRowForMonth(spend.date.getMonth())
      if (!monthRow) {
        const newRowAux = Array(getNumberOfCategories() + 1).fill(0)
        const newRow: (Date | number)[] = [spend.date].concat(newRowAux)
        newRow[getColumnForCategory(spend.category) - 1] = spend.value
        newRow[newRow.length - 1] = spend.value

        addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
      } else {
        const columnForCategory = getColumnForCategory(spend.category)
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
      .filter((key) => typeof spreadSheetConfig.sheets[key].extra.type !== "undefined")
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

spreadSheetHandlers.push(new Monthly(spreadSheetConfig.monthly))

console.info(`Handler for spreadsheet '${spreadSheetConfig.monthly.name}' loaded correctly`)
