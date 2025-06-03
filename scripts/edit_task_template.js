/**
 * Generates the HTML template for editing a task's title.
 * This function returns a div container with a label and a text input
 * for the title. The title is set to the title of the task passed as a parameter.
 * @param {Object} task - The task that is being edited, containing the title to be edited.
 * @returns {string} The HTML template for editing a task's title.
 */
function taskEditTitle(task) {
    return `
    <div class="openEditTaskOverlayTitle">
        <label for="editTitle">Title</label>
        <input id="editTitle" type="text" maxlength="30" value="${task.title}" />
    </div>
    `;
}

/**
 * Generates the HTML template for editing a task's description.
 * This function returns a div container with a label and a textarea
 * for the description. The description is set to the description of the task
 * passed as a parameter.
 * @param {Object} task - The task that is being edited, containing the description to be edited.
 * @returns {string} The HTML template for editing a task's description.
 */
function taskEditDescription(task) {
    return `
    <div class="openEditTaskOverlayDescription">
        <label for="editDescription">Description</label>
        <textarea class="" maxlength="150" id="editDescription">${task.description}</textarea>
    </div>
    `;
}

/**
 * Generates the HTML template for editing a task's due date.
 * This function returns a div container with a label and a date input
 * for the due date. The due date is set to the due date of the task
 * passed as a parameter. The date input element is configured to
 * accept dates between today and 100 years into the future.
 * @param {Object} task - The task that is being edited, containing the due date to be edited.
 * @returns {string} The HTML template for editing a task's due date.
 */
function taskEditDate(task) {
    let today = new Date().toISOString().split("T")[0];
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 100);
    let maxDateString = maxDate.toISOString().split("T")[0];
    return `
    <div class="openEditTaskOverlayDueDate">
        <label for="editDueDate">Due Date</label>
        <input 
            type="date" 
            class="duoDateColor"
            id="editDueDate" 
            value="${task.dueDate}" 
            min="${today}" 
            max="${maxDateString}" 
        />
        <small id="dateError" style="color: red; display: none;">
            Datum muss zwischen heute und 100 Jahre in der Zukunft liegen
        </small>
    </div>
    `;
}

/**
 * Generates the HTML template for editing a task's priority.
 * This function returns a div container with a label, and three buttons
 * for the three different priorities. The button for the priority that
 * matches the task's priority is marked as active.
 * @param {Object} task - The task that is being edited, containing the priority to be edited.
 * @returns {string} The HTML template for editing a task's priority.
 */
function taskEditPriority(task) {
    return `
        <div class="gap_8">
            <p class="prioHeadline">Priority</p>
            <div id="task-priority" data-priority="${task.priority}">
                <button type="button" class="prio-btn urgent" data-prio="Urgent">
                    Urgent <img src="../assets/svg/add_task/prio_urgent.svg" alt="">
                </button>
                <button type="button" class="prio-btn medium" data-prio="Medium">
                    Medium <img src="../assets/svg/add_task/prio_medium.svg" alt="">
                </button>
                <button type="button" class="prio-btn low" data-prio="Low">
                    Low <img src="../assets/svg/add_task/prio_low.svg" alt="">
                </button>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML template for a contact list with selection checkboxes.
 * The list of contacts is filtered such that only contacts that are not already
 * assigned to the task are shown. The function takes an array of contact names
 * that are assigned to the task and returns an HTML string representing the
 * contact list. The list elements are clickable and toggle the selection state
 * of the corresponding contact.
 * @param {string[]} assignedContacts - The list of contact names that are assigned to the task.
 * @returns {string} The HTML template for the contact list.
 */
function createContactListHtml(assignedContacts) {
    return contacts.map(contact => {
        const isSelected = assignedContacts.includes(contact.name);
        return `
            <div class="contact-item ${isSelected ? 'selected' : ''}" data-fullname="${contact.name}" onclick="toggleContactSelectionUI(this, '${contact.name}')">
                <div class="contact-circle-label">
                    <div class="initials-circle" style="background-color: ${getContactColor(contact.name)}">
                        ${getInitials(contact.name)}
                    </div>
                    <span class="contact-label">${contact.name}</span>
                </div>
                <input class="checkbox" type="checkbox" ${isSelected ? 'checked' : ''} />
            </div>
        `;
    }).join("");
}

/**
 * Generates the HTML template for the selected contacts UI.
 * The function takes an array of contact names that are selected and
 * returns an HTML string representing the selected contacts UI.
 * The selected contacts UI consists of a list of div elements with
 * the class "selected-contact", each containing a div with the class
 * "initials-circle" and the contact's initials inside.
 * @param {string[]} displayedContacts - The list of contact names that are selected.
 * @returns {string} The HTML template for the selected contacts UI.
 */
function createSelectedContactsHtml(displayedContacts) {
    return displayedContacts.map(contactName => `
        <div class="selected-contact" data-fullname="${contactName}">
            <div class="initials-circle" style="background-color: ${getContactColor(contactName)}">
                ${getInitials(contactName)}
            </div>
        </div>
    `).join('');
}

/**
 * Creates a container element for editing subtasks in the task edit overlay.
 * The container includes buttons for editing and deleting the subtask.
 * @param {number} index - The index of the subtask within the task.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @returns {HTMLElement} The container element with editing controls for the subtask.
 */
function createEditingContainer(index, taskId) {
    const container = document.createElement('div');
    container.classList.add('subtaskEditingContainer');
    container.innerHTML = `
        <button onclick="toggleEditSubtask(${index}, '${taskId}')">
            <img class="subtaskEditImg" src="../assets/svg/summary/pencil2.svg" alt="">
        </button>
        <button onclick="deleteEditSubtask(${index}, '${taskId}')">
            <img src="../assets/svg/add_task/trash.svg" alt="">
        </button>
    `;
    return container;
}

/**
 * Generates the HTML template for the "Add Subtask" input field in the task edit overlay.
 * The template includes an input field, a clear button and an add button. The input field
 * has a maxlength of 20 characters and a placeholder text of "Add new subtask". The clear
 * button is hidden by default and the add button is visible. The template also includes
 * a script tag that initializes the "Add Subtask" elements in the task edit overlay.
 * @param {Object} task - The task object for which the "Add Subtask" template is generated.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @returns {string} The HTML template for the "Add Subtask" input field in the task edit overlay.
 */
function taskEditAddSubtaskTemplate(task, taskId) {
    return `
        <div class="openEditAddSubtask" id="subtask-container-edit">
            <input class="openEditAddSubtaskInput" maxlength="20" type="text" id="newEditSubtask" placeholder="Add new subtask">
            <img id="clearEditSubtask" class="d-none" src="../assets/svg/add_task/closeXSymbol.svg" alt="">
            <img id="addEditSubtask" src="../assets/svg/add_task/add+symbol.svg" alt="">
        </div>
        <script>
            initTaskEditAddSubtask('${taskId}');
        </script>
    `;
}

/**
 * Generates the HTML template for the subtasks of the task in the task edit overlay.
 * The template includes a container element with the class "openTaskOverlaySubtaskContainer"
 * and a paragraph element with the class "openTaskOverlayEditSubtaskTitle" and the text
 * "Subtasks". The container element also includes the "Add Subtask" template generated by
 * taskEditAddSubtaskTemplate and the subtasks of the task, each represented as a div element
 * with the class "openEditTaskOverlaySubtask" and an ID that is the concatenation of
 * "subtask-container-" and the index of the subtask. Each subtask element contains a div
 * element with the class "editSubtaskPoint" and a label element with the text of the subtask.
 * The label element has an ID that is the concatenation of "subtask-" and the index of the
 * subtask. The subtask elements also have onmouseenter and onmouseleave events that call
 * hoverSubtask and hoverOutSubtask respectively, passing the task ID and the index of the
 * subtask as arguments.
 * @param {Object} task - The task object for which the subtask template is generated.
 * @param {string} taskId - The ID of the task to which the subtasks belong.
 * @returns {string} The HTML template for the subtasks of the task in the task edit overlay.
 */
function taskEditSubtasks(task, taskId) {
    if (!task || !task.subtasks) return '';
    let subtasksHtml = task.subtasks.map((subtask, index, task) => {
        return `
            <div class="openEditTaskOverlaySubtask" id="subtask-container-${index}" onmouseenter="hoverSubtask('${taskId}', ${index})" onmouseleave="hoverOutSubtask('${taskId}', ${index})">
                <div class="editSubtaskPoint"><p>• </p><label id="subtask-${index}">${subtask.text}</label></div>
            </div>
        `;
    }).join("");
    return `
        <div id="addEditSubtaskNew" class="openTaskOverlaySubtaskContainer">
            <p class="openTaskOverlayEditSubtaskTitle">Subtasks</p>
            ${taskEditAddSubtaskTemplate(task, taskId)}
            ${subtasksHtml}
        </div>
    `;
}

/**
 * Generates the HTML template for a subtask in the task edit overlay.
 * The template includes a label element with the text of the subtask and an ID that is the
 * concatenation of "subtask-" and the index of the subtask. The label element is followed by
 * a div element with the class "subtaskEditingContainer" which contains two buttons: one for
 * toggling the edit mode of the subtask and one for deleting the subtask. The buttons have
 * onclick events that call toggleEditSubtask and deleteEditSubtask respectively, passing the
 * index and the task ID as arguments.
 * @param {number} index - The index of the subtask.
 * @param {string} newText - The new text of the subtask.
 * @param {string} taskId - The ID of the task to which the subtasks belong.
 * @returns {string} The HTML template for the subtask in the task edit overlay.
 */
function getSubtaskHTML(index, newText, taskId) {
    return `
        <label id="subtask-${index}">${newText}</label>
        <div class="subtaskEditingContainer">
            <button onclick="toggleEditSubtask(${index}, '${taskId}')">
                <img src="../assets/svg/edit.svg" alt="">
            </button>
            <button onclick="deleteEditSubtask(${index}, '${taskId}')">
                <img src="../assets/svg/delete.svg" alt="">
            </button>
        </div>
    `;
}

/**
 * Generates the HTML template for a subtask in edit mode in the task edit overlay.
 * The template includes an input field with the current text of the subtask and two buttons:
 * one for deleting the subtask and one for saving the changes made to the subtask.
 * The buttons have onclick events that call deleteEditSubtask and saveEditStaySubtask respectively,
 * passing the index and the task ID as arguments.
 * @param {number} index - The index of the subtask.
 * @param {string} currentText - The current text of the subtask.
 * @param {string} taskId - The ID of the task to which the subtasks belong.
 * @returns {string} The HTML template for the subtask in edit mode in the task edit overlay.
 */
function getEditSubtaskHTML(index, currentText, taskId) {
    return `
        <div class="subtaskEditingMainContainer">
            <input class="subtaskEditingInput" maxlength="25" type="text" id="edit-subtask-${index}" value="${currentText}" />
            <div class="subtaskEditingImgMain">
                <button class="subtaskEditReImg" onclick="deleteEditSubtask(${index}, '${taskId}')">
                    <img src="../assets/svg/deletenew.svg" alt="">
                </button>
                <button class="subtaskEditReImg2" onclick="saveEditStaySubtask(${index}, '${taskId}')">
                    <img src="../assets/svg/add_task/check_create_task.svg" alt="">    
                </button>
            </div>
        </div>`;
}

/**
 * Generates the HTML template for the contact assignment dropdown in the task edit overlay.
 * The template includes a dropdown toggle button, a dropdown content div containing a list of
 * contacts, and a div containing the selected contacts. The dropdown toggle button has an onclick
 * event that calls toggleEditTaskDropdown, passing the event, the dropdown toggle element, and the
 * dropdown content element as arguments.
 * @param {Array<string>} assignedContacts - The list of contacts assigned to the task.
 * @param {Array<string>} displayedContacts - The list of contacts to be displayed in the dropdown.
 * @returns {string} The HTML template for the contact assignment dropdown in the task edit overlay.
 */
function getTaskAssignedHTML(assignedContacts, displayedContacts) {
    return `
        <div id="task-assigned" class="dropdown-wrapper">
            <div class="dropdown-toggle" onclick="toggleEditTaskDropdown(event, this, document.querySelector('.dropdown-content-edit'))">
                <span>Select contacts to assign</span>
                <span class="dropdown-arrow"></span>
            </div>
            <div class="dropdown-content-edit">
                ${createContactListHtml(assignedContacts)}
            </div>
            <div id="selected-contacts" class="selected-contacts">
                ${createSelectedContactsHtml(displayedContacts)}
            </div>
        </div>
    `;
}