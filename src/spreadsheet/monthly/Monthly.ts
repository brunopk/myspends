class Monthly extends BaseSpreadSheetHandler {
  processSpend(spend: Spend): void {
    throw new Error("Method not implemented.")
  }
}

if (Object.keys(SPREADSHEET_HANDLERS).indexOf("MONTHLY") === -1) {
  SPREADSHEET_HANDLERS["MONTHLY"] = new Monthly()
} 
