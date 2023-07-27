import { tasks_v1 } from 'googleapis'

/**
 * Returns the ids of all task list
 */
function listTaskLists(): tasks_v1.Schema$TaskList[] {
  let pageToken: string | null | undefined = null
  let taskLists: tasks_v1.Schema$TaskLists | undefined
  let allTaskListIds: tasks_v1.Schema$TaskList[] = []

  // Full sync

  do {
    taskLists = Tasks.Tasklists?.list({ pageToken })
    allTaskListIds = taskLists?.items ? allTaskListIds.concat(taskLists.items) : allTaskListIds
    pageToken = taskLists?.nextPageToken
  } while (pageToken)

  console.log(allTaskListIds)
}

function createTask(taskListId: string, title: string, description: string, date: Date) {
  console.info(`Adding task on tasklist '${date}'`)
  Tasks.Tasks?.insert({ due: date.toISOString(), title, notes: description}, taskListId)
}

function testCreateTask() {
  createTask("", "TEST", "TEST", new Date("2023-07-27"))
}
