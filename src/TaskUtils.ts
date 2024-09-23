/**
 * Logs the ids of all task list
 */
function listTaskLists() {
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

/**
 * List all tasks until now for a given task list
 * @param taskList
 */
function listAllTasks(taskListId: string): tasks_v1.Schema$Task[] {
  const now = new Date().toISOString()
  const allTasks: tasks_v1.Schema$Tasks[] = []
  let pageToken: string | null | undefined = null
  let tasks: tasks_v1.Schema$Tasks | undefined

  // Full sync

  do {
    tasks = Tasks.Tasks?.list(taskListId, { showHidden: true })
    tasks?.items?.forEach((task) => allTasks.push(task))
    pageToken = tasks?.nextPageToken
  } while (pageToken)

  return allTasks
}

/**
 * Creates a new task in Google Task
 * @param taskListId task list to which add the new task
 * @param title task title for the new task
 * @param description description for the new task (`note`)
 * @param date due date for the new task (not allowed to set hour, minutes, etc, only date part)
 * @readonly task id
 */
function createTask(taskListId: string, title: string, date: Date): string {
  console.info(`Adding task on tasklist ${taskListId}`)
  const task = Tasks.Tasks?.insert({ due: date.toISOString(), title }, taskListId)
  return task!.id!
}

function updateTaskDescription(taskListId: string, taskId: string, description: string) {
  console.info(`Changing task description for task ${taskId} of task list ${taskListId}`)
  Tasks.Tasks?.patch({ notes: description }, taskListId, taskId)
}

function completeTask(taskListId: string, taskId: string) {
  Tasks.Tasks?.patch({ status: "completed", completed: new Date().toISOString() }, taskListId, taskId)
  console.info(`Task ${taskId} on task list ${taskListId} was marked as completed`)
}

function testCreateTask() {
  createTask("", "TEST", "TEST", new Date("2023-07-27"))
}

function testListAllTasks() {
  const tasks = listAllTasks("")
  console.log(tasks)
}

function testCompleteTask() {
  completeTask("", "")
}
