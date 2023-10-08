class MainHandler extends BaseSpreadSheetHandler {
  processSpend(spend: Spend): void {
    throw new Error("Method not implemented.")
  }
}

loadHandler("MAIN", new MainHandler())
