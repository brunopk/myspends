class MainSpreadSheetHandler extends BaseSpreadSheetHandler {
  loadSheetHandlers(): BaseSheetHandler[] {
    return [
      new MainSheetHandler(
        SPREADSHEET_CONFIG["main"].sheets["main"].name,
        SPREADSHEET_CONFIG["main"].name,
        SPREADSHEET_CONFIG["main"].id
      )
    ]
  }
}

loadHandler(new MainSpreadSheetHandler())
