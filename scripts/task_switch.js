/**
 * Ensures all tasks have a main category set.
 * Fetches tasks from the server and iterates over them.
 * If a task lacks a main category, it sets the main category to 'ToDo'
 * and updates the task in the database.
 * 
 * @returns {Promise<void>} - Resolves when all tasks have been processed.
 */
async function fixTasksMainCategory() {
    let response = await fetch(BASE_URL + "/tasks.json");
    let tasks = await response.json();
    for (let [taskId, task] of Object.entries(tasks)) {
        if (!task.mainCategory) {
            task.mainCategory = 'ToDo';
            await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mainCategory: 'ToDo' }),
            });
        }
    }
}
fixTasksMainCategory();

/**
 * Populates the task switch overlay with buttons that allow users to move a task
 * between different stages: ToDo, In Progress, Await Feedback, and Done.
 * 
 * @param {string} taskId - The ID of the task to be moved.
 * @param {Object} task - The task object to be moved.
 */
function taskSwitchMainCategory(taskId, task) {
    console.log(taskId, task);
    let overlayRef = document.getElementById("openTaskSwitchOverlay");
    overlayRef.innerHTML = taskSwitchTemplate(task, taskId);
}

/**
 * Generates the HTML template for switching a task's main category.
 * The template includes buttons for moving the task between different stages:
 * ToDo, In Progress, Await Feedback, and Done.
 * Each button triggers the moveToCategory function when clicked, passing the
 * taskId and the corresponding category. Additionally, there is a cancel button
 * to close the task switch overlay and the task overlay.
 * 
 * @param {Object} task - The task object for which the switch template is generated.
 * @param {string} taskId - The ID of the task to be moved.
 * @returns {string} The HTML template for the task switch overlay.
 */
function taskSwitchTemplate(task, taskId) {
    return `
        <div class="taskSwitchContainer">
            <button onclick="event.stopPropagation(), moveToCategory('${taskId}', 'ToDo')">ToDo</button>
            <button onclick="event.stopPropagation(), moveToCategory('${taskId}', 'InProgress')">In Progress</button>
            <button onclick="event.stopPropagation(), moveToCategory('${taskId}', 'AwaitFeedback')">Await Feedback</button>
            <button onclick="event.stopPropagation(), moveToCategory('${taskId}', 'Done')">Done</button>
            <button id="taskSwitchCancel" onclick="event.stopPropagation(), closeTaskSwitchTemplate('${taskId}'), closeTaskOverlay()">X</button>
            </div>
    `;
}

/**
 * Toggles the display of the task switch overlay for the given task ID.
 * If the overlay is currently visible, it is hidden. If it is currently hidden,
 * it is displayed.
 * @param {string} taskId - The ID of the task for which the overlay is toggled.
 * @param {string} currentCategory - The current category of the task.
 */
function taskSwitchMainCategory(taskId, currentCategory) {
    let overlayRef = document.getElementById(`taskSwitchOverlay-${taskId}`);
    overlayRef.style.display = overlayRef.style.display === "none" ? "block" : "none";
}

/**
 * Moves a task to a different category.
 * 
 * @param {string} taskId - The ID of the task to be moved.
 * @param {string} newCategory - The new category of the task.
 * @returns {Promise<void>}
 */
async function moveToCategory(taskId, newCategory) {
    let task = globalTasks[taskId];
    if (!task) return console.error(`Task with ID ${taskId} not found.`);
    task.mainCategory = newCategory;
    await updateTaskInDatabase(taskId, task);
    displayTasks(globalTasks);
    closeTaskOverlay();
}

/**
 * Closes the task switch overlay for the given task ID.
 * 
 * @param {string} taskId - The ID of the task for which the overlay is closed.
 */
function closeTaskSwitchTemplate(taskId) {
    let overlayRef = document.getElementById(`taskSwitchOverlay-${taskId}`);
    overlayRef.style.display = "none";
}

/**
 * Posts the given task data to the server.
 * If the request is successful, it resolves with the response object.
 * If the request fails, it rejects with an Error object containing the error message.
 * @param {Object} taskData - The task data to send to the server.
 * @returns {Promise<Response>} - The response object from the request or an Error object if the request fails.
 */
async function postTaskToServer(taskData) {
    let response = await fetch(`${BASE_URL}/tasks.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    });
    if (!response.ok) {
        console.error(`Server Error: ${response.statusText}`);
        throw new Error(`Folgende Aufgabe konnte nicht geladen werden: ${response.statusText}`);
    }
    return await response.json();
}

/**
 * Adds the given task to the Firebase Realtime Database.
 * If the task is added successfully, it resolves with the task data as returned by Firebase.
 * If the addition of the task fails, it rejects with the error.
 * @param {Object} task - The task data to add to Firebase.
 * @returns {Promise<Object>} - The task data as returned by Firebase or the error if the addition fails.
 */
async function addTaskToFirebase(task) {
    try {
        let response = await sendTaskToFirebase(task);
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Speichern des Tasks:', error);
        throw error;
    }
}

/**
 * Sends the given task to the Firebase Realtime Database.
 * If the request is successful, it resolves with the response object.
 * If the request fails, it rejects with an Error object containing the error message.
 * @param {Object} task - The task data to send to Firebase.
 * @returns {Promise<Response>} - The response object from the request or an Error object if the request fails.
 */
async function sendTaskToFirebase(task) {
    const TASKS_URL = `${BASE_URL}tasks.json`;
    let response = await fetch(TASKS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error(`Fehler: ${response.statusText}`);
    return response;
}