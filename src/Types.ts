enum RecurrentSpendMode {
  Reminder,
  CompleteFirst
}
type Spend = {
  date: Date
  category: string
  value: number
  account: string
  description: string
  subCategory: string
  origin: string
}

type SubCategoryConfig = {
  readonly name: string
}

type CategoryConfig = {
  readonly name: string
  readonly subCategories?: { [name: string]: SubCategoryConfig }
}

type SheetConfig = {
  readonly name: string
  readonly columns?: { [name: string]: number }
  readonly numberOfColumns?: number
  readonly extra?: any
}

type SpreadSheetConfig = {
  readonly id: string
  readonly name: string
  readonly sheets: { [name: string]: SheetConfig }
  readonly extra?: any
}

type FormConfig = {
  readonly spreadSheet: {
    readonly id: string
    readonly name: string
    readonly sheet: SheetConfig
  }
}

type RecurrentSpendConfig = {
  type: string
  dayOfMonth: number
  taskTitle: string
  taskDescription: string
  mailSubject: string
  mailBody: string
  category: string
  subCategory: string
  account: string
  description: string
  amount: number
}
