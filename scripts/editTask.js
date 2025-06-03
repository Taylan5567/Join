let detailTask

/**
 * Converts the given priority to lowercase if it is not null or undefined.
 * If null or undefined, returns an empty string.
 * @param {string} priority The priority to normalize
 * @returns {string} The normalized priority
 */
function normalizePriority(priority) {
    return priority ? priority.toLowerCase() : '';
}

/**
 * Sets the active class on the priority button that matches the given priority.
 * Removes the active class from all other priority buttons.
 * @param {string} priority - The priority to make active.
 */
function applyActivePriorityButton(priority) {
    let priorityButton = document.querySelector(`#task-priority .prio-btn[data-prio="${priority}"]`);
    if (priorityButton) {
        document.querySelectorAll("#task-priority .prio-btn").forEach(btn => btn.classList.remove("active"));
        priorityButton.classList.add("active");
    }
}

/**
 * Sets up date validation for the edit task overlay.
 * Sets the minimum date for the due date input to today's date.
 * Adds an event listener to the input to show an error message if the selected date is in the past.
 * @see showDateError
 * @see hideDateError
 */
function setupDateValidation() {
    setTimeout(() => {
        let dateInput = document.getElementById("editDueDate"),
            errorText = document.getElementById("dateError");
        if (!dateInput || !errorText) return console.error("Fehlendes Element!");
        let today = new Date().toISOString().split("T")[0];
        dateInput.min = today;
        dateInput.addEventListener("input", () => {
            let selectedDate = new Date(dateInput.value);
            if (selectedDate < new Date(today)) showDateError(dateInput, errorText, today);
            else hideDateError(dateInput, errorText);
        });
    }, 100);
}

/**
 * Shows a date error message on the given input and error elements.
 * Sets the border of the input to red and displays the error message.
 * After 500ms, sets the value of the input to today's date.
 * @param {HTMLElement} input - The input element to show the error on.
 * @param {HTMLElement} error - The element to show the error message in.
 * @param {string} today - Today's date in ISO format (YYYY-MM-DD).
 */
function showDateError(input, error, today) {
    input.style.border = "2px solid red";
    error.textContent = "Das Datum darf nicht in der Vergangenheit liegen!";
    error.style.display = "block";
    setTimeout(() => input.value = today, 500);
}

/**
 * Hides the date error message for the given input and error elements.
 * Resets the border of the input to its default value and sets the display of the error message to none.
 * @param {HTMLElement} input - The input element to hide the error on.
 * @param {HTMLElement} error - The element to hide the error message in.
 */
function hideDateError(input, error) {
    input.style.border = "";
    error.style.display = "none";
}

/**
 * Generates the HTML template for the contact assignment dropdown in the task edit overlay.
 * Takes a task and its ID as arguments and returns the HTML template as a string.
 * The template includes a dropdown toggle button, a dropdown content div containing a list of
 * contacts, and a div containing the selected contacts. The dropdown toggle button has an onclick
 * event that calls toggleEditTaskDropdown, passing the event, the dropdown toggle element, and the
 * dropdown content element as arguments.
 * @param {Object} task - The task object for which the template is generated.
 * @param {string} taskId - The ID of the task to which the contacts are assigned.
 * @returns {string} The HTML template for the contact assignment dropdown in the task edit overlay.
 */
function taskEditAssignedTo(task, taskId) {
    let assignedContacts = task.assignedTo || [];
    let maxDisplay = 8;
    let displayedContacts = assignedContacts.slice(0, maxDisplay);
    return getTaskAssignedHTML(assignedContacts, displayedContacts);
}

/**
 * Toggles the visibility of the contact assignment dropdown in the task edit overlay.
 * It stops the event from propagating further, checks if the dropdown is currently visible,
 * and toggles its visibility state. If the dropdown is visible, it is hidden, and if hidden,
 * it is made visible while ensuring any other visible dropdowns on the page are hidden.
 * @param {Event} event - The event object associated with the dropdown toggle action.
 * @param {HTMLElement} toggle - The element that triggers the dropdown toggle.
 * @param {HTMLElement} options - The dropdown content element to be shown or hidden.
 */
function toggleEditTaskDropdown(event, toggle, options) {
    event.stopPropagation();
    if (options.classList.contains("visible")) {
        options.classList.remove("visible");
    } else {
        document.querySelectorAll(".dropdown-content-edit.visible").forEach(dropdown => {
            dropdown.classList.remove("visible");
        });
        options.classList.add("visible");
    }
}

/**
 * Toggles the selection state of a contact in the contact assignment dropdown in the task edit overlay.
 * Takes a container element and a contact name as arguments, toggles the selection state of the contact
 * by toggling the 'selected' class on the container and the 'checked' property on the checkbox inside
 * the container. Additionally, updates the task's assignedTo property and calls updateSelectedContactsUI
 * to update the selected contacts UI.
 * @param {HTMLElement} container - The container element to toggle the selection state for.
 * @param {string} contactName - The contact name to toggle the selection state for.
 * @returns {undefined} - The function does not return a value.
 */
function toggleContactSelectionUI(container, contactName) {
    let checkbox = container.querySelector("input[type='checkbox']");
    let isSelected = checkbox.checked = !checkbox.checked;
    container.classList.toggle("selected", isSelected);
    let selectedContactsContainer = document.getElementById('selected-contacts');
    let task = detailTask;
    if (!task) return console.error("Fehler: Keine Task gefunden!");
    if (isSelected) {
        if (!task.assignedTo.includes(contactName)) task.assignedTo.push(contactName);
    } else {
        task.assignedTo = task.assignedTo.filter(name => name !== contactName);
    }
    updateSelectedContactsUI();
}

/**
 * Updates the selected contacts UI in the task edit overlay.
 * Queries the DOM for the selected-contacts container and updates its innerHTML with
 * the list of selected contacts. The list is generated by mapping the task's assignedTo
 * array to a template string containing the contact's initials circle and the contact's full name
 * as a data attribute.
 * @returns {void} - The function does not return a value.
 */
function updateSelectedContactsUI() {
    let selectedContactsContainer = document.getElementById('selected-contacts');
    if (!selectedContactsContainer) return;
    selectedContactsContainer.innerHTML = detailTask.assignedTo.map(contactName => `
        <div class="selected-contact" data-fullname="${contactName}">
            <div class="initials-circle" style="background-color: ${getContactColor(contactName)}">
                ${getInitials(contactName)}
            </div>
        </div>
    `).join('');
}

/**
 * Retrieves the HTML elements for the input field, add button, clear button and the list of subtasks
 * in the task edit overlay.
 * @returns {{input: HTMLInputElement, addBtn: HTMLButtonElement, clearBtn: HTMLButtonElement, list: HTMLElement}|null} - The elements if found, null otherwise.
 */
function getTaskEditElements() {
    let input = document.getElementById('newEditSubtask');
    let addBtn = document.getElementById('addEditSubtask');
    let clearBtn = document.getElementById('clearEditSubtask');
    let list = document.getElementById('addEditSubtaskNew');
    if (!input || !addBtn || !clearBtn || !list) {
        console.error("Einige Elemente für 'Add Subtask' wurden im DOM nicht gefunden.");
        return null;
    }
    return { input, addBtn, clearBtn, list };
}

/**
 * Sets the input and click event handlers for the 'Add Subtask' input field and clear button.
 * Toggles the visibility of the clear button based on the input field's value.
 * Clears the input field and hides the clear button when the clear button is clicked.
 * @param {HTMLInputElement} input - The input field element for entering a new subtask.
 * @param {HTMLButtonElement} clearBtn - The button element for clearing the input field.
 */
function setInputEvents(input, clearBtn) {
    input.oninput = () => clearBtn.classList.toggle('d-none', !input.value.trim());
    clearBtn.onclick = () => { input.value = ''; clearBtn.classList.add('d-none'); };
}

/**
 * Sets the click event handler for the add button in the task edit overlay.
 * Calls the addEditNewSubtask function when the add button is clicked.
 * @param {HTMLButtonElement} addBtn - The button element that adds a new subtask.
 * @param {HTMLInputElement} input - The input field element for entering a new subtask.
 * @param {HTMLElement} list - The list element where the new subtask will be added.
 * @param {string} taskId - The ID of the task to which the subtask is added.
 */
function setButtonEvents(addBtn, input, list, taskId) {
    addBtn.onclick = () => addEditNewSubtask(input, list, taskId);
}

/**
 * Sets the keyboard event handler for the input field in the task edit overlay.
 * Listens for the 'Enter' key press event and prevents the default form submission behavior.
 * Calls the addEditNewSubtask function when the 'Enter' key is pressed.
 * 
 * @param {HTMLInputElement} input - The input field element for entering a new subtask.
 * @param {HTMLElement} list - The list element where the new subtask will be added.
 * @param {string} taskId - The ID of the task to which the subtask is added.
 */
function setKeyboardEvent(input, list, taskId) {
    input.onkeydown = function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addEditNewSubtask(input, list, taskId);
        }
    };
}