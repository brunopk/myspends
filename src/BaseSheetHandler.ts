abstract class BaseSheetHandler {
  public readonly spreadSheetConfig: SpreadSheetConfig

  public readonly sheetConfig: SheetConfig

  constructor(spreadSheetConfig: SpreadSheetConfig, sheetConfig: SheetConfig) {
    this.sheetConfig = sheetConfig
    this.spreadSheetConfig = spreadSheetConfig
  }

  abstract processSpend(spend: Spend): void

  abstract validate(): void

  getReimbursementColumn(reimbursement: Reimbursement): number | undefined {
    return undefined
  }
  
  processReimbursement(reimbursement: Reimbursement): void {
    const reimbursementColumn = this.getReimbursementColumn(reimbursement)
    if (typeof reimbursementColumn === 'undefined') {
      return
    }
    
    const totalColumn = getTotalColumn(this.sheetConfig)
    const rowForMonth = this.getRowForMonth(reimbursement.date.getMonth())
    if (!rowForMonth) {
      const numberOfColumns = getNumberOfColumns(this.spreadSheetConfig.id, this.sheetConfig.name)
      const newRow = Array(numberOfColumns).fill(0)
      newRow[0] = reimbursement.date
      newRow[reimbursementColumn - 1] = -reimbursement.amount
      newRow[totalColumn - 1] = -reimbursement.amount

      addRow(this.spreadSheetConfig.id, this.sheetConfig.name, newRow)
    } else {
      const currentValue = getValue(this.spreadSheetConfig.id, this.sheetConfig.name, rowForMonth, reimbursementColumn)
      setValue(
        this.spreadSheetConfig.id,
        this.sheetConfig.name,
        rowForMonth,
        reimbursementColumn,
        currentValue - reimbursement.amount
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
  }

  /**
   * Get the corresponding row for the given month.
   * @param date date from 0 to 11
   * @returns index of the row or undefined
   */
  protected getRowForMonth(month: number): number | undefined {
    let rowForCurrentMonth: number | undefined
    const data = readAllRows(this.spreadSheetConfig.id, this.sheetConfig.name)?.slice(1)
    for (let i = 0; i < data.length; i++) {
      if (data[i][0].getMonth() == month) {
        // 1 (because of header row) + 1 (because first row index is 1)
        rowForCurrentMonth = i + 2
        break
      }
    }
    return rowForCurrentMonth
  }
}
