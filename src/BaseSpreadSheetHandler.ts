abstract class BaseSpreadSheetHandler {
  public spreadSheetName: string

  private sheetHandlers: BaseSheetHandler[]

  constructor(config: SpreadSheetConfig, sheetHandlers: BaseSheetHandler[]) {
    this.sheetHandlers = sheetHandlers
    this.sheetHandlers.forEach((sheetHandler) => (sheetHandler.spreadSheetId = config.id))
  }

  processSpend(spend: Spend): void {
    this.sheetHandlers.forEach((handler) => handler.processSpend(spend))
  }
}
