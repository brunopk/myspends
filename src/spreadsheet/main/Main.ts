class Main extends BaseSpreadSheetHandler {
  loadSheetHandlers(): BaseSheetHandler[] {
    return [
      new MainSheet(
        SPREADSHEET_CONFIG["main"].sheets["main"].name,
        SPREADSHEET_CONFIG["main"].name,
        SPREADSHEET_CONFIG["main"].id
      )
    ]
  }
}

loadSpreadSheetHandler(new Main())
