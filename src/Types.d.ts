import { tasks_v1 } from 'googleapis'

declare global {
  type ExtendedTask = tasks_v1.Schema$Task & { taskList: tasks_v1.Schema$TaskList }

  type Spend = {
    date: Date
    category: string
    value: number
    account: string
    description: string
    subCategory: string
    formName: string
    discountApplied: boolean
  }

  type SheetConfig = {
    name: string
  }

  type SpreadSheetConfig = {
    id: string
    name: string
    sheets: { [name: string]: SheetConfig }
  }
}
