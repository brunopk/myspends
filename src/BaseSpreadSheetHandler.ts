// TODO: hacer un metodo que valide que las cantidades en todas las celdas de todas las hojas estén bien

abstract class BaseSpreadSheetHandler {
  private sheetHandlers: BaseSheetHandler[]

  private config: SpreadSheetConfig

  constructor(config: SpreadSheetConfig, sheetHandlers: BaseSheetHandler[]) {
    this.sheetHandlers = sheetHandlers
    this.config = config
  }

  processSpend(spend: Spend): void {
    this.sheetHandlers.forEach((sheetHandler) => {
      console.info(`Updating sheet "${sheetHandler.sheetConfig.name}" of "${this.config.name}" ...`)
      sheetHandler.processSpend(spend)
    })
  }
}
