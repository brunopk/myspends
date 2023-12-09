abstract class BaseSpreadSheetHandler {
  private sheetHandlers: BaseSheetHandler[]

  private config: SpreadSheetConfig

  constructor(config: SpreadSheetConfig, sheetHandlers: BaseSheetHandler[]) {
    this.sheetHandlers = sheetHandlers
    this.config = config
  }

  processSpend(spend: Spend): void {
    this.sheetHandlers.forEach((sheetHandler) => {
      // TODO: ver porque logea Updating sheet "undefined" on "Principal" ... creo que sheetHandler no es un objeto
      console.info(`Updating sheet "${sheetHandler.sheetConfig.name}" of "${this.config.name}" ...`)
      sheetHandler.processSpend(spend)
    })
  }
}
