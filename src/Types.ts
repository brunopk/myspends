enum RecurrentSpendMode {
  Reminder,
  CompleteFirst
}
type Spend = {
  date: Date
  category: string
  amount: number
  account: string
  description: string
  origin: string
  subCategory?: string
}

type Reimbursement = {
  date: Date
  isCash: boolean
  account: string
  amount: number
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
  readonly extra?: any
}

type SpreadSheetConfig = {
  readonly id: string
  readonly name: string
  readonly sheets: { [name: string]: SheetConfig }
  readonly extra?: any
}

type FormConfig = {
  readonly spreadSheetId: string
  readonly spreadSheetName: string
  readonly formSheet: { [name: string]: SheetConfig }
}

type RecurrentSpendConfig = {
  type: string
  dayOfMonth: number
  taskTitle: string
  taskDescription: string
  mailSubject: string
  mailBody: string
  category: string
  account: string
  description: string
  amount: number
  subCategory?: string
}
