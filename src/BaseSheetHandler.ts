abstract class BaseSheetHandler {
  public readonly spreadSheetConfig: SpreadSheetConfig

  public readonly sheetConfig: SheetConfig

  constructor(spreadSheetConfig: SpreadSheetConfig, sheetConfig: SheetConfig) {
    this.sheetConfig = sheetConfig
    this.spreadSheetConfig = spreadSheetConfig
  }

  abstract processSpend(spend: Spend): void

  abstract validate(): void

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
