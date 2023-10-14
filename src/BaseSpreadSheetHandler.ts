abstract class BaseSpreadSheetHandler {
  private sheetHandlers: BaseSheetHandler[]

  constructor() {
    this.sheetHandlers = this.loadSheetHandlers()
  }

  protected abstract loadSheetHandlers(): BaseSheetHandler[]

  processSpend(spend: Spend): void {
    this.sheetHandlers.forEach((handler) => handler.processSpend(spend))
  }
}

function loadSpreadSheetHandler(handler: BaseSpreadSheetHandler) {
  SPREADSHEET_HANDLERS.push(handler)
  console.info("New handler loaded : ")
  console.info(handler)
}
