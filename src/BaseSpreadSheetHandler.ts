abstract class BaseSpreadSheetHandler {
  private sheetHandlers: BaseSheetHandler[]

  private sheetName: string

  constructor(config: SpreadSheetConfig, sheetHandlers: BaseSheetHandler[]) {
    this.sheetHandlers = sheetHandlers
    this.sheetName = config.name
  }

  processSpend(spend: Spend): void {
    this.sheetHandlers.forEach((sheetHandler) => {
      console.info(`Updating sheet "${sheetHandler.sheetName}" on "${this.sheetName}" ...`)
      sheetHandler.processSpend(spend)
    })
  }
}
