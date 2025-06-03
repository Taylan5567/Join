let currentDraggedElement;

/**
 * Called when a task is dragged, sets the current dragged element to the task's id and
 * adds the task's id to the event's dataTransfer object. Calls startDrag with the task's id.
 * @param {DragEvent} event - The event that triggered the drag operation.
 * @param {string} taskId - The id of the task being dragged.
 */
function dragInit(event, taskId) {
    currentDraggedElement = taskId;
    event.dataTransfer.setData("text/plain", taskId);
    startDrag(taskId);
}

/**
 * Prevents the default behavior of a dragover event, which is to open the link that
 * was dragged over as a URL. This is necessary because the tasks are being dragged
 * over the kanban board, and the board is technically a link.
 * @param {DragEvent} event - The dragover event.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Handles the drop event when a task is dropped on a category.
 * Retrieves the task id from the event dataTransfer object, moves the task to the new status
 * and removes the visual highlighting of the task.
 * @param {DragEvent} event - The drop event.
 * @param {string} newStatus - The new mainCategory of the task.
 */
function drop(event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    moveTaskToNewStatus(taskId, newStatus);
    endDrag();
}

/**
 * Moves the task with the given taskId to the new mainCategory and updates the database.
 * @param {string} taskId - The id of the task to move.
 * @param {string} newStatus - The new mainCategory of the task.
 */
function moveTaskToNewStatus(taskId, newStatus) {
    let task = globalTasks[taskId];
    task.mainCategory = newStatus;
    updateTaskInDatabase(taskId, task);
    displayTasks(globalTasks);
}

/**
 * Adds the visual highlighting class "dragging" to the task element with the given taskId
 * @param {string} taskId - The id of the task to highlight
 */
function startDrag(taskId) {
    let taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) taskElement.classList.add("dragging");
}

/**
 * Removes the visual highlighting class "dragging" from the task element that is
 * currently being dragged.
 */
function endDrag() {
    let taskElement = document.querySelector(".task.dragging");
    if (taskElement) taskElement.classList.remove("dragging");
}

/**
 * Updates the task with the given taskId in the Firebase database.
 * @param {string} taskId - The id of the task to update.
 * @param {Object} updatedTask - The updated task data to save to Firebase.
 * @throws {Error} If the request fails, or the response is not OK.
 */
async function updateTaskInDatabase(taskId, updatedTask) {
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren: ${response.statusText}`);
    }
}