document.addEventListener('DOMContentLoaded', () => {
    handleGreetingOverlay();
    setGreetingMessage();
    fetchTasks();
});

const REGISTRATION_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Sets the greeting message and user name in both the main page and overlay elements.
 * Retrieves the appropriate greeting based on the current time and the user's name.
 * Updates the DOM elements with the greeting and user name, if found.
 * Logs an error if the required DOM elements are not present.
 * Asynchronous function that waits for user name retrieval.
 */
async function setGreetingMessage() {
    const greetingMessageDiv = document.getElementById('greeting-message');
    const userNameGreetingDiv = document.getElementById('user-name-greeting');
    const greetingMessageOverlay = document.getElementById('greeting-message-overlay');
    const userNameGreetingOverlay = document.getElementById('user-name-greeting-overlay');
    if (!greetingMessageDiv || !userNameGreetingDiv || !greetingMessageOverlay || !userNameGreetingOverlay) {
        console.error('Greeting elements not found in the DOM');
        return;
    }
    const greeting = getGreetingBasedOnTime();
    const userName = await getUserName();
    setGreetingForElements(greeting, userName, greetingMessageDiv, userNameGreetingDiv);
    setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay);
}

/**
 * Retrieves a greeting based on the current time.
 * Returns 'Good Morning' between 5am and 12pm, 'Good Afternoon' between 12pm and 6pm, and 'Good Evening' otherwise.
 * @returns {string} The greeting based on the current time.
 */
function getGreetingBasedOnTime() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return 'Good Morning';
    if (currentHour >= 12 && currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
}

/**
 * Sets the greeting message and user name in the main page elements.
 * If a user name is found, appends a comma to the greeting message and sets the user name element's text content.
 * If the user name is 'guest', sets the greeting message without a comma and clears the user name element's text content.
 * @param {string} greeting - The greeting message based on the current time.
 * @param {string} userName - The user name retrieved from the database, or 'guest' if not found.
 * @param {HTMLElement} greetingMessageDiv - The element where the greeting message is displayed.
 * @param {HTMLElement} userNameGreetingDiv - The element where the user name is displayed.
 */
async function setGreetingForElements(greeting, userName, greetingMessageDiv, userNameGreetingDiv) {
    if (userName && userName.toLowerCase() !== 'guest') {
        greetingMessageDiv.textContent = `${greeting},`;
        userNameGreetingDiv.textContent = `${userName}`;
    } else {
        greetingMessageDiv.textContent = greeting;
        userNameGreetingDiv.textContent = '';
    }
}

/**
 * Sets the greeting message and user name in the overlay elements.
 * If a user name is found, appends a comma to the greeting message and sets the user name element's text content.
 * If the user name is 'guest', sets the greeting message without a comma and clears the user name element's text content.
 * @param {string} greeting - The greeting message based on the current time.
 * @param {string} userName - The user name retrieved from the database, or 'guest' if not found.
 * @param {HTMLElement} greetingMessageOverlay - The element where the greeting message is displayed in the overlay.
 * @param {HTMLElement} userNameGreetingOverlay - The element where the user name is displayed in the overlay.
 */
function setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay) {
    if (userName && userName.toLowerCase() !== 'guest') {
        greetingMessageOverlay.textContent = `${greeting},`;
        userNameGreetingOverlay.textContent = `${userName}`;
    } else {
        greetingMessageOverlay.textContent = greeting;
        userNameGreetingOverlay.textContent = '';
    }
}

/**
 * Handles displaying the greeting overlay based on the URL parameter 'showGreeting' and the window width.
 * If the window width is less than or equal to 900px and 'showGreeting' is true, the greeting overlay is shown for 3 seconds.
 * The greeting message and user name are retrieved from the DOM and set in the overlay elements.
 * @returns {void} - The function does not return a value.
 */
function handleGreetingOverlay() {
    const showGreeting = new URLSearchParams(window.location.search).get('showGreeting');
    const overlay = document.getElementById('overlay_greeting');
    const greetingMessageOverlay = document.getElementById('greeting-message-overlay');
    const userNameGreetingOverlay = document.getElementById('user-name-greeting-overlay');
    if (window.innerWidth <= 900 && shouldShowGreeting(showGreeting)) {
        const greeting = getGreetingFromDOM();
        const userName = getUserNameFromDOM();
        setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay);
        showOverlay(overlay);
        hideOverlayAfterTimeout(overlay);
    }
}

/**
 * Checks if the greeting should be shown based on the 'showGreeting' URL parameter and localStorage.
 * The greeting is shown if 'showGreeting' is 'true' and 'greetingShown' is not set in localStorage.
 * @param {string} showGreeting - The value of the 'showGreeting' URL parameter.
 * @returns {boolean} - True if the greeting should be shown, false otherwise.
 */
function shouldShowGreeting(showGreeting) {
    return showGreeting === 'true' && !localStorage.getItem('greetingShown');
}

/**
 * Retrieves the greeting message from the DOM.
 * Assumes there is an element with the ID 'greeting-message' 
 * and returns its text content.
 * @returns {string} The greeting message from the DOM.
 */
function getGreetingFromDOM() {
    return document.getElementById('greeting-message').textContent;
}

/**
 * Retrieves the user name from the DOM.
 * Assumes there is an element with the ID 'user-name-greeting' 
 * and returns its text content.
 * @returns {string} The user name from the DOM.
 */
function getUserNameFromDOM() {
    return document.getElementById('user-name-greeting').textContent;
}

/**
 * Sets the greeting message and user name in the overlay elements.
 * Sets the text content of the provided overlay elements with the greeting and user name.
 * @param {string} greeting - The greeting message based on the current time.
 * @param {string} userName - The user name retrieved from the database, or 'guest' if not found.
 * @param {HTMLElement} greetingMessageOverlay - The element where the greeting message is displayed in the overlay.
 * @param {HTMLElement} userNameGreetingOverlay - The element where the user name is displayed in the overlay.
 */
function setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay) {
    greetingMessageOverlay.textContent = greeting;
    userNameGreetingOverlay.textContent = userName;
}

/**
 * Shows the given overlay element by setting its display property to 'flex' and adding the 'visible' class after a 1ms delay.
 * @param {HTMLElement} overlay - The overlay element to show.
 * @returns {void} - The function does not return a value.
 */
function showOverlay(overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('visible');
    }, 1);
}

/**
 * Hides the given overlay element after a 1500ms delay and removes the 'visible' class.
 * Sets the display property of the overlay element to 'none' after a 300ms delay.
 * Additionally, sets the 'greetingShown' key of the local storage to 'true'.
 * @param {HTMLElement} overlay - The overlay element to hide.
 * @returns {void} - The function does not return a value.
 */
function hideOverlayAfterTimeout(overlay) {
    setTimeout(() => {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.style.display = 'none';
            localStorage.setItem('greetingShown', 'true');
        }, 300);
    }, 1500);
}
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay_greeting');
    if (!localStorage.getItem('greetingShown')) {
        showOverlay(overlay);
        hideOverlayAfterTimeout(overlay);
    }
});

/**
 * Retrieves the user name of the currently logged-in user from the database.
 * @returns {Promise<string>} the user name of the currently logged-in user, or an empty string if the user is not logged in or the retrieval fails.
 */
async function getUserName() {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail) return '';
    try {
        const response = await fetch(`${BASE_URL}registrations.json`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Benutzerdaten');
        const users = await response.json();
        const user = Object.values(users).find(user => user.email === loggedInEmail);
        return user ? user.name : '';
    } catch (error) {
        return '';
    }
}

/**
 * Retrieves all tasks from the database and updates the summary HTML.
 * @returns {void} - The function does not return a value.
 */
async function fetchTasks() {
    try {
        const response = await fetch(`${BASE_URL}tasks.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        const counts = countMainCategories(data);
        const urgentData = countUrgentTasks(data);
        updateSummaryHTML(counts, urgentData);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

/**
 * Counts the number of urgent tasks and retrieves their next due date.
 * Filters the urgent tasks from the provided data and sorts them by due date.
 * If there are urgent tasks, determines the next due date and counts the tasks with that due date.
 * @param {Object} data - The data containing task information.
 * @returns {Object} - An object containing the count of urgent tasks and their next due date.
 *                      If no urgent tasks are found, returns an object with count 0 and dueDate 'N/A'.
 */
function countUrgentTasks(data) {
    const urgentTasks = filterUrgentTasks(data);
    sortUrgentTasks(urgentTasks);
    if (urgentTasks.length > 0) {
        const nextDueDate = urgentTasks[0].dueDate;
        const tasksWithNextDueDate = getTasksWithNextDueDate(urgentTasks, nextDueDate);
        return getTaskCountAndDueDate(tasksWithNextDueDate, nextDueDate);
    }
    return {
        count: 0,
        dueDate: 'N/A',
    };
}

/**
 * Filters tasks from the provided data that have 'urgent' priority and a valid dueDate.
 * @param {Object} data - The data containing task information.
 * @returns {Object[]} - An array of objects containing the dueDate and task properties.
 *                       The dueDate property is a Date object representing the due date of the task.
 *                       The task property is the task object from the data.
 */
function filterUrgentTasks(data) {
    const urgentTasks = [];
    for (const key in data) {
        const task = data[key];
        if (task.priority && task.priority.toLowerCase() === 'urgent' && task.dueDate) {
            urgentTasks.push({
                dueDate: new Date(task.dueDate),
                task,
            });
        }
    }
    return urgentTasks;
}

/**
 * Sorts an array of urgent tasks by their due date in ascending order.
 * @param {Object[]} urgentTasks - An array of objects where each object contains a 'dueDate' property.
 *                                 The 'dueDate' property should be a Date object.
 * @returns {void} - The function does not return a value. It sorts the input array in place.
 */
function sortUrgentTasks(urgentTasks) {
    urgentTasks.sort((a, b) => a.dueDate - b.dueDate);
}

/**
 * Filters an array of urgent tasks by their due date and returns an array of tasks that have the same due date as the provided 'nextDueDate'.
 * @param {Object[]} urgentTasks - An array of objects where each object contains a 'dueDate' property.
 *                                 The 'dueDate' property should be a Date object.
 * @param {Date} nextDueDate - The due date to filter the tasks by.
 * @returns {Object[]} - An array of tasks that have the same due date as the provided 'nextDueDate'.
 */
function getTasksWithNextDueDate(urgentTasks, nextDueDate) {
    return urgentTasks.filter(
        (item) => item.dueDate.getTime() === nextDueDate.getTime()
    );
}

/**
 * Returns an object with the count of tasks that have the same due date as the provided 'nextDueDate'
 * and the due date itself as a string in ISO format without the time part.
 * @param {Object[]} tasksWithNextDueDate - An array of objects where each object contains a 'dueDate' property.
 *                                         The 'dueDate' property should be a Date object.
 * @param {Date} nextDueDate - The due date to count the tasks by.
 * @returns {Object} - An object with a 'count' and a 'dueDate' property.
 */
function getTaskCountAndDueDate(tasksWithNextDueDate, nextDueDate) {
    return {
        count: tasksWithNextDueDate.length,
        dueDate: nextDueDate.toISOString().split('T')[0],
    };
}

/**
 * Counts the tasks in each main category and returns an object with the counts.
 * @param {Object} data - An object where each key is a task ID and each value is an object that contains a 'mainCategory' property.
 *                        The 'mainCategory' property can be one of the following: 'ToDo', 'InProgress', 'AwaitFeedback', 'Done'.
 * @returns {Object} - An object with a 'ToDo', 'InProgress', 'AwaitFeedback', and 'Done' property.
 *                    Each property value is the count of tasks in the respective main category.
 */
function countMainCategories(data) {
    const counts = {
        ToDo: 0,
        InProgress: 0,
        AwaitFeedback: 0,
        Done: 0,
    };
    for (const key in data) {
        const task = data[key];
        if (counts.hasOwnProperty(task.mainCategory)) {
            counts[task.mainCategory]++;
        }
    }
    return counts;
}

/**
 * Updates the HTML elements in the summary page with the task counts and the urgent task's due date.
 * @param {Object} counts - An object with the count of tasks in each main category. The properties of the object
 *                          are 'ToDo', 'InProgress', 'AwaitFeedback', and 'Done'.
 * @param {Object} urgentData - An object with the count of urgent tasks and the due date of the urgent task as a string.
 */
function updateSummaryHTML(counts, urgentData) {
    document.getElementById('to_do_show').textContent = counts.ToDo || 0;
    document.getElementById('tasks-in-progress').textContent = counts.InProgress || 0;
    document.getElementById('tasks-in-awaiting').textContent = counts.AwaitFeedback || 0;
    document.getElementById('done_show').textContent = counts.Done || 0;
    document.getElementById('tasks-in-board').textContent =
        counts.ToDo + counts.InProgress + counts.AwaitFeedback + counts.Done;
    document.getElementById('urgent_num_show').textContent = urgentData.count;
    document.getElementById('date-of-due').textContent = urgentData.dueDate;
}