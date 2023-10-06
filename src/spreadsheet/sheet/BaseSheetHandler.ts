abstract class BaseSheetHandler {
  private spend: Spend

  constructor(spend: Spend) {
    this.spend = spend
  }

  run() {
    this.write(this.spend)
  }

  abstract write(spend: Spend): void
}
