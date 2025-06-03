let tasks = [];
const contactColors = new Map();
let selectedPriority = null;

/**
 * Initializes the application by setting up the contacts dropdown,
 * priority buttons, subtasks, date validation, and clear button. 
 * Prevents form submission on pressing Enter and initializes the header.
 */
function initializeApp() {
    initializeContactsDropdown();
    initializePriorityButtons();
    initializeSubtasks();
    setDateValidation();
    initializeClearButton();
    preventFormSubmissionOnEnter();
    initHeader()
}

/**
 * Retrieves the current date in the ISO format (YYYY-MM-DD).
 * @returns {String} The current date in the ISO format.
 */
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Sets the minimum and maximum date attributes for the given date input element.
 * The minimum date is set to the current date and the maximum date is set to 100 years from the current date.
 * @param {HTMLElement} dateInput - The date input element to update.
 * @param {String} today - The current date in ISO format (YYYY-MM-DD).
 * @param {String} maxDateString - The maximum date in ISO format (YYYY-MM-DD).
 */
function setDateAttributes(dateInput, today, maxDateString) {
    dateInput.setAttribute('min', today);
    dateInput.setAttribute('max', maxDateString);
}

/**
 * Handles the input color change for the given date input element.
 * The input color is set to black if the date input has a value, otherwise it is set to an empty string.
 * @param {HTMLElement} dateInput - The date input element to update.
 */
function handleInputColorChange(dateInput) {
    dateInput.oninput = function () {
        dateInput.style.color = dateInput.value ? 'black' : '';
    };
}

/**
 * Observes changes in the DOM and reapplies date validation to dynamically added date inputs.
 * @param {String} today - The current date in ISO format (YYYY-MM-DD).
 * @param {String} maxDateString - The maximum date in ISO format (YYYY-MM-DD).
 */
function observeDomChanges(today, maxDateString) {
    const observer = new MutationObserver(() => {
        applyValidation(today, maxDateString);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Initializes the 'Add Subtask' elements in the add task overlay.
 * Retrieves the HTML elements, sets input and button events and a keyboard event.
 */
function initializeSubtasks() {
    const input = document.getElementById('new-subtask');
    const addBtn = document.getElementById('add-subtask');
    const clearBtn = document.getElementById('clear-subtask');
    const list = document.getElementById('subtask-list');
    input.oninput = () => clearBtn.classList.toggle('d-none', !input.value.trim());
    clearBtn.onclick = () => (input.value = '') && clearBtn.classList.add('d-none');
    addBtn.onclick = () => addSubtask(input, list);
    input.onkeydown = function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubtask(input, list);
        }
    };
}

/**
 * Creates an image element with the given source, alt text and class name.
 * @param {String} src - The source URL for the image.
 * @param {String} alt - The alt text for the image.
 * @param {String} className - The CSS class name for the image.
 * @returns {HTMLImageElement} The created image element.
 */
function createIcon(src, alt, className) {
    const icon = document.createElement('img');
    icon.src = src;
    icon.alt = alt;
    icon.classList.add(className);
    return icon;
}

/**
 * Toggles the visibility of the edit and delete icons, and the save icon.
 * If `editMode` is true, the pencil and trash icons are hidden, and the check icon is shown.
 * If `editMode` is false, the pencil and trash icons are shown, and the check icon is hidden.
 * @param {HTMLElement} pencilIcon - The pencil edit icon element.
 * @param {HTMLElement} trashIcon - The trash delete icon element.
 * @param {HTMLElement} checkIcon - The check save icon element.
 * @param {Boolean} editMode - Whether the subtask is in edit mode or not.
 */
function toggleIcons(pencilIcon, trashIcon, checkIcon, editMode) {
    if (editMode) {
        pencilIcon.classList.add('d-none');
        trashIcon.classList.add('d-none');
        checkIcon.classList.remove('d-none');
    } else {
        pencilIcon.classList.remove('d-none');
        trashIcon.classList.remove('d-none');
        checkIcon.classList.add('d-none');
    }
}

/**
 * Puts the subtask in edit mode. Hides the pencil and trash icons, and shows the check icon.
 * Sets the subtask element's contentEditable property to true and focuses it.
 * @param {HTMLElement} subtaskElement - The subtask element to be put in edit mode.
 * @param {HTMLElement} pencilIcon - The pencil edit icon element.
 * @param {HTMLElement} trashIcon - The trash delete icon element.
 * @param {HTMLElement} checkIcon - The check save icon element.
 */
function editSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon) {
    subtaskElement.classList.add('editing');
    pencilIcon.classList.add('d-none');
    checkIcon.classList.remove('d-none');
    subtaskElement.contentEditable = 'true';
    subtaskElement.focus();
    trashIcon.classList.add('editing')
    const marker = subtaskElement.querySelector('.subtask-marker');
    if (marker) marker.style.display = "none";
}

/**
 * Exits the edit mode for a subtask.
 * Removes the 'editing' class from the subtask element and displays the pencil and trash icons while hiding the check icon.
 * Sets the subtask element's contentEditable property to false.
 * Displays the subtask marker if it exists.
 * 
 * @param {HTMLElement} subtaskElement - The subtask element to be saved.
 * @param {HTMLElement} pencilIcon - The pencil edit icon element.
 * @param {HTMLElement} trashIcon - The trash delete icon element.
 * @param {HTMLElement} checkIcon - The check save icon element.
 */
function saveSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon) {
    subtaskElement.classList.remove('editing');
    pencilIcon.classList.remove('d-none');
    checkIcon.classList.add('d-none');
    subtaskElement.contentEditable = 'false';
    trashIcon.classList.remove('editing');
    const marker = subtaskElement.querySelector('.subtask-marker');
    if (marker) marker.style.display = 'inline';
}

/**
 * Adds a new subtask to the task list.
 * Retrieves the text from the given input element, trims it and checks if it is not empty.
 * If the text is not empty, a new subtask element is created and appended to the given list.
 * The input element is cleared and the "clear" button visibility is toggled.
 * @param {HTMLElement} input - The input element containing the new subtask text.
 * @param {HTMLElement} list - The list element to which the new subtask element is appended.
 */
function addSubtask(input, list) {
    const task = input.value.trim();
    if (!task) return;
    const subtaskElement = createSubtaskElement(task);
    list.appendChild(subtaskElement);
    input.value = '';
    toggleClearButtonVisibility();
}

/**
 * Creates a subtask element with the given task text.
 * The subtask element contains three icons: edit, trash and check.
 * The edit icon puts the subtask element in edit mode.
 * The trash icon deletes the subtask element.
 * The check icon saves the subtask element.
 * @param {string} task - The text for the subtask element.
 * @returns {HTMLElement} - The created subtask element.
 */
function createSubtaskElement(task) {
    const subtaskElement = document.createElement('li');
    subtaskElement.classList.add('subtask-item');
    subtaskElement.innerHTML = createSubtaskHTML(task);
    const pencilIcon = subtaskElement.querySelector('.subtask-edit');
    const trashIcon = subtaskElement.querySelector('.subtask-trash');
    const checkIcon = subtaskElement.querySelector('.subtask-check');
    pencilIcon.onclick = () => editSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon);
    checkIcon.onclick = () => saveSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon);
    trashIcon.onclick = () => subtaskElement.remove();
    return subtaskElement;
}

/**
 * Toggles the visibility of the clear button in the "Add Subtask" input field.
 * Hides the clear button if it exists.
 */
function toggleClearButtonVisibility() {
    const clearBtn = document.getElementById('clear-subtask');
    if (clearBtn) clearBtn.classList.add('d-none');
}

/**
 * Initializes the priority buttons by adding an event listener to each.
 * When a priority button is clicked, all other priority buttons are deselected
 * and the clicked button is selected. The selected priority is stored in the
 * selectedPriority variable. The medium priority button is selected by default.
 */
function initializePriorityButtons() {
    document.querySelectorAll('.prio-btn').forEach(btn =>
        btn.onclick = () => {
            document.querySelectorAll('.prio-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPriority = btn.dataset.prio;
        }
    );
    const mediumBtn = document.querySelector('.prio-btn[data-prio="medium"]');
    if (mediumBtn) {
        mediumBtn.classList.add('active');
        selectedPriority = mediumBtn.dataset.prio;
    }
}

/**
 * Toggles the visibility of the dropdown menu.
 * Prevents event propagation and updates the dropdown's visibility and state.
 * @param {Event} event - The event that triggers the toggle action.
 * @param {HTMLElement} toggle - The element that toggles the dropdown.
 * @param {HTMLElement} options - The dropdown content element whose visibility is toggled.
 */
function toggleDropdown(event, toggle, options) {
    event.stopPropagation();
    const visible = options.classList.contains('visible');
    options.classList.toggle('visible', !visible);
    options.classList.toggle('hidden', visible);
    toggle.classList.toggle('open', !visible);
}

/**
 * Initializes the category dropdown by setting up the toggle button event listener.
 * The event listener toggles the visibility of the dropdown content and updates
 * the toggle button's state (open or closed).
 * @returns {void}
 */
function initializeCategoryDropdown() {
    const categoryToggle = document.getElementById('dropdown-toggle-category');
    const categoryContent = document.getElementById('dropdown-options-category');
    categoryToggle.onclick = (event) => {
        event.stopPropagation();
        const isVisible = categoryContent.classList.contains('visible');
        categoryContent.classList.toggle('visible', !isVisible);
        categoryContent.classList.toggle('hidden', isVisible);
        categoryToggle.classList.toggle('open', !isVisible);
    };
}

/**
 * Handles the selection of a dropdown option in the category dropdown.
 * Updates the toggle button text with the selected category, removes the error
 * class from the toggle button, and hides the dropdown content.
 * @param {Event} event - The event that triggers the option selection.
 * @param {HTMLElement} dropdown - The dropdown element containing the toggle
 * button and dropdown content.
 * @param {HTMLElement} option - The selected option element.
 * @returns {void}
 */
function selectDropdownOption(event, dropdown, option) {
    const selectedCategory = option.getAttribute('data-category');
    dropdown.querySelector('span').textContent = selectedCategory;
    document.getElementById('category-error').classList.add('hidden');
    document.getElementById('dropdown-toggle-category').classList.remove('error');
    const categoryContent = document.getElementById('dropdown-options-category');
    categoryContent.classList.remove('visible');
    categoryContent.classList.add('hidden');
    dropdown.classList.remove('open');
}

/**
 * Prevents form submission when the Enter key is pressed.
 * Attaches a keydown event listener to the form with the ID 'task-form'
 * and calls preventDefault() on the event when the Enter key is detected,
 * thus stopping the default form submission behavior.
 */
function preventFormSubmissionOnEnter() {
    const form = document.getElementById('task-form');
    form.onkeydown = function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };
}

/**
 * Retrieves the subtasks from a form element. If the form does not contain a
 * subtask list, an empty array is returned. Otherwise, the subtasks are parsed
 * from the list items and filtered to only include the ones with a text value.
 * @param {HTMLFormElement} form - The form element containing the subtask list.
 * @returns {Array<Object>} The parsed and filtered subtasks.
 */
function getSubtasksFromForm(form) {
    const subtaskList = form.querySelector('#subtask-list');
    if (!subtaskList) return [];
    return Array.from(subtaskList.querySelectorAll('li'))
        .map(parseSubtask)
        .filter(subtask => subtask.text);
}

/**
 * Parses a list item element representing a subtask and extracts its text and completion status.
 * @param {HTMLElement} li - The list item element containing the subtask information.
 * @returns {Object} An object with the subtask's text and a boolean indicating if it's completed.
 */
function parseSubtask(li) {
    const textElement = li.querySelector('.subtask-text') || li;
    return { text: textElement.textContent.trim(), completed: li.classList.contains('completed') };
}

/**
 * Creates a task object from a form by extracting its title, description, due date, priority, category, assigned contacts, subtasks, and creation date.
 * @param {HTMLFormElement} form - The form element containing the task information.
 * @returns {Object} The created task object.
 */
function createTaskObject(form) {
    const task = {
        title: form.querySelector('#task-title').value.trim(),
        description: form.querySelector('#task-desc').value.trim(),
        dueDate: form.querySelector('#task-date').value,
        priority: document.getElementById('task-priority').getAttribute('data-priority') || 'Medium',
        category: document.querySelector('#dropdown-toggle-category span').textContent,
        assignedTo: getSelectedContacts(),
        subtasks: getSubtasksFromForm(form),
        createdAt: new Date().toISOString(),
        mainCategory: 'ToDo',
    };
    return task;
}

/**
 * Creates a new DOM element with the specified tag name and class.
 * Optionally sets the element's text content, appends child elements, and assigns an ID.
 * 
 * @param {string} tagName - The type of element to be created (e.g., 'div', 'span').
 * @param {string} className - The class to be assigned to the element. If not provided, no class is added.
 * @param {string} [textContent=''] - The text content to be set for the element. Defaults to an empty string if not provided.
 * @param {Array<HTMLElement>} [children=[]] - An array of child elements to append to the created element. Defaults to an empty array.
 * @param {string} [id=''] - An ID to be assigned to the element. If not provided, no ID is added.
 * @returns {HTMLElement} The newly created DOM element with the specified properties.
 */
function createElementWithClass(tagName, className, textContent = '', children = [], id = '') {
    const element = document.createElement(tagName);
    if (className) element.classList.add(className);
    if (textContent) element.textContent = textContent;
    if (id) element.id = id;
    children.forEach(child => element.appendChild(child));
    return element;
}

/**
 * Handles the click event for the 'To Do' button on the add task page.
 * Shows a confirmation message and redirects the user to the board page after 1.5 seconds.
 * @param {Event} event The click event.
 * @returns {void}
 */
function getToDoAddTaskPage(event) {
    event.preventDefault();
    const confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.classList.add('show');
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
        window.location.href = 'board.html';
    }, 1500);
}

/**
 * Updates the submit button's disabled state based on the validity of the task title, due date, and category.
 * The button is enabled if all fields are valid, otherwise it is disabled.
 * @returns {void}
 */
function updateSubmitButtonState() {
    const title = document.getElementById("task-title").value.trim();
    const dueDate = document.getElementById("task-date").value.trim();
    const categoryText = document.querySelector('#dropdown-toggle-category span').textContent;
    const submitButton = document.getElementById("submit-task-btn");
    const isValid = title !== "" && dueDate !== "" && categoryText !== "Select task category";
    submitButton.disabled = !isValid;
}