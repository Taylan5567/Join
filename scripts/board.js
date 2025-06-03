/**
 * Initializes the board page by calling the necessary functions to set up the date validation, 
 * toggle the board page, and initialize the header.
 */
function initBoard() {
    toggleBoardPage();
    setDateValidation();
    initHeader();
}

/**
 * Invokes functions to display the task addition overlay and success message.
 */

function addTaskButton() {
    boardAddTask();
    addTaskSuccess();
}

/**
 * Toggles the board page by displaying the board template and setting the display style to 'block'.
 */
function toggleBoardPage() {
    let boardPage = document.getElementById('content');
    boardPage.innerHTML = boardTemplate();
    boardPage.style.display = 'block';
}

/**
 * Displays a confirmation message after a task has been added, and then fades out of view.
 * @function addTaskSuccess
 * @inner
 * @memberof board
 */
function addTaskSuccess() {
    let overlayRef = document.getElementById('addTaskSuccess');
    overlayRef.innerHTML = addTaskSuccessTemplate();
    overlayRef.style.display = "flex";
    setTimeout(() => {
        overlayRef.style.display = "none";
    }, 2000);
}

/**
 * Displays the task addition overlay, initializes the contacts dropdown, subtasks, and priority buttons, and adds event listeners to the buttons.
 * @function boardAddTask
 * @memberof board
 */
function boardAddTask() {
    let overlayRef = document.getElementById("boardAddTask");
    let darkOverlay = document.getElementById("darkOverlay");
    overlayRef.innerHTML = boardAddTaskTemplate();
    darkOverlay.classList.add("show");
    overlayRef.classList.add("show");
    initializeContactsDropdown();
    initializeSubtasks();
    initializePriorityButtons();
}

/**
 * Closes the task addition overlay by removing the 'show' class from both the 
 * boardAddTask overlay and the dark background overlay. Additionally, it calls 
 * closeTaskOverlay to close any open task overlays.
 */
function closeBoardAddTask() {
    let overlayRef = document.getElementById("boardAddTask");
    let darkOverlay = document.getElementById("darkOverlay");
    overlayRef.classList.remove("show");
    darkOverlay.classList.remove("show");
    closeTaskOverlay();
}

/**
 * Displays the task overlay and dark background overlay by adding the 'show' class to them.
 */

function showOverlayTask() {
    let showOverlay = document.getElementById("taskOverlay");
    let darkOverlay = document.getElementById("darkOverlay");
    darkOverlay.classList.add("show");
    showOverlay.classList.add("show");
}

/**
 * Opens the task overlay and populates it with task details.
 * @param {string} taskId - id of the task to open
 * @returns {Promise<void>}
 */
async function openTaskOverlay(taskId) {
    let task = await getOneTask(taskId);
    if (!task) return console.error("Task mit ID", taskId, "nicht gefunden.");
    let overlayRef = document.getElementById("taskOverlay");
    overlayRef.innerHTML = taskOverlayTemplate(task, taskId);
    applyOverlayStyles(taskId, task);
    overlayRef.classList.add("show");
    showOverlayTask();
}

/**
 * Applies styles to the task overlay according to the task's properties.
 * @param {string} taskId - id of the task to apply styles for
 * @param {Object} task - task object
 */
function applyOverlayStyles(taskId, task) {
    let elements = {
        title: "taskTitleID",
        description: "taskDescriptionID",
        date: "taskDateID",
        assigned: "taskAssignedID",
        priority: "taskPriorityIDName",
        status: "taskStatusID"
    };
    toggleCategory(taskId);
    Object.entries(elements).forEach(([key, id]) => updateOverlayClass(id, key));
    document.getElementById(elements.description).innerText = task.description;
}

/**
 * Updates the class of an element with the given id in the task overlay to
 * match the type of the task property (e.g. title, description, date, etc.).
 * @param {string} id - id of the element to update
 * @param {string} type - property type of the task (e.g. title, description, date, etc.)
 */
function updateOverlayClass(id, type) {
    let element = document.getElementById(id);
    if (!element) return;
    let baseClass = `task${type.charAt(0).toUpperCase() + type.slice(1)}`;
    let overlayClass = `openTaskOverlay${type.charAt(0).toUpperCase() + type.slice(1)}`;
    element.classList.replace(baseClass, overlayClass);
}

/**
 * Toggles the category style of a task element between normal and overlay styles.
 * If the task element with the specified ID is not found, logs an error and exits.
 * Changes the class of the category element from 'taskCategoryUserStory' to 
 * 'openTaskOverlayCategoryUserStory' or from 'taskCategoryTechnical' to 
 * 'openTaskOverlayCategoryTechnical', depending on the category.
 * 
 * @param {string} taskId - The ID of the task for which the category style is toggled.
 */
function toggleCategory(taskId) {
    let taskElement = document.querySelector(`#task-${taskId}`);
    if (!taskElement) {
        console.error();
        return;
    }
    let userStoryElement = taskElement.querySelector(".taskCategoryUserStory");
    let technicalElement = taskElement.querySelector(".taskCategoryTechnical");
    if (userStoryElement && userStoryElement.classList.contains('taskCategoryUserStory')) {
        userStoryElement.classList.remove('taskCategoryUserStory');
        userStoryElement.classList.add('openTaskOverlayCategoryUserStory');
    } else if (technicalElement && technicalElement.classList.contains('taskCategoryTechnical')) {
        technicalElement.classList.remove('taskCategoryTechnical');
        technicalElement.classList.add('openTaskOverlayCategoryTechnical');
    }
}

/**
 * Closes the task overlay and dark background overlay by removing the 'show' class.
 * Clears the overlay content and resets the global selected contacts array.
 * If the selected contacts container is present, empties its content.
 */
function closeTaskOverlay() {
    let overlayRef = document.getElementById("taskOverlay");
    let darkOverlay = document.getElementById("darkOverlay");
    darkOverlay.classList.remove("show");
    overlayRef.classList.remove("show");
    overlayRef.innerHTML = "";
    selectedContactsGlobal = [];
    const selectedContactsContainer = document.getElementById('selected-contacts');
    if (selectedContactsContainer) {
        selectedContactsContainer.innerHTML = '';
    }
}

/**
 * Deletes the task with the given taskId from the database and the globalTasks object.
 * Closes the task overlay after deletion.
 * Logs an error if the task is not found.
 * @param {string} taskId - The ID of the task to delete.
 */
async function deleteTask(taskId) {
    if (!isValidGlobalTasks()) return;
    let task = globalTasks[taskId];
    if (!task) return console.error("Task mit ID", taskId, "nicht gefunden.");
    try {
        await deleteTaskFromDB(taskId);
        delete globalTasks[taskId];
        displayTasks(globalTasks);
    } catch (error) {
        console.error("Fehler beim Löschen des Tasks:", error);
    }
    closeTaskOverlay();
}

/**
 * Checks if the globalTasks object is defined and has the correct format.
 * Logs an error and returns false if globalTasks is not defined or not an object.
 * @returns {boolean} true if globalTasks is a valid object, false otherwise.
 */
function isValidGlobalTasks() {
    if (!globalTasks || typeof globalTasks !== "object") {
        console.error("globalTasks ist nicht definiert oder hat das falsche Format.");
        return false;
    }
    return true;
}

/**
 * Deletes a task from the database.
 * @param {string} taskId - The ID of the task to delete.
 * @throws {Error} If the request fails or the response is not OK.
 */
async function deleteTaskFromDB(taskId) {
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Fehler beim Löschen der Aufgabe: ${response.statusText}`);
}

/**
 * Searches for tasks in the globalTasks object that contain the given search term
 * in their title or description. If no tasks are found, the task list is not
 * updated. If the globalTasks object is not defined or not an object, logs an
 * error and exits.
 */
function searchTask() {
    let searchTerm = document.getElementById("search").value.toLowerCase();
    if (!globalTasks || typeof globalTasks !== "object") {
        console.error("globalTasks ist nicht definiert oder hat das falsche Format.");
        return;
    }
    let filteredTasks = Object.entries(globalTasks).filter(([id, task]) => {
        let title = task.title?.toLowerCase() || "";
        let description = task.description?.toLowerCase() || "";
        return title.includes(searchTerm) || description.includes(searchTerm);
    });
    displayTasks(Object.fromEntries(filteredTasks));
}

/**
 * Validates the due date input from the 'editDueDate' field.
 * Checks if the date is in the format DD/MM/YYYY. If not, an alert is shown.
 * If the date is valid, it formats the date to YYYY-MM-DD and displays a confirmation alert.
 */
function validateDueDate() {
    let dateInput = document.getElementById('editDueDate').value;
    let datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;
    if (!datePattern.test(dateInput)) {
        alert('Bitte gib das Datum im Format DD/MM/YYYY ein.');
    } else {
        let parts = dateInput.split('/');
        let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        alert(`Datum ist gültig: ${formattedDate}`);
    }
}