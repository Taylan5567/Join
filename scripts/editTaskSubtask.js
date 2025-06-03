/**
 * Adds a new subtask to the task edit overlay.
 * Retrieves the task text from the input element, trims it, and checks for validity.
 * Updates the global task model with the new subtask and appends the subtask element to the list.
 * Clears the input field after adding the subtask.
 * 
 * @param {HTMLInputElement} input - The input field element containing the new subtask text.
 * @param {HTMLElement} list - The list element where the new subtask will be appended.
 * @param {string} taskId - The ID of the task to which the subtask is added.
 * @returns {void} - The function does not return a value.
 */
function addEditNewSubtask(input, list, taskId) {
    let taskText = input.value.trim();
    if (!taskText || !taskId) return console.error("Fehler: Kein gültiger taskId oder leerer Text.");
    if (!globalTasks[taskId].subtasks) globalTasks[taskId].subtasks = [];
    const index = addSubtaskToModel(taskId, taskText);
    const subtaskElement = createEditSubtaskElement(taskText, index, taskId);
    list.appendChild(subtaskElement);
    input.value = '';
}

/**
 * Adds a new subtask to the global task model for a given task ID.
 * Inserts the subtask text with a default 'completed' status of false into the subtasks array.
 * 
 * @param {string} taskId - The ID of the task to which the subtask is added.
 * @param {string} taskText - The text content of the subtask to be added.
 * @returns {number} The index of the newly added subtask in the subtasks array.
 */
function addSubtaskToModel(taskId, taskText) {
    globalTasks[taskId].subtasks.push({ text: taskText, completed: false });
    return globalTasks[taskId].subtasks.length - 1;
}

/**
 * Creates and returns a subtask element for the task edit overlay.
 * The element includes a text point, hover events, and editing controls.
 * 
 * @param {string} taskText - The text content of the subtask.
 * @param {number} index - The index of the subtask within the task.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @returns {HTMLElement} The created subtask element with editing controls and hover events.
 */
function createEditSubtaskElement(taskText, index, taskId) {
    const subtaskElement = document.createElement('div');
    subtaskElement.classList.add('openEditTaskOverlaySubtask');
    subtaskElement.id = `subtask-container-${index}`;
    subtaskElement.appendChild(createSubtaskPoint(taskText, index));
    subtaskElement.onmouseenter = () => hoverSubtask(taskId, index);
    subtaskElement.onmouseleave = () => hoverOutSubtask(taskId, index);
    subtaskElement.appendChild(createEditingContainer(index, taskId));
    return subtaskElement;
}

/**
 * Creates a subtask point element with a label element containing the given task text and an ID
 * that is the concatenation of "subtask-" and the given index.
 * @param {string} taskText - The text content of the subtask point.
 * @param {number} index - The index of the subtask point.
 * @returns {HTMLElement} - The created subtask point element.
 */
function createSubtaskPoint(taskText, index) {
    const subtaskPoint = document.createElement('div');
    subtaskPoint.classList.add('editSubtaskPoint');
    subtaskPoint.innerHTML = `<p>•</p><label id="subtask-${index}">${taskText}</label>`;
    return subtaskPoint;
}

/**
 * Handles the hover event for a subtask in the task edit overlay.
 * Adds the hoverSubtask class to the subtask element and appends the editing controls to the element if they do not already exist.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @param {number} index - The index of the subtask within the task.
 * @returns {void} - The function does not return a value.
 */
function hoverSubtask(taskId, index) {
    let task = globalTasks[taskId];
    if (!task || !task.subtasks || !task.subtasks[index]) return;
    let subtaskElement = document.getElementById(`subtask-container-${index}`);
    if (subtaskElement) {
        subtaskElement.classList.add('hoverSubtask');
        if (!subtaskElement.querySelector('.subtaskEditingContainer')) {
            let subtaskEditingContainer = document.createElement('div');
            subtaskEditingContainer.classList.add('subtaskEditingContainer');
            subtaskEditingContainer.innerHTML = `
                <button onclick="toggleEditSubtask(${index}, '${taskId}')">
                    <img id="subtaskEditIcon" class="subtaskEditImg" src="../assets/svg/summary/pencil2.svg" alt="">    
                </button>
                <button onclick="deleteEditSubtask(${index}, '${taskId}')">
                    <img id="subtaskDeleteIcon" src="../assets/svg/add_task/trash.svg" alt="">
                </button>
            `;
            subtaskElement.appendChild(subtaskEditingContainer);
        }
    }
}

/**
 * Handles the hover out event for a subtask in the task edit overlay.
 * Removes the hoverSubtask class from the subtask element and removes the editing controls from the element if they exist.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @param {number} index - The index of the subtask within the task.
 * @returns {void} - The function does not return a value.
 */
function hoverOutSubtask(taskId, index) {
    let subtaskElement = document.getElementById(`subtask-container-${index}`);
    if (subtaskElement) {
        subtaskElement.classList.remove('hoverSubtask');
        let editingContainer = subtaskElement.querySelector('.subtaskEditingContainer');
        if (editingContainer) editingContainer.remove();
    }
}

/**
 * Toggles the edit mode of the subtask with the given index in the task with the given taskId.
 * Removes the hover event listeners and the editing controls from the subtask element.
 * Retrieves the current text of the subtask and generates a new subtask element with the subtask text
 * and editing controls. Appends the new element to the list.
 * @param {number} index - The index of the subtask to be toggled.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 */
function toggleEditSubtask(index, taskId) {
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    let subtaskLabel = document.getElementById(`subtask-${index}`);
    if (!subtaskContainer || !subtaskLabel) return console.error("Subtask-Element nicht gefunden!");
    let currentText = subtaskLabel.innerText;
    document.getElementById("subtaskDeleteIcon")?.classList.add("d-none");
    document.getElementById("subtaskEditIcon")?.classList.add("d-none");
    subtaskContainer.classList.remove('hoverSubtask');
    subtaskContainer.onmouseenter = subtaskContainer.onmouseleave = null;
    subtaskContainer.querySelector('.subtaskEditingContainer')?.remove();
    subtaskContainer.innerHTML = getEditSubtaskHTML(index, currentText, taskId);
}

/**
 * Saves the changes made to a subtask in the task edit overlay and stays in edit mode.
 * Retrieves the new text from the input field and updates the subtask text in the model.
 * Replaces the subtask element with a new element containing the updated text and the editing controls.
 * @param {number} index - The index of the subtask within the task.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @returns {void} - The function does not return a value.
 */
function saveEditStaySubtask(index, taskId) {
    let editedInput = document.getElementById(`edit-subtask-${index}`);
    let newText = editedInput.value.trim();
    let task = globalTasks[taskId];
    if (task && task.subtasks && task.subtasks[index]) task.subtasks[index].text = newText;
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    if (subtaskContainer) {
        subtaskContainer.innerHTML = `
            <div class="editSubtaskPoint">
                <p>•</p><label id="subtask-${index}">${newText}</label>
            </div>
            <div class="subtaskEditingContainer">
                <button onclick="toggleEditSubtask(${index}, '${taskId}')">
                    <img id="subtaskEditIcon" class="subtaskEditImg" src="../assets/svg/summary/pencil2.svg" alt="">
                </button>
                <button onclick="deleteEditSubtask(${index}, '${taskId}')">
                    <img id="subtaskDeleteIcon" src="../assets/svg/add_task/trash.svg" alt="">
                </button>
            </div>
        `;
    }
}

/**
 * Generates an HTML checkbox input element for a subtask.
 * The checkbox indicates whether the subtask is completed.
 * 
 * @param {number} index - The index of the subtask within the task.
 * @param {boolean} completed - A boolean indicating whether the subtask is completed.
 * @returns {string} - The HTML string for the checkbox input element.
 */
function subtaskCompletedCheckbox(index, completed) {
    return `
        <input type="checkbox" id="subtask-completed-${index}" ${completed ? 'checked' : ''} />
    `;
}

/**
 * Saves the edited subtask text to the task object and updates the subtask's HTML content.
 * Retrieves the task ID from the button element's data attribute and fetches the task from Firebase.
 * If the task and subtask exist, it updates the subtask text and refreshes the subtask's HTML.
 * Also updates the subtask in the database.
 * 
 * @param {number} index - The index of the subtask within the task.
 * @param {HTMLElement} buttonElement - The button element used to trigger the save, containing the task ID in a data attribute.
 * @returns {Promise<void>} - A promise that resolves once the subtask is updated in the database.
 */
async function saveEditedSubtask(index, buttonElement) {
    let taskId = buttonElement.getAttribute('data-task-id');
    let editedInput = document.getElementById(`edit-subtask-${index}`);
    if (!editedInput) return console.error("Bearbeitungsfeld nicht gefunden!");
    let newText = editedInput.value.trim();
    let task = await fetchTaskFromFirebase(taskId);
    if (!task || !task.subtasks) return console.error("Task oder Subtasks nicht gefunden!");
    task.subtasks[index].text = newText;
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    subtaskContainer.innerHTML = getSubtaskHTML(index, newText, taskId);
    await updateSubtaskDB(task, taskId);
}

/**
 * Deletes a subtask from the global task model and removes its HTML element from the task edit overlay.
 * If the task or its subtasks are not found, logs an error message.
 * Updates the subtasks in the database after deletion.
 * 
 * @param {number} index - The index of the subtask to be deleted within the task.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @returns {void} - The function does not return a value.
 */
function deleteEditSubtask(index, taskId) {
    let task = globalTasks[taskId];
    if (!task || !task.subtasks) return console.error("Task oder Subtasks nicht gefunden!");
    task.subtasks.splice(index, 1);
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    subtaskContainer.remove();
    updateSubtaskDB(task, taskId);
}

/**
 * Generates the HTML template for the "Add Subtask" input field in the task edit overlay.
 * The template includes an input field, a clear button and an add button. The input field
 * has a maxlength of 20 characters and a placeholder text of "Add new subtask". The clear
 * button is hidden by default and the add button is visible. The template also includes
 * a script tag that initializes the "Add Subtask" elements in the task edit overlay.
 * @returns {string} The HTML template for the "Add Subtask" input field in the task edit overlay.
 */
function taskEditAddSubtask() {
    return taskEditAddSubtaskTemplate();
}

/**
 * Initializes the elements for the "Add Subtask" input field in the task edit overlay.
 * Retrieves the HTML elements for the input field, add button, clear button and the list of subtasks
 * and sets event listeners for the input field and button events.
 * @param {string} taskId - The ID of the task to which the subtask is added.
 * @returns {void} - The function does not return a value.
 */
function initTaskEditAddSubtask(taskId) {
    let elements = getTaskEditElements();
    if (!elements) return;
    let { input, addBtn, clearBtn, list } = elements;
    setInputEvents(input, clearBtn);
    setButtonEvents(addBtn, input, list, taskId);
    setKeyboardEvent(input, list, taskId);
}