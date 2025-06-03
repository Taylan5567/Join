const REGISTRATIONCOMPLETE_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/";
const REGISTRATION_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/registrations";

/**
 * Sends registration data to the specified path in the Firebase database.
 * Uses the POST method to store the data.
 * Throws an error if the request fails or the response is not OK.
 * 
 * @param {string} path - The path to which the registration data will be sent. Defaults to "/registrations".
 * @param {Object} data - The registration data to be sent.
 * @throws {Error} If the request fails, or the response is not OK.
 * @returns {Promise<void>} - A promise that resolves when the registration data has been successfully sent.
 */
async function updateRegistration(path = "/registrations", data) {
    let response = await fetch(REGISTRATIONCOMPLETE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Speichern der Registrierung: ${response.statusText}`);
    }
}

/**
 * Retrieves the registration data from the registration form and returns it as an object.
 * @param {HTMLFormElement} regiForm - The registration form from which to retrieve the data.
 * @returns {{name: string, email: string, password: string}} - An object with the registration data.
 */
function createRegistration(regiForm) {
    let data = {
        name: regiForm.querySelector('#name').value.trim(),
        email: regiForm.querySelector('#email').value.trim(),
        password: regiForm.querySelector('#password').value.trim(),
    };
    return data;
}

/**
 * Saves the registration data from the registration form to the Firebase database.
 * Retrieves the registration data from the registration form, and sends it to the Firebase database using the POST method.
 * Calls the userSuccessRegistration function when the registration data has been successfully sent.
 * Logs an error if the request fails or the response is not OK.
 * @throws {Error} If the request fails, or the response is not OK.
 * @returns {Promise<void>} - A promise that resolves when the registration data has been successfully sent.
 */
async function saveRegistration() {
    let regiForm = document.querySelector('.loginForm');
    let data = createRegistration(regiForm);
    updateRegistration("/registrations", data).then(() => {
        userSuccessRegistration();
    }).catch((error) => {
        console.error("Fehler beim Speichern der Registrierung:", error);
    });
}

/**
 * Retrieves the registration data from the Firebase database.
 * Makes a GET request to the REGISTRATION_URL, and returns the response as a JSON object.
 * @returns {Promise<Object>} - A promise that resolves with the registration data.
 */
async function loadRegistration() {
    return fetch(REGISTRATION_URL + ".json").then((userId) => userId.json());
}

/**
 * Checks if a name is already taken.
 * Makes a GET request to the REGISTRATION_URL, and checks if the response contains the given name.
 * @param {string} name - The name to check.
 * @returns {Promise<boolean>} - A promise that resolves with true if the name is taken, or false otherwise.
 */
async function isNameTaken(name) {
    let usersId = loadRegistration();
    if (usersId === name) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks if the given email is already taken in the registration database.
 * Makes a GET request to the REGISTRATION_URL and verifies if the 
 * response contains the provided email.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise resolving to true if the email is taken, or false otherwise.
 */
async function isEmailTaken(email) {
    let usersId = loadRegistration();
    if (usersId === email) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks if the name and email are already taken in the registration database.
 * If the name or email is taken, shows an error message and returns.
 * Otherwise, saves the registration data in the database.
 * @returns {void} - The function does not return a value.
 */
async function mainCheckTaken() {
    let regiForm = document.querySelector('.loginForm');
    let data = createRegistration(regiForm);
    let nameIsTaken = await isNameTaken(data.name);
    let emailIsTaken = await isEmailTaken(data.email);
    if (nameIsTaken) {
        showError('Diese Benutzername ist bereits vergeben.');
        return;
    }
    if (emailIsTaken) {
        showError('Diese E-Mail ist bereits vergeben.');
        return;
    }
    saveRegistration();
}