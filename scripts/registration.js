/**
 * Initializes the registration page by displaying the registration page overlay
 * and enabling or disabling the "Sign up" button based on the checkbox state.
 */
function reginit() {
    toggleSignUpPage();
    toggleSignUpButton();
}

/**
 * Displays the registration page overlay.
 * @return {void} - The function does not return a value.
 */
function toggleSignUpPage() {
    let overlayRef = document.getElementById("registrationPage");
    overlayRef.innerHTML = registrationTemplate();
    overlayRef.style.display = "block";
}

/**
 * Toggles the "Sign up" button's enabled state and styling based on the input fields' values
 * and the checkbox state. If all input fields are filled and the checkbox is checked, the 
 * button is enabled with active styling. Otherwise, it is disabled and styled accordingly.
 */
function toggleSignUpButton() {
    let signUpButton = document.querySelector('.signUpButton');
    let checkbox = document.getElementById('checkbox');
    let [name, email, password, confirmPassword] = ['name', 'email', 'password', 'confirmPassword'].map(id => document.getElementById(id).value);

    if (name && email && password && confirmPassword && checkbox.checked) {
        signUpButton.disabled = false;
        signUpButton.style.cssText = 'cursor: pointer; background: #2A3647; color: white;';
    } else {
        signUpButton.disabled = true;
        signUpButton.style.cssText = 'cursor: not-allowed; background: #808080;';
    }
}

/**
 * Handles the sign up form submission.
 * @param {Event} event - The form submission event.
 */
function signUp(event) {
    event.preventDefault();
    let [name, email, password, confirmPassword] = ['name', 'email', 'password', 'confirmPassword'].map(id => document.getElementById(id).value.trim());
    let checkbox = document.getElementById("checkbox");
    if (![nameValid(name), EmailValid(email), PasswordsMatching(password, confirmPassword), PasswordValid(password)].every(Boolean)) return;
    mainCheckTaken();
    userSuccessRegistration();
}

/**
 * Checks if the given name is valid.
 * A name is considered valid if it only contains letters and whitespace.
 * @param {string} name - The name to validate.
 * @returns {boolean} - True if the name is valid, false otherwise.
 */
function nameValid(name) {
    if (!/^[a-zA-Z\s]+$/g.test(name)) {
        showError('Please enter a valid name.');
        return false;
    }
    return true;
}

/**
 * Checks if the given email is valid.
 * An email is considered valid if it matches the given regular expression.
 * @param {string} email - The email to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
function EmailValid(email) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email)) {
        let emailInput = document.getElementById("email");
        if (emailInput) {
            emailInput.style.borderColor = "red";
            setTimeout(() => {
                emailInput.style.borderColor = "rgba(204, 204, 204, 1)";
            }, 2000);
        }
        showError('Bitte geben Sie eine gültige E-Mail ein.');
        return false;
    }
    return true;
}

/**
 * Checks if the given password and confirm password match.
 * If they don't match, sets the border color of the password and confirm password input fields to red and shows an error message.
 * After 2 seconds, resets the border color of the input fields back to default.
 * @param {string} password - The password to compare.
 * @param {string} confirmPassword - The confirm password to compare.
 * @returns {boolean} - True if the passwords match, false otherwise.
 */
function PasswordsMatching(password, confirmPassword) {
    if (password !== confirmPassword) {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("confirmPassword").style.borderColor = "red";
        setTimeout(function () {
            document.getElementById("password").style.borderColor = "rgba(204, 204, 204, 1)";
            document.getElementById("confirmPassword").style.borderColor = "rgba(204, 204, 204, 1)";
        }, 2000);
        showError('Passwörter stimmen nicht überein.');
        return false;
    }
    return true;
}

/**
 * Checks if the given password is valid.
 * A password is considered valid if it is at least 8 characters long.
 * If the password is invalid, sets the border color of the password and confirm password input fields to red and shows an error message.
 * After 2 seconds, resets the border color of the input fields back to default.
 * @param {string} password - The password to validate.
 * @returns {boolean} - True if the password is valid, false otherwise.
 */
function PasswordValid(password) {
    // (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password))
    if (password.length < 8) {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("confirmPassword").style.borderColor = "red";
        setTimeout(function () {
            document.getElementById("password").style.borderColor = "rgba(204, 204, 204, 1)";
            document.getElementById("confirmPassword").style.borderColor = "rgba(204, 204, 204, 1)";
        }, 2000);
        // showErrorPassword('Passwort: mind. 8 Zeichen, Groß-/Kleinbuchstabe, Zahl.');
        showErrorPassword('Passwort: mind. 8 Zeichen.');
        return false;
    }
    return true;
}

/**
 * Toggles the visibility of the given password input field.
 * If the password is currently hidden, it is shown as plain text and the eye icon is changed to an open eye.
 * If the password is currently visible, it is hidden and the eye icon is changed to a closed eye.
 * @param {string} inputId - The ID of the password input field to toggle.
 * @param {HTMLElement} eyeIcon - The eye icon element that is used to toggle the password visibility.
 */
function togglePasswordVisibility(inputId, eyeIcon) {
    let passwordField = document.getElementById(inputId);
    let isPasswordHidden = passwordField.type === 'password';
    passwordField.type = isPasswordHidden ? 'text' : 'password';
    let newEyeSrc = isPasswordHidden ? '../assets/svg/regi_eye_open.svg' : '../assets/svg/regi_eye_closed.svg';
    eyeIcon.src = newEyeSrc;
    if (isPasswordHidden) {
        eyeIcon.style.height = '13px';
    } else {
        eyeIcon.style.height = '';
    }
}

/**
 * Displays an error message in the registration page.
 * Retrieves the error message element and displays the message, then
 * sets a timeout to hide the message after 3 seconds.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    let errorMessage = document.getElementById('signUpError');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

/**
 * Displays an error message for the password input on the registration page.
 * Sets the error message text content and makes it visible.
 * After 3 seconds, the error message is hidden.
 * @param {string} message - The error message to display.
 */
function showErrorPassword(message) {
    let errorMessage = document.getElementById('passwordError');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

/**
 * Displays a success message after a user has successfully signed up.
 * Retrieves the overlay element and sets its innerHTML to the success message.
 * Sets the display of the overlay element to block and the display of the registration page to none.
 * After 4 seconds, redirects the user to the login page and sets the display of the overlay element back to none.
 */
function userSuccessRegistration() {
    let overlayRef = document.getElementById("signUpSuccess");
    overlayRef.innerHTML = signUpSuccess();
    overlayRef.style.display = "block";
    let overlayRefSignUp = document.getElementById("registrationPage");
    overlayRefSignUp.style.display = "none";
    setTimeout(() => {
        window.location.href = "login.html";
        overlayRef.style.display = "none";
    }, 4000);
}