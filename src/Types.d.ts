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
    discountApplied: boolean
  }
}
