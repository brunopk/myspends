abstract class BaseSheetHandler {
  protected name: string

  protected spreadSheetName: string

  protected spreadSheetId: string

  constructor(name: string, spreadSheetName: string, spreadSheetId: string) {
    this.name = name
    this.spreadSheetName = spreadSheetName
    this.spreadSheetId = spreadSheetId
  }

  abstract processSpend(spend: Spend): void
}
