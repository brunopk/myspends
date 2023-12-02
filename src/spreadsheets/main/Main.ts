class Main extends BaseSpreadSheetHandler {
  constructor(config: SpreadSheetConfig) {
    super(config, [new MainSheet(config.id, config.sheets.main.name)])
  }
}

spreadSheetHandlers.push(new Main(spreadSheetConfig.main))

console.info(`Handler for '${spreadSheetConfig.main.name}' added.`)
