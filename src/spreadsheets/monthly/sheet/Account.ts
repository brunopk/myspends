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
