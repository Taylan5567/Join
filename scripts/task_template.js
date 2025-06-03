/**
 * Generates the HTML template for the task success message.
 * This template is displayed when a task is successfully added to the board.
 * @returns {string} The HTML template for the task success message.
 */

function addTaskSuccessTemplate() {
    return `
    <div class="addTaskSuccess" id="signUpSuccessID">
        <p class="addTaskSuccessP">Task added to board <img src="../assets/svg/add_task/addedTask.svg" alt=""></p>
    </div>
    `;
}

/**
 * Generates the HTML template for the category element of a task.
 * The category element is a paragraph that displays the category of the task.
 * The category element also includes a button that can be clicked to change the
 * category of the task. When the button is clicked, the taskSwitchTemplate is
 * displayed. The taskSwitchTemplate is a div element that contains two buttons
 * that allow the user to change the category of the task to either "User Story"
 * or "Technical Task".
 * @param {Object} task - The task object for which the category element is generated.
 * @param {string} taskId - The ID of the task for which the category element is generated.
 * @returns {string} The HTML template for the category element of a task.
 */
function taskCategoryTemplate(task, taskId) {
    let category = task.category === "User Story" ? "User Story" : "Technical Task";
    let categoryClass = category === "User Story" ? "taskCategoryUserStory" : "taskCategoryTechnical";
    return `
    <div class="taskCategorySwitchContainer">
        <button class="openTaskOverlayChangeButton" onclick="event.stopPropagation(), taskSwitchMainCategory('${taskId}', '${task.mainCategory}')">
            <img class="openTaskOverlayChangeButtonImg" src="../assets/img/changeMainCategory.png" alt="">
        </button>
        <div id="taskSwitchOverlay-${taskId}" class="taskSwitchOverlay" style="display: none;">
            ${taskSwitchTemplate(task.mainCategory, taskId)}
        </div>
    <p id="taskCategoryID" class="taskDescription ${categoryClass}">${category}</p>
    </div>
    `;
}

/**
 * Generates the HTML template for the title of a task.
 * This template is used in the task element in the board view and
 * in the task edit overlay.
 * @param {Object} task - The task object for which the title element is generated.
 * @returns {string} The HTML template for the title of a task.
 */
function taskTitleTemplate(task) {
    return `<h3 id="taskTitleID" class="taskTitle">${task.title}</h3>`;
}

/**
 * Generates the HTML template for the description of a task.
 * This template is used in the task element in the board view and
 * in the task edit overlay. If the task description is longer than
 * 30 characters, it is truncated to 30 characters followed by an
 * ellipsis.
 * @param {Object} task - The task object for which the description element is generated.
 * @returns {string} The HTML template for the description of a task.
 */
function taskDescriptionTemplate(task) {
    let truncated = task.description.length > 30 ? task.description.substring(0, 30) + "..." : task.description;
    return `<p id="taskDescriptionID" class="taskDescription">${truncated}</p>`;
}

/**
 * Generates the HTML template for the date of a task.
 * If the task has a due date, this template displays the due date.
 * If the task does not have a due date, this template displays "No Date".
 * @param {Object} task - The task object for which the date element is generated.
 * @returns {string} The HTML template for the date of a task.
 */
function taskDateTemplate(task) {
    return `<p id="taskDateID" class="taskDate">${task.dueDate || "No Date"}</p>`;
}

/**
 * Generates the HTML template for displaying the progress of subtasks.
 * Includes a progress bar and a progress text showing the number of completed 
 * subtasks out of the total subtasks. If no subtasks are present, displays a 
 * message indicating that no subtasks are available.
 * 
 * @param {Object} task - The task object containing the subtasks.
 * @param {string} taskId - The ID of the task for which the subtask template is generated.
 * @returns {string} The HTML template for the subtask progress display.
 */
function taskSubtasksTemplate(task, taskId) {
    if (task.subtasks && task.subtasks.length > 0) {
        let completedSubtasks = task.subtasks.filter(subtask => subtask && subtask.completed).length;
        let totalSubtasks = task.subtasks.filter(subtask => subtask).length;
        let progressPercent = (completedSubtasks / totalSubtasks) * 100;
        return `
        <div class="taskSubtaskContainer">
            <div class="progressBarContainer">
                <div class="progressBar" style="width: ${progressPercent}%;"></div>
            </div>
            <p class="progressText">${completedSubtasks}/${totalSubtasks} Subtasks</p>
        </div>`;
    } else {
        return `<p>No Subtasks available</p>`;
    }
}

/**
 * Generates the HTML template for displaying subtasks in the task overlay.
 * The template includes a heading "Subtasks" and a list of subtasks.
 * Each subtask is represented by a checkbox with the text of the subtask.
 * The checkbox has an ID that is the concatenation of "subtask-", the task ID
 * and the index of the subtask. The checkbox also has an onclick event that
 * calls toggleSubtask with the index and the task ID as arguments.
 * @param {Object} task - The task object containing the subtasks.
 * @param {string} taskId - The ID of the task for which the subtask template is generated.
 * @returns {string} The HTML template for the subtask display in the task overlay.
 */
function taskSubtasksTemplateOverlay(task, taskId) {
    if (task.subtasks && task.subtasks.length > 0) {
        const subtasksHtml = task.subtasks.map((subtask, index) => `
            <p id="taskSubtasksID-${index}" class="openTaskOverlaySubtask">
                <input title="Toggle Subtask" type="checkbox" id="subtask-${taskId}-${index}" onclick="toggleSubtask(${index}, '${taskId}')" ${subtask.completed ? 'checked' : ''} required/> ${subtask.text}
            </p>
        `).join("");
        return `
        <div class="openTaskOverlaySubtaskContainer">
        <p class="openTaskOverlaySubtaskTitle">Subtasks</p>
            ${subtasksHtml}
        </div>`;
    } else {
        return ``;
    }
}

/**
 * Opens the task overlay and populates it with task details.
 * @param {string} taskId The ID of the task to open.
 * @returns {void}
 */
function openTaskOverlay(taskId) {
    let task = globalTasks[taskId];
    if (!task) return console.error(`Task with ID ${taskId} not found.`);
    let overlayRef = document.querySelector(".openTaskOverlayMain");
    if (!overlayRef) return console.error("Overlay not found.");
    overlayRef.innerHTML = getTaskOverlayContent(task, taskId);
    overlayRef.classList.add('active');
}

/**
 * Generates the HTML content for the task overlay.
 * Takes a task object and its ID as arguments and returns the HTML content as a string.
 * The content includes the task title, description, due date, priority, assigned contacts, and subtasks.
 * @param {Object} task - The task object for which the content is generated.
 * @param {string} taskId - The ID of the task for which the content is generated.
 * @returns {string} The HTML content for the task overlay.
 */
function getTaskOverlayContent(task, taskId) {
    return `
        <div>
            ${taskEditTitle(task)}
            ${taskEditDescription(task)}
            ${taskEditDate(task)}
            ${taskEditPriority(task)}
            ${taskEditAssignedTo(task)}
            ${taskEditSubtasks(task)}
            <button onclick="saveTask('${taskId}')">OK</button>
        </div>
    `;
}

/**
 * Retrieves a single task from the database by its ID.
 * @param {string} taskId - The ID of the task to retrieve.
 * @returns {Promise<Object>} - The task object or null if the task ID is undefined or the task was not found.
 * @throws {Error} If the request fails, or the response is not OK.
 */
async function getOneTask(taskId) {
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`);
    if (!response.ok) {
        throw new Error(`Fehler beim Laden der Aufgabe: ${response.statusText}`);
    }
    return await response.json();
}

/**
 * Toggles the completion status of a subtask and updates the database.
 * Retrieves the task from the database, toggles the completion status of the subtask at the given index,
 * updates the subtask in the database, and refreshes the task overlay.
 * 
 * @param {number} subtaskIndex - The index of the subtask to be toggled.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @returns {Promise<void>} - A promise that resolves once the subtask is updated in the database.
 */
async function toggleSubtask(subtaskIndex, taskId) {
    const checkbox = document.getElementById(`subtask-${taskId}-${subtaskIndex}`);
    let task = await getOneTask(taskId);
    task.subtasks[subtaskIndex].completed = checkbox.checked;
    await updateSubtaskDB(task, taskId);
    refreshTaskOverlay(taskId, task);
}

/**
 * Refreshes the task overlay by updating the subtask progress and reopening the overlay.
 * @param {string} taskId - The ID of the task to be refreshed.
 * @param {Object} task - The task object containing the subtasks.
 * @returns {void}
 */
function refreshTaskOverlay(taskId, task) {
    updateSubtaskProcess(taskId, task);
    openTaskOverlay(taskId);
}

/**
 * Updates the subtask progress bar and text for the given task.
 * Retrieves the number of completed and total subtasks from the task object,
 * calculates the progress percentage, and updates the progress bar and text.
 * Also updates the task overlay by calling taskSubtasksTemplate and reloading the task list.
 * @param {string} taskId - The ID of the task for which the subtask progress is updated.
 * @param {Object} task - The task object containing the subtasks.
 * @returns {Promise<void>} - A promise that resolves once the subtask progress is updated.
 */
async function updateSubtaskProcess(taskId, task) {
    if (!task || !task.subtasks) {
        console.error('Task or subtasks not defined');
        return;
    }
    let completedSubtasks = task.subtasks.filter(sub => sub.completed).length;
    let totalSubtasks = task.subtasks.length;
    let progressPercent = (completedSubtasks / totalSubtasks) * 100;
    let progressBar = document.querySelector(`.progressBar[data-task-id="${taskId}"]`);
    let progressText = document.querySelector(`.progressText[data-task-id="${taskId}"]`);
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    if (progressText) progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    taskSubtasksTemplate(taskId, task);
    await loadTask("/tasks");
}

/**
 * Updates the task with the given task ID in the Firebase database.
 * @param {Object} task - The updated task data to save to Firebase.
 * @param {string} taskId - The id of the task to update.
 * @throws {Error} If the request fails, or the response is not OK.
 */
async function updateSubtaskDB(task, taskId) {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Subtask: ${response.statusText}`);
    }
}

/**
 * Generates the HTML template for the assigned contacts section of a task.
 * Displays up to three assigned contacts with their initials and a colored background.
 * If there are more than three assigned contacts, the number of additional hidden contacts is shown.
 * @param {Object} task - The task object containing the assigned contacts.
 * @param {Array<string>} task.assignedTo - The list of names of assigned contacts.
 * @returns {string} The HTML template for the assigned contacts section.
 */
function taskAssignedTemplate(task) {
    if (!Array.isArray(task.assignedTo) || task.assignedTo.length === 0) return "";
    const displayed = task.assignedTo.slice(0, 3).map(renderAssignee).join("");
    const hiddenCount = task.assignedTo.length - 3;
    return `<div id="taskAssignedID" class="taskAssigned">${displayed}${hiddenCount > 0 ? `<p class="assignedHiddenCount">+${hiddenCount}</p>` : ""}</div>`;
}

/**
 * Generates the HTML for an assigned contact's initials.
 * The initials are displayed in a circle with a background color corresponding to the contact.
 * @param {string} name - The full name of the contact.
 * @returns {string} The HTML template for the contact's initials circle.
 */
function renderAssignee(name) {
    let initials = name.split(" ").map(part => part.charAt(0).toUpperCase()).join("");
    return `<div class="assigned-contact"><div class="initials-circle-board" style="background-color: ${getContactColor(name)};">${initials}</div></div>`;
}

/**
 * Generates the HTML template for the assigned contacts section of a task in the task overlay.
 * Displays the assigned contacts with their initials and a colored background.
 * @param {Object} task - The task object containing the assigned contacts.
 * @param {Array<string>|string} task.assignedTo - The list of names of assigned contacts.
 * @returns {string} The HTML template for the assigned contacts section.
 */
function taskAssignedTemplateOverlay(task) {
    if (!task.assignedTo) return "";
    return `<div id="taskAssignedID" class="taskAssigned">
                ${Array.isArray(task.assignedTo) ? task.assignedTo.map(renderOverlayAssignee).join("") : renderOverlayAssignee(task.assignedTo)}
            </div>`;
}

/**
 * Generates the HTML for an assigned contact's initials and name in the task overlay.
 * The initials are displayed in a circle with a background color corresponding to the contact.
 * @param {string} name - The full name of the contact.
 * @returns {string} The HTML template for the contact's initials circle and name.
 */
function renderOverlayAssignee(name) {
    let initials = name.split(" ").map(part => part.charAt(0)).join("");
    return `<p class="board_overlay_contact_box">
                <span class="initialsOverlay" style="background-color: ${getContactColor(name)};">${initials}</span> ${name}
            </p>`;
}

/**
 * Generates the HTML for the assigned contacts in a task edit form.
 * If the task has assigned contacts, it returns a string of HTML option elements,
 * each representing a contact. If there are multiple contacts, it maps over them
 * to create multiple option elements; otherwise, it creates a single option element.
 * If no contacts are assigned, it returns an empty string.
 * @param {Object} task - The task object containing the assigned contacts.
 * @returns {string} The HTML template for the assigned contacts as option elements.
 */
function taskAssignedEdit(task) {
    if (!task.assignedTo) return "";
    return Array.isArray(task.assignedTo)
        ? task.assignedTo.map(renderEditOption).join("")
        : renderEditOption(task.assignedTo);
}

/**
 * Generates an HTML option element for a contact in the assigned contacts list in the task edit form.
 * The contact's name is used as the value and text content of the option element.
 * @param {string} name - The full name of the contact.
 * @returns {string} The HTML template for the option element.
 */
function renderEditOption(name) {
    return `<option value="${name}" selected>${name}</option>`;
}

/**
 * Generates the HTML template for the task priority in the task list.
 * The priority is represented by a colored image corresponding to the priority.
 * @param {Object} task - The task object containing the priority to be rendered.
 * @returns {string} The HTML template for the task priority.
 */
function taskPriorityTemplate(task) {
    if (task.priority.toLowerCase() === "urgent") {
        return `
        <p id="taskPriorityID" class="taskPriority  taskPriorityUrgent"><img src="../assets/svg/add_task/prio_urgent.svg" alt=""></p>`
    } else if (task.priority.toLowerCase() === "medium") {
        return `
        <p id="taskPriorityID" class="taskPriority data-priority taskPriorityMedium"><img src="../assets/svg/add_task/prio_medium.svg" alt=""></p>`
    } else if (task.priority.toLowerCase() === "low") {
        return `
        <p id="taskPriorityID" class="taskPriority data-priority taskPriorityLow"><img src="../assets/svg/add_task/prio_low.svg" alt=""></p>`;
    }
}

/**
 * Generates the HTML template for the task priority in the task overlay.
 * The priority is represented by a colored image corresponding to the priority.
 * @param {Object} task - The task object containing the priority to be rendered.
 * @returns {string} The HTML template for the task priority.
 */
function taskPriorityTemplateName(task) {
    if (task.priority.toLowerCase() === "urgent") {
        return `
        <p id="taskPriorityIDName">Urgent</p>
        <p id="taskPriorityIDName" data-priority="Urgent" class=""><img src="../assets/svg/add_task/prio_urgent.svg" alt=""></p>`
    } else if (task.priority.toLowerCase() === "medium") {
        return `
        <p id="taskPriorityIDName">Medium</p>
        <p id="taskPriorityIDName" data-priority="Medium" class="taskPriorityMedium"><img src="../assets/svg/add_task/prio_medium.svg" alt=""></p>`
    } else if (task.priority.toLowerCase() === "low") {
        return `
        <p id="taskPriorityIDName">Low</p>
        <p id="taskPriorityIDName" data-priority="Low" class="taskPriorityLow"><img src="../assets/svg/add_task/prio_low.svg" alt=""></p>`
    }
}

/**
 * Generates the HTML template for the task status in the task list.
 * The status is represented as a text element.
 * @param {Object} task - The task object containing the status to be rendered.
 * @returns {string} The HTML template for the task status.
 */
function taskStatusTemplate(task) {
    return `
    <p id="taskStatusID" class="taskStatus">${task.status}</p>
    `
}

/**
 * Generates HTML option elements for selecting task priority.
 * The function iterates over predefined priority options and returns
 * a string of HTML option elements, marking the one that matches the
 * task's current priority as selected.
 * @param {Object} task - The task object containing the current priority.
 * @returns {string} The HTML options for the priority selection.
 */
function editingPriority(task) {
    const priorityOptions = ["Urgent", "Medium", "Low"];
    return priorityOptions.map(
        (priority) => `<option value="${priority}" ${task.priority === priority ? "selected" : ""}>${priority}</option>`
    ).join("");

}

/**
 * Generates HTML option elements for selecting users to assign to a task.
 * The function iterates over the provided users array and returns
 * a string of HTML option elements, marking the ones that are already
 * assigned to the task as selected.
 * @param {Array<string>} assignedTo - The list of users currently assigned to the task.
 * @param {Array<string>} users - The list of users to be rendered as options.
 * @returns {string} The HTML options for the user selection.
 */
function getAssignedOptions(assignedTo, users) {
    if (!users || !Array.isArray(users)) {
        console.error("Users array is undefined or not an array.");
        return "";
    }
    return users.map(
        (user) => `<option value="${user}" ${assignedTo.includes(user) ? "selected" : ""}>${user}</option>`
    ).join("");
}