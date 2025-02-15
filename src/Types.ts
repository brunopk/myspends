type Spend = {
  date: Date
  category: string
  amount: number
  account: string
  description: string
  origin: string
  subCategory?: string
}

type RecurrentSpend = {
  type: string
  dayOfMonth: number
  sendTask: boolean
  sendMail: boolean
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

type Reimbursement = Spend

type SubCategoryConfig = {
  readonly name: string
}

type CategoryConfig = {
  readonly name: string
  readonly subCategories?: { [name: string]: SubCategoryConfig }
}

type SheetConfig = {
  readonly name: string
  readonly class: string
  readonly columns?: { [name: string]: number }
}

type SpreadSheetConfig = {
  readonly id: string
  readonly name: string
  readonly class: string
  readonly sheets: { [name: string]: SheetConfig }
}

type FormConfig = {
  readonly spreadSheetId: string
  readonly spreadSheetName: string
  readonly sheets: { [name: string]: SheetConfig }
}

type HistoricDataMail = {
  readonly htmlBody: string
  readonly options: GoogleAppsScript.Mail.MailAdvancedParameters
}
