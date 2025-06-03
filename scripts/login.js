/**
 * Initializes the login page by animating the logo
 */
function loginInit() {
    animateLogo();
}

/**
 * Animates the logo depending on the screen size.
 * If the screen is at least 900px wide, it calls animateLargeLogo, otherwise it calls animateSmallLogo.
 */
function animateLogo() {
    let isLargeScreen = window.matchMedia("(min-width: 900px)").matches;
    isLargeScreen ? animateLargeLogo() : animateSmallLogo();
}

/**
 * Animates the logo for large screens (at least 900px wide).
 * The animation consists of the following steps:
 * 1. The logo's opacity is set to 1, making it visible.
 * 2. After 150ms, the logo is moved to the position (10%, 25%) on the page.
 * 3. After 1400ms, the logo's opacity is set back to 0, making it invisible.
 * 4. After 1800ms, the login page is toggled (i.e., the login form is shown).
 */
function animateLargeLogo() {
    let logo = document.getElementById('logo');
    logo.style.opacity = '1';
    setTimeout(() => moveLogo(logo, '10%', '25%'), 150);
    setTimeout(() => logo.style.opacity = '0', 1400);
    setTimeout(toggleLoginPage, 1800);
}

/**
 * Animates the logo for small screens (less than 900px wide).
 * The animation consists of the following steps:
 * 1. The background color of the body is set to a dark blue.
 * 2. The logo is moved to the top left corner of the page with a scale of 0.5.
 * 3. After 150ms, the logo's source image is changed to the Join logo.
 * 4. After 200ms, the background color of the body is set back to transparent.
 * 5. After 800ms, the logo's opacity is set to 0, making it invisible.
 * 6. After 1000ms, the login page is toggled (i.e., the login form is shown).
 */
function animateSmallLogo() {
    let logoSmall = document.getElementById('logoSmall');
    let logoImg = logoSmall.querySelector('img');
    document.body.style.backgroundColor = 'rgb(42,54,71)';
    logoSmall.style.opacity = '1';
    setTimeout(() => moveLogo(logoSmall, '0%', '10%', 0.5), 2000);
    setTimeout(() => logoImg.src = '../assets/svg/logo.svg', 2150);
    setTimeout(() => document.body.style.backgroundColor = "transparent", 2200);
    setTimeout(() => logoSmall.style.opacity = '0', 3000);
    setTimeout(toggleLoginPage, 3200);
}

/**
 * Moves the given logo element to the specified position on the page and sets its scale.
 * @param {HTMLElement} logo the logo element to move
 * @param {string} top the value for the top CSS attribute
 * @param {string} left the value for the left CSS attribute
 * @param {number} [scale=1] the value for the scale CSS attribute
 */
function moveLogo(logo, top, left, scale = 1) {
    logo.style.top = top;
    logo.style.left = left;
    logo.style.transform = `translate(0, 0) scale(${scale})`;
}

/**
 * Toggles the login page by switching the display of the logo and the login form.
 * When called, the logo is hidden and the login form is shown.
 * @return {void} - The function does not return a value.
 */
function toggleLoginPage() {
    let OverlayloginPage = document.getElementById('loginPage');
    let OverlayLogo = document.getElementById('logo');
    OverlayloginPage.innerHTML = loginTemplate();
    OverlayLogo.style.display = 'none';
    OverlayloginPage.style.display = 'block';
}

const LOGIN_URL = 'https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/registrations';

/**
 * Handles the user login process by validating the login form inputs
 * and credentials. If validation is successful, stores the email in
 * local storage and redirects the user to the summary page with a greeting.
 * If validation fails, displays an error message.
 * @returns {Promise<void>} - The function does not return a value.
 */
async function login() {
    let { email, password } = loginForm();
    if (!loginFormValidation(email, password)) return;
    if (!(await validateCredentials(email, password))) {
        return showError("Passwort oder Email falsch!");
    }
    localStorage.setItem('loggedInEmail', email);
    window.location.href = 'summary.html?showGreeting=true';
}

/**
 * Validates the email and password by checking if the email is in the
 * database and if the password matches the one stored in the database.
 * @param {string} email - The email to validate.
 * @param {string} password - The password to validate.
 * @returns {Promise<boolean>} - A promise resolving to true if the
 * credentials are valid, or false if they are not.
 */
async function validateCredentials(email, password) {
    let emailIsValid = await emailValid(email);
    let passwordIsValid = await passwordValid(password, email);
    return emailIsValid && passwordIsValid;
}

/**
 * Retrieves the email and password from the login form and returns them as an object.
 * @returns {{email: string, password: string}} - An object with the email and password properties.
 */
function loginForm() {
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    return { email, password };
}

/**
 * Logs in as a guest user. Stores the email address 'guest@example.com' in
 * local storage and redirects the user to the summary page with a greeting.
 * @returns {void} - The function does not return a value.
 */
function guestLogin() {
    localStorage.setItem('loggedInEmail', 'guest@example.com');
    window.location.href = 'summary.html?showGreeting=true';
}

/**
 * Checks if the given email exists in the login database.
 * Retrieves user data from the database and verifies if the 
 * provided email is already registered.
 * @param {string} email - The email address to validate.
 * @returns {Promise<boolean>} - A promise resolving to true if the email exists, or false otherwise.
 */
async function emailValid(email) {
    let usersId = await loadLoginDb();
    usrValidation = Object.values(usersId || {}).some(userObj => userObj.email === email);
    if (usrValidation) {
        return true;
    } else {
        return false;
    }
}

/**
 * Validates if the provided password matches any password
 * stored in the login database for the given email.
 * Retrieves user data from the database and checks if the
 * password corresponds to any user.
 * @param {string} password - The password to validate.
 * @param {string} email - The email associated with the password.
 * @returns {Promise<boolean>} - A promise resolving to true if 
 * the password is valid, or false if it is not.
 */
async function passwordValid(password, email) {
    let usersId = await loadLoginDb();
    for (let userId in usersId) {
        let user = usersId[userId];
        if (user.password === password) {
            return true;
        }
    }
    return false;
}

/**
 * Loads the login database from the API.
 * Retrieves user data from the database and returns it as a JSON object.
 * @returns {Promise<{}>} - A promise resolving to the user data as a JSON object.
 */
async function loadLoginDb() {
    return fetch(LOGIN_URL + ".json").then((userId) => userId.json());
}

/**
 * Checks if the email and password fields have been filled out correctly.
 * If either field is empty, displays an error message and highlights the
 * fields in red, then resets them to the default color after 2 seconds.
 * @param {string} email - The email address entered by the user.
 * @param {string} password - The password entered by the user.
 * @returns {boolean} - True if the fields are valid, false otherwise.
 */
function loginFormValidation(email, password) {
    if (!email || !password) {
        showError('Bitte geben Sie Ihre E-Mail und Ihr Passwort ein.');
        document.getElementById("email").style.borderColor = "red";
        document.getElementById("password").style.borderColor = "red";
        setTimeout(function () {
            document.getElementById("email").style.borderColor = "rgba(204, 204, 204, 1)";
            document.getElementById("password").style.borderColor = "rgba(204, 204, 204, 1)";
        }, 2000);
        return false;
    }
    return true;
}

/**
 * Logs the user out by removing the "loggedInEmail" and "greetingShown" items
 * from local storage, then redirects to the login page.
 * @param {Event} event - The event object of the logout button click.
 */
function logout(event) {
    event.preventDefault();
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('greetingShown');
    window.location.href = 'login.html';
}

/**
 * Displays an error message in the login page.
 * Retrieves the error message element and displays the message, then
 * sets a timeout to hide the message after 2 seconds.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    let errorMessage = document.getElementById('loginError');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 2000);
}