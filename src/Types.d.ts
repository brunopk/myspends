import { tasks_v1 } from 'googleapis'

declare global {
  type ExtendedTask = tasks_v1.Schema$Task & { taskList: tasks_v1.Schema$TaskList }

  type SpendOrigin = {
    readonly [property: string]: string
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
    readonly column: number
  }

  type CategoryConfig = {
    readonly name: string
    readonly column: number
    readonly totalColumn: number // TODO: total column no debería ir aca
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
    readonly spreadSheet: {
      readonly id: string
      readonly sheetName: string
      readonly columns: { [name: string]: number }
    }
    readonly name: string
  }
}
