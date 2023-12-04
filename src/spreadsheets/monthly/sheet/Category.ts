class Category extends BaseSheetHandler {
  processSpend(spend: Spend) {
    if (spend.category === this.sheetConfig.name) {
      const subcategoryColumn = getColumnForSubcategory(spend.category, spend.subCategory, spend.discountApplied)
      const totalColum = getTotalColumnForCategorySheet(this.sheetConfig.name)
      const monthRow = this.getRowForMonth(spend.date.getMonth())
      if (!monthRow) {
        const newRowAux = Array(getNumberOfSubcategories(spend.category) + 1).fill(0)
        // TODO: CONTINUE HERE!!!
        const newRow: (Date | number)[] = [date].concat(newRowAux)
        newRow[subcategoryColumn - 1] = value
        newRow[totalColum - 1] = value
        addRow(spreadSheetId, sheetName, newRow)
      } else {
        const currentSubcategoryTotal = getValue(spreadSheetId, sheetName, rowForCurrentMonth, subcategoryColumn)
        setValue(spreadSheetId, sheetName, rowForCurrentMonth, subcategoryColumn, currentSubcategoryTotal + value)

        const currentTotal = getValue(spreadSheetId, sheetName, rowForCurrentMonth, totalColum)
        setValue(spreadSheetId, sheetName, rowForCurrentMonth, totalColum, currentTotal + value)
      }
    }
  }

  private getNumberOfExtraColumns(): number {
    // total column
    return 1
  }
}
