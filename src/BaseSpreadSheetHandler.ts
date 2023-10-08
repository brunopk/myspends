abstract class BaseSpreadSheetHandler {
  abstract processSpend(spend: Spend): void
}

function loadHandler(handlerName: string, handler: BaseSpreadSheetHandler) {
  SPREADSHEET_HANDLERS[handlerName] = handler
  console.info(`Spread sheet handler '${handlerName}' loaded.`)
}
