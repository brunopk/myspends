class Monthly extends BaseSpreadSheetHandler {
  processSpend(spend: Spend): void {
    throw new Error("Method not implemented.")
  }
}

SPREADSHEET_HANDLERS.push(new Main(spreadSheetConfig.main.id))

console.info(`Handler for '${SPREADSHEET_CONFIG.}' added.`)

// TODO: CONTINUE HERE
