/**
 * Executes when the document is fully loaded.
 * Initiates the loading of tasks from the specified path.
 */
function onload() {
    loadTask("/tasks");
}

let globalTasks = {};
let mainCategory = '';
const BASE_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Loads the tasks from the Firebase database and displays them.
 * @param {string} [path="/tasks"] - The path to the tasks in the Firebase database.
 * @returns {Promise<void>} - The function does not return a value.
 */
async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let tasks = await response.json();
    globalTasks = tasks;
    displayTasks(tasks);
}

/**
 * Displays the tasks in the task containers.
 * @param {Object} tasks - The tasks to be displayed.
 * @returns {void} - The function does not return a value.
 */
function displayTasks(tasks) {
    clearTaskContainers();
    let taskArray = Object.entries(tasks);
    taskArray.forEach(([taskId, task]) => {
        if (!task.mainCategory) {
            return;
        }
        let taskElement = createTaskElement(task, taskId);
        appendTaskToCategory(task, taskElement);
    });
    emptyTaskContainer();
}

/**
 * Clears the task containers for different categories.
 * Empties the inner HTML of the containers for tasks categorized as
 * "To Do", "In Progress", "Await Feedback", and "Done".
 * This function is used to reset the task display areas before
 * rendering new or updated task data.
 * @returns {void} - The function does not return a value.
 */
function clearTaskContainers() {
    document.getElementById("tasksContainerToDo").innerHTML = "";
    document.getElementById("tasksContainerInProgress").innerHTML = "";
    document.getElementById("tasksContainerAwaitFeedback").innerHTML = "";
    document.getElementById("tasksContainerDone").innerHTML = "";
}

/**
 * Creates a task element for display in the task containers.
 * The task element is a div with the class "task" and contains
 * a div with the class "taskContainer" that is draggable and
 * has an onclick event that calls openTaskOverlay with the
 * task ID as an argument. The task element also contains the
 * task category, title, description, subtasks, and assigned
 * contacts, as well as a priority indicator.
 * @param {Object} task - The task object to be displayed.
 * @param {string} taskId - The ID of the task to be displayed.
 * @returns {HTMLElement} The task element to be displayed.
 */
function createTaskElement(task, taskId) {
    let taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.innerHTML = `
        <div draggable="true" ondragstart="dragInit(event, '${taskId}')" class="taskContainer" onclick="openTaskOverlay('${taskId}')">
            <div class="taskChildContainer">
                ${taskCategoryTemplate(task, taskId)}
                <div class="taskTitleContainer">
                    ${taskTitleTemplate(task)}
                    ${taskDescriptionTemplate(task)}
                </div>
                ${taskSubtasksTemplate(task)}
                <div class="taskAssignedMain">
                    ${taskAssignedTemplate(task)}
                    ${taskPriorityTemplate(task)}
                </div>
            </div>
        </div>
    `;
    return taskElement;
}

/**
 * Appends the task element to the task container for the corresponding category.
 * The category is determined by the mainCategory property of the task object.
 * The task element is appended to the element with the ID of
 * "tasksContainer" followed by the category in camel case.
 * @param {Object} task - The task object whose category is used.
 * @param {HTMLElement} taskElement - The task element to be appended.
 * @returns {void} - The function does not return a value.
 */
function appendTaskToCategory(task, taskElement) {
    let category = task.mainCategory;
    let containerId = `tasksContainer${category}`;
    document.getElementById(containerId).appendChild(taskElement);
}

/**
 * Handles the click event for the 'To Do' button.
 * If the viewport width is less than or equal to 900px, redirects to the add task page.
 * Otherwise, calls boardAddTask() with mainCategory set to "ToDo".
 * @returns {void} - The function does not return a value.
 */
function getToDoButton() {
    if (window.innerWidth <= 900) {
        window.location.href = './add_task.html';
    } else {
        mainCategory = "ToDo";
        boardAddTask();
    }
};

/**
 * Handles the click event for the 'In Progress' button.
 * Calls boardAddTask() with mainCategory set to "InProgress".
 * @returns {void} - The function does not return a value.
 */
function getInProgressButton() {
    mainCategory = "InProgress";
    boardAddTask();
}

/**
 * Handles the click event for the 'Await Feedback' button.
 * Calls boardAddTask() with mainCategory set to "AwaitFeedback".
 * @returns {void} - The function does not return a value.
 */
function getAwaitFeedbackButton() {
    mainCategory = "AwaitFeedback";
    boardAddTask();
}

/**
 * Posts the task to the server and handles the response.
 * If the task can be posted (i.e. the category is valid), it sends a POST request to the server with the task data.
 * If the request is successful, it shows a success message and closes the task addition overlay.
 * If the request fails, it logs the error to the console.
 * Finally, it calls the onload() function to update the UI.
 * @returns {void} - The function does not return a value.
 */
async function postTask() {
    if (!validateCategory()) return;
    try {
        const result = await postTaskToServer(getTaskData());
        addTaskSuccess();
        closeBoardAddTask();
    } catch (error) {
        console.error('Error posting task:', error);
    }
    onload();
}

/**
 * Toggles the error state of the category dropdown and its error message.
 * The category dropdown will be given the class 'error' if the category is not valid, and the error message will be shown.
 * If the category is valid, the 'error' class will be removed and the error message will be hidden.
 * @param {boolean} isValid - Whether the category is valid.
 * @returns {void} - The function does not return a value.
 */
function toggleCategoryError(isValid) {
    let categoryElement = document.getElementById('dropdown-toggle-category');
    let errorElement = document.getElementById('category-error');
    categoryElement.classList.toggle('error', !isValid);
    errorElement.classList.toggle('hidden', isValid);
}

/**
 * Returns the task data as an object.
 * The object will contain the following keys: title, description, assignedTo, dueDate, priority, category, subtasks, mainCategory.
 * These keys will have the following values: the title of the task, the description of the task, an array of contacts assigned to the task, the due date of the task, the priority of the task, the category of the task, an array of subtasks of the task, the main category of the task.
 * @returns {Object} - The task data as an object.
 */
function getTaskData() {
    return {
        title: getTitle(),
        description: getDescription(),
        assignedTo: getSelectedContacts(),
        dueDate: getDueDate(),
        priority: getPriority(),
        category: getCategory(),
        subtasks: getSubtasks(),
        mainCategory
    };
}

/**
 * Retrieves the task title from the input field.
 * @returns {string} - The title of the task.
 */
function getTitle() {
    return document.getElementById("task-title").value;
}

/**
 * Retrieves the task description from the input field.
 * @returns {string} - The description of the task.
 */

function getDescription() {
    return document.getElementById("task-desc").value;
}

/**
 * Retrieves the due date of the task from the input field.
 * @returns {string} - The due date of the task as a string in the format 'YYYY-MM-DD'.
 */
function getDueDate() {
    return document.getElementById("task-date").value;
}

/**
 * Retrieves the priority of the task from the active priority button.
 * The function queries for a button with the class 'prio-btn' and 'active',
 * and returns the value of its 'data-prio' attribute. If no button is active,
 * it returns an empty string.
 * @returns {string} The priority of the task, or an empty string if no priority is selected.
 */
function getPriority() {
    return document.querySelector('.prio-btn.active')?.dataset.prio || '';
}

/**
 * Retrieves the selected category from the category dropdown.
 * This function returns the trimmed text content of the span element
 * within the category dropdown toggle.
 * @returns {string} The name of the selected category.
 */
function getCategory() {
    return document.querySelector('#dropdown-toggle-category span').textContent.trim();
}

/**
 * Retrieves the subtasks from the task list.
 * The function queries for all 'li' elements in the subtask list container
 * and maps them to an array of objects with 'text' and 'completed' properties.
 * The 'text' property is derived from the trimmed text content of the 'li' element
 * by removing the '• ' prefix that is added by the add subtask button. The
 * 'completed' property is set to false for all subtasks.
 * @returns {Array<Object>} The subtasks of the task, each with 'text' and 'completed' properties.
 */
function getSubtasks() {
    return Array.from(document.querySelectorAll("#subtask-list li")).map(li => ({
        text: li.textContent.trim().replace('• ', ''),
        completed: false
    }));
}

/**
 * Handles the submission of the add task form.
 * Validates the selected category and, if valid, creates a task object from the form data and adds it to Firebase.
 * If the addition to Firebase is successful, it resets the form and navigates to the to-do add task page.
 * If the addition to Firebase fails, it logs the error to the console.
 * @param {Event} event The form submission event.
 * @returns {void}
 */
function submitAddTask(event) {
    event.preventDefault();
    if (!validateCategorySubmit()) return;
    let task = createTaskObject(document.getElementById('task-form'));
    addTaskToFirebase(task).then(() => {
        resetFormAndNotify(document.getElementById('task-form'));
        getToDoAddTaskPage(event);
    }).catch(console.error);
}

/**
 * Validates that a task category has been selected from the dropdown menu.
 * If the default option 'Select task category' is still selected, it adds an error class
 * to the dropdown and displays an error message. If a valid category is selected, it
 * removes the error class and hides the error message.
 * 
 * @returns {boolean} True if a valid category is selected, false otherwise.
 */
function validateCategorySubmit() {
    let categoryText = document.querySelector('#dropdown-toggle-category span').textContent;
    let categoryError = document.getElementById('category-error');
    if (categoryText === 'Select task category') {
        document.getElementById('dropdown-toggle-category').classList.add('error');
        categoryError.classList.remove('hidden');
        return false;
    }
    document.getElementById('dropdown-toggle-category').classList.remove('error');
    categoryError.classList.add('hidden');
    return true;
}

/**
 * Collects all task data from the DOM and returns it as a JSON object.
 * @returns {Object} - The task data as a JSON object with properties title, description, assignedTo, dueDate, priority, category, subtasks, and mainCategory.
 */
function collectTaskData() {
    return {
        title: document.getElementById("task-title").value,
        description: document.getElementById("task-desc").value,
        assignedTo: getSelectedContacts(),
        dueDate: document.getElementById("task-date").value,
        priority: document.querySelector('.prio-btn.active')?.dataset.prio || '',
        category: document.querySelector('#dropdown-toggle-category span').textContent.trim(),
        subtasks: Array.from(document.querySelectorAll("#subtask-list li")).map(li => ({
            text: li.textContent.trim(),
            completed: false
        })),
        mainCategory: "ToDo"
    };
}

/**
 * Displays a confirmation message and redirects the user to the board page.
 * The confirmation message is shown by adding a 'show' class to its element,
 * and after 1.5 seconds, the message is hidden, and the user is redirected
 * to 'board.html'.
 */
function showConfirmationAndRedirect() {
    let confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.classList.add('show');
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
        window.location.href = 'board.html';
    }, 1500);
}

/**
 * Checks if the innerHTML of the task containers is empty and if so,
 * sets it to a message saying there are no tasks to do.
 * @returns {undefined}
 */
function emptyTaskContainer() {
    let containers = [
        "tasksContainerAwaitFeedback",
        "tasksContainerInProgress",
        "tasksContainerDone",
        "tasksContainerToDo"
    ];
    containers.forEach(containerId => {
        let container = document.getElementById(containerId);
        if (container.innerHTML.trim() === "") {
            container.innerHTML = `<div class='noTasksParent'><p class='noTasksChild'>No tasks To do</p></div>`;
        }
    });
}

/**
 * Adds a task's HTML representation to a specified container in the DOM.
 * If the container previously displayed a "No tasks To do" message, it clears this message before adding the task.
 * 
 * @param {string} containerId - The ID of the DOM element container where the task HTML should be added.
 * @param {string} taskHTML - The HTML string representing the task to be added to the container.
 */
function addTaskToContainer(containerId, taskHTML) {
    let container = document.getElementById(containerId);
    if (container.innerHTML.trim() === `<div class='noTasksParent'><p class='noTasksChild'>No tasks To do</p></div>`) {
        container.innerHTML = "";
    }
    container.innerHTML += taskHTML;
}