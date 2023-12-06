class Category extends BaseSheetHandler {
  processSpend(spend: Spend) {
    if (spend.category === this.sheetConfig.name) {
      const subcategoryColumn = getColumnForSubcategory(spend.category, spend.subCategory)
      const totalColum = getTotalColumnForCategorySheet(this.sheetConfig.name)
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
