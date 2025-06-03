/**
 * Sets up the date validation for the task add page.
 * Retrieves the current date and maximum valid date, applies the validation to the date input,
 * and observes the DOM for changes to apply the validation to dynamically added date inputs.
 */
function setDateValidation() {
    const today = getCurrentDate();
    const maxDateString = getMaxDateString();
    applyValidation(today, maxDateString);
    observeDomChanges(today, maxDateString);
}

/**
 * Calculates the maximum date string allowed for a task.
 * The maximum date is set to 100 years from the current date.
 * @returns {String} The maximum date in the ISO format (YYYY-MM-DD).
 */
function getMaxDateString() {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 100);
    return maxDate.toISOString().split('T')[0];
}

/**
 * Applies date validation to all date input elements with the class 'task-date'.
 * Sets the minimum and maximum attributes for each date input and updates the input color.
 * @param {String} today - The current date in ISO format (YYYY-MM-DD).
 * @param {String} maxDateString - The maximum date in ISO format (YYYY-MM-DD).
 */
function applyValidation(today, maxDateString) {
    const dateInputs = document.querySelectorAll('.task-date');
    dateInputs.forEach(dateInput => {
        setDateAttributes(dateInput, today, maxDateString);
        handleInputColorChange(dateInput);
    });
}

/**
 * Handles the submission of the add task form.
 * Checks if the task title, due date, and category are valid and disables/enables the submit button accordingly.
 * If all fields are valid, calls the submitAddTask function to add the task to Firebase.
 * @param {Event} event The form submission event.
 * @returns {void}
 */
function validateTaskForm(event) {
    event.preventDefault();
    const title = document.getElementById("task-title"),
        dueDate = document.getElementById("task-date"),
        submitButton = document.getElementById("submit-task-btn"),
        categoryText = document.querySelector('#dropdown-toggle-category span').textContent;
    let isValid = validateField(title, "Title is required") &&
        validateField(dueDate, "Due Date is required") &&
        validateCategory(categoryText);
    submitButton.disabled = !isValid;
    if (isValid) submitAddTask(event);
}

/**
 * Validates that the specified input field is not empty.
 * If the field is empty, sets an error message and returns false.
 * Otherwise, clears any existing error message and returns true.
 * @param {HTMLElement} field - The input field to validate.
 * @param {string} message - The error message to display if validation fails.
 * @returns {boolean} - Returns true if the field is valid, otherwise false.
 */
function validateField(field, message) {
    if (field.value.trim() === "") return setErrorMessage(field, message), false;
    clearErrorMessage(field);
    return true;
}

/**
 * Validates that the selected category is not the default option.
 * Hides/shows the error message based on the validation result.
 * @param {string} category The selected category.
 * @returns {boolean} True if the category is valid, false otherwise.
 */
function validateCategory(category) {
    const errorEl = document.getElementById('category-error');
    errorEl.classList.toggle('hidden', category !== 'Select task category');
    return category !== 'Select task category';
}

/**
 * Sets an error message for the given element.
 * If no error message exists, creates one.
 * Sets the error message's text content to the given message.
 * After 10 seconds, clears the error message and removes the input-error class from the element.
 * @param {HTMLElement} element - The element for which to set the error message.
 * @param {string} message - The error message to display.
 * @returns {void}
 */
function setErrorMessage(element, message) {
    let error = element.parentElement.querySelector(".error-message");
    if (!error) {
        error = document.createElement("span");
        error.className = "error-message";
        element.parentElement.appendChild(error);
    }
    error.textContent = message;
    setTimeout(() => {
        clearErrorMessage(element);
        element.classList.remove("input-error");
    }, 10000);
}

/**
 * Removes the error message associated with the given element.
 * If an error message exists, it is removed from the DOM.
 * 
 * @param {HTMLElement} element - The element whose associated error message should be cleared.
 * @returns {void}
 */
function clearErrorMessage(element) {
    let error = element.parentElement.querySelector(".error-message");
    if (error) {
        error.remove();
    }
}

/**
 * Clears any existing error messages for the task title and due date input fields if they are valid.
 * If the input fields have valid values, removes the input-error class and associated error messages.
 * @returns {void}
 */
function clearErrorsOnValidInput() {
    const title = document.getElementById("task-title"),
        dueDate = document.getElementById("task-date");
    if (title.value.trim() !== "") {
        title.classList.remove("input-error");
        clearErrorMessage(title);
    }
    if (dueDate.value.trim() !== "") {
        dueDate.classList.remove("input-error");
        clearErrorMessage(dueDate);
    }
}