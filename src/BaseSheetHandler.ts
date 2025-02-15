abstract class BaseSheetHandler {
  public readonly spreadSheetConfig: SpreadSheetConfig

  public readonly sheetConfig: SheetConfig

  constructor(spreadSheetConfig: SpreadSheetConfig, sheetConfig: SheetConfig) {
    this.sheetConfig = sheetConfig
    this.spreadSheetConfig = spreadSheetConfig
  }

  abstract processSpend(spend: Spend): void

  abstract validate(): void

  // TODO: CONTINUE

  // TODO: calculate the new columns here (saved amount, saved percentage, etc)
  // TODO: change validation functions to take into account new columns

  processReimbursement(reimbursement: Reimbursement): void {
    if (this.spreadSheetConfig.class !== "Main") {
      const totalReimbursementColumn = getTotalReimbursementColumn(this.sheetConfig)
      const totalColumn = getTotalColumn(this.sheetConfig)
      const rowForMonth = this.getRowForMonth(reimbursement.date.getFullYear(), reimbursement.date.getMonth())

      if (typeof totalReimbursementColumn !== "undefined") {
        if (!rowForMonth) {
          const numberOfColumns = getNumberOfColumns(this.spreadSheetConfig.id, this.sheetConfig.name)
          const newRow = Array(numberOfColumns).fill(0)
          newRow[0] = reimbursement.date
          newRow[totalReimbursementColumn - 1] = reimbursement.amount
          newRow[totalColumn - 1] = -reimbursement.amount

          addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
        } else {
          setValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, 1, formatDate(reimbursement.date))

          const currentTotalReimbursement = getValue(
            this.spreadSheetConfig.id,
            this.sheetConfig.name,
            rowForMonth,
            totalReimbursementColumn
          )
          setValue(
            this.spreadSheetConfig.id,
            this.sheetConfig.name,
            rowForMonth,
            totalReimbursementColumn,
            currentTotalReimbursement + reimbursement.amount
          )

          const currentTotal = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, totalColumn)
          setValue(
            this.spreadSheetConfig.id,
            this.sheetConfig.name,
            rowForMonth,
            totalColumn,
            currentTotal - reimbursement.amount
          )
        }
      } else {
        console.info(
          `No column for reimbursement defined for sheet "${this.sheetConfig.name}" of "${this.spreadSheetConfig.name}"`
        )
      }
    }
  }

  /**
   * Get the corresponding row for the given month.
   * @param year as returned by `getFullYear` method of `Date`
   * @param month as returned by `getMonth` method of `Date`
   * @returns index of the row or undefined if there is no row found
   */
  protected getRowForMonth(year: number, month: number): number | undefined {
    let rowForCurrentMonth: number | undefined
    const data = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)?.slice(1)
    for (rowForCurrentMonth = 0; rowForCurrentMonth < data.length; rowForCurrentMonth++) {
      if (data[rowForCurrentMonth][0].getMonth() == month && data[rowForCurrentMonth][0].getFullYear() === year) {
        break
      }
    }
    return data?.length === 0 || rowForCurrentMonth >= data?.length ? undefined : rowForCurrentMonth + 2
  }
}
