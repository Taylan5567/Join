/**
 * Resets a form and notifies the user by displaying a confirmation message.
 * @param {HTMLFormElement} form - The form element to reset.
 * @returns {void}
 */
function resetFormAndNotify(form) {
    form.reset();
}

/**
 * Resets all form fields to their default values.
 * This includes the task title, description, due date, priority, category, subtasks, assigned contacts, and the dropdown.
 * @returns {void}
 */
function clearForm() {
    resetField('task-title');
    resetField('task-desc');
    resetField('task-date');
    resetPriority();
    resetCategory();
    resetSubtasks();
    resetContacts();
    resetDropdown();
}

/**
 * Resets a form field with the specified ID to its default value (i.e., an empty string).
 * @param {string} id - The ID of the form field to reset.
 * @returns {void}
 */
function resetField(id) {
    const field = document.getElementById(id);
    if (field) field.value = '';
}

/**
 * Resets the task priority buttons to their default values.
 * This means that the 'medium' button is activated and the active class is removed from all other buttons.
 * @returns {void}
 */
function resetPriority() {
    document.querySelectorAll('.prio-btn').forEach(btn => btn.classList.remove('active'));
    const mediumBtn = document.querySelector('.prio-btn[data-prio="medium"]');
    if (mediumBtn) {
        mediumBtn.classList.add('active');
        selectedPriority = mediumBtn.dataset.prio;
    }
}

/**
 * Resets the category selection to its initial state, i.e., 'Select task category'.
 * @returns {void}
 */
function resetCategory() {
    const categoryText = document.querySelector('#dropdown-toggle-category span');
    if (categoryText) categoryText.textContent = 'Select task category';
}

/**
 * Resets the subtask list to its initial state, i.e., an empty list.
 * @returns {void}
 */
function resetSubtasks() {
    const subtaskList = document.getElementById('subtask-list');
    if (subtaskList) subtaskList.innerHTML = '';
}

/**
 * Resets the list of selected contacts in the task edit overlay to its initial state, i.e., an empty list.
 * @returns {void}
 */
function resetContacts() {
    const selectedContactsContainer = document.getElementById('selected-contacts');
    if (selectedContactsContainer) selectedContactsContainer.innerHTML = '';
}

/**
 * Resets the contacts dropdown to its initial state, i.e., a button with the
 * text 'Select contacts to assign' and a hidden dropdown content element.
 * @returns {void}
 */
function resetDropdown() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    if (dropdownToggle) {
        const span = dropdownToggle.querySelector('span');
        if (span) span.textContent = 'Select contacts to assign';
    }
    const dropdownContent = document.getElementById('dropdown-content');
    if (dropdownContent) dropdownContent.style.display = 'none';
}

/**
 * Initializes the 'Clear' button by adding an event listener to it that prevents
 * form submission and calls the clearForm() function when clicked.
 * @returns {void}
 */
function initializeClearButton() {
    const clearButton = document.querySelector('.add_task_clear_btn');
    clearButton.onclick = (event) => {
        event.preventDefault();
        clearForm();
    };
}