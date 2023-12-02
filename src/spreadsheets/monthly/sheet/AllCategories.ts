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
