/**
 * Updates the task with the given taskId in the Firebase database.
 * @param {string} taskId - The id of the task to update.
 * @param {Object} task - The updated task data to save to Firebase.
 * @throws {Error} If the request fails, or the response is not OK.
 */
async function updateTaskInDatabase(taskId, task) {
    try {
        let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });
    } catch (error) {
        console.error("Fehler beim Speichern des Tasks in der Datenbank:", error);
    }
}

/**
 * Updates the subtasks of a task in the Firebase database.
 * @param {Object} task - The task object with the updated subtasks.
 * @param {string} taskId - The ID of the task to be updated.
 * @throws {Error} If the request fails or the response is not OK.
 * @returns {Promise<void>} - The function returns a promise that resolves once the subtask is updated in the database.
 */
async function updateSubtaskDB(task, taskId) {
    if (!task || !taskId) return console.error("Task oder Task ID fehlen!");
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subtasks: task.subtasks
        })
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Subtasks: ${response.statusText}`);
    }
}

/**
 * Saves the changes made to a task in the task edit overlay.
 * Retrieves the current text for title, description, due date and priority from the overlay and updates the task object.
 * If the task does not exist, logs an error message.
 * Updates the task in the database.
 * Closes the task overlay after saving.
 * @param {string} taskId - The ID of the task to be saved.
 * @returns {void} - The function does not return a value.
 */
async function saveTask(taskId) {
    let task = globalTasks[taskId];
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }
    try {
        let taskFromDB = await fetchTaskFromFirebase(taskId);
        let subtasksFromDB = taskFromDB ? taskFromDB.subtasks : task.subtasks;
        task.title = document.getElementById("editTitle")?.value || task.title;
        task.description = document.getElementById("editDescription")?.value || task.description;
        task.dueDate = document.getElementById("editDueDate")?.value || task.dueDate;
        task.priority = document.getElementById("task-priority").dataset.priority || task.priority;
        task.assignedTo = Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
            .map(el => el.dataset.fullname);
        if (!task.assignedTo) task.assignedTo = [];
        subtasksFromDB;
        if (taskId in globalTasks) await updateTaskInDatabase(taskId, task);
        displayTasks(globalTasks);
        closeTaskOverlay();
    } catch (error) {
        console.error("Fehler beim Speichern der Aufgabe:", error);
    }
}

/**
 * Retrieves a task from Firebase Realtime Database.
 * @param {string} taskId - The ID of the task to fetch.
 * @returns {Promise<Object|null>} - The task data or null if the task ID is undefined or the task was not found.
 */
async function fetchTaskFromFirebase(taskId) {
    if (!taskId) {
        console.error("Fehler: Task ID ist undefined!");
        return null;
    }
    let response = await fetch(`${BASE_URL}tasks/${taskId}.json`);
    let taskData = await response.json();
    if (!taskData) {
        console.error("Task nicht gefunden in Firebase!");
        return null;
    }
    return { id: taskId, ...taskData };
}

/**
 * Opens the task edit overlay and populates it with task details.
 * @param {string} taskId The ID of the task to edit.
 */
function editTask(taskId) {
    if (!taskId) return console.error("Fehler: taskId ist undefined oder null!");
    let task = globalTasks[taskId];
    if (!task) return console.error(`Task mit ID ${taskId} nicht gefunden.`);
    detailTask = task;
    let overlayRef = document.querySelector(".openTaskOverlayMain");
    overlayRef.innerHTML = taskEditTemplate(task, taskId);
    document.querySelectorAll('.selected-contacts').forEach(e => e.style.position = 'static');
    applyActivePriorityButton(task.priority);
    document.querySelectorAll("#task-priority .prio-btn").forEach(button => {
        button.onclick = function () {
            document.querySelectorAll("#task-priority .prio-btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            document.getElementById("task-priority").setAttribute("data-priority", button.getAttribute("data-prio"));
        };
    });
    setupDateValidation();
    initTaskEditAddSubtask(taskId);
}