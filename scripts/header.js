/**
 * Initializes the header by setting up the user button with the user's initials.
 */
function initHeader() {
    initializeUserButton();
}

/**
 * Initializes the user button by setting up the user's initials.
 * @async
 */
async function initializeUserButton() {
    const userInitialsButton = document.getElementById('user-initials-button');
    await setUserInitials(userInitialsButton);
}

/**
 * Sets the user's initials in the given button element.
 * @param {HTMLElement} button the button element to set the initials in
 * @returns {Promise<void>}
 */
async function setUserInitials(button) {
    const userName = await getCurrentUserName();
    const initials = (typeof userName === 'string' && userName.toLowerCase() === "guest")
        ? "G"
        : getInitials(userName || "Guest");
    button.textContent = initials;
}

/**
 * Retrieves the user name of the currently logged-in user from the database.
 * @returns {Promise<string>} the user name of the currently logged-in user, or "Guest" if the user is not logged in or the retrieval fails.
 */
async function getCurrentUserName() {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail || loggedInEmail === 'guest@example.com') {
        return "Guest";
    }
    try {
        const response = await fetch(`${BASE_URL}registrations.json`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Benutzerdaten');
        const users = await response.json();
        if (users) {
            const user = Object.values(users).find(user => user.email === loggedInEmail);
            return user ? user.name : "Guest";
        }
    } catch (error) { }
    return "Guest";
}

/**
 * Generates initials from a name by taking the first letter of the first and last name.
 * @param {string} name - The name from which to extract the initials.
 * @returns {string} The initials of the given name.
 */
function getInitials(name) {
    if (!name || typeof name !== 'string') return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Toggles the visibility of the user popup.
 * Stops the event from propagating to parent elements and toggles
 * the 'd-none' class on the user popup element to show or hide it.
 * @param {Event} event - The event object associated with the toggle action.
 */
function toggleUserPopup(event) {
    const userPopup = document.getElementById('user-popup');
    event.stopPropagation();
    userPopup.classList.toggle('d-none');
}

/**
 * Closes the user popup if it is currently open and the event target is not the user popup or its toggle button.
 * @param {Event} event - The event object associated with the close action.
 */
function closePopup(event) {
    const userPopup = document.getElementById('user-popup');
    const userInitialsButton = document.getElementById('user-initials-button');
    const target = event.target;
    if (!userPopup.contains(target) && !userInitialsButton.contains(target)) {
        userPopup.classList.add('d-none');
    }
}
document.addEventListener('DOMContentLoaded', initHeader);