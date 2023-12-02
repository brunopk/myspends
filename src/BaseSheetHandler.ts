abstract class BaseSheetHandler {
  protected readonly spreadSheetId: string

  protected readonly sheetName: string

  protected constructor(spreadSheetId: string, sheetName: string) {
    this.sheetName = sheetName
    this.spreadSheetId = spreadSheetId
  }

  abstract processSpend(spend: Spend): void
}
