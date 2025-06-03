/**
 * Generates the HTML template for the registration page.
 * Includes input fields for name, email, password, and password confirmation.
 * Contains a checkbox for accepting the privacy policy and a submit button.
 * Provides error message elements for password and signup errors.
 * @returns {string} The HTML template for the registration page.
 */
function registrationTemplate() {
    return `
    <div class="sectionOne">
    <div class="mainLogin registerMain">
        <img class="signUpArrow" onclick="window.location.href = 'login.html';" src="../assets/svg/arrow-left-line.svg"
            alt="">
        <div class="signUpCtn">
            <h1 class="signUpHeaderH1">Sign up</h1>
            <div class="signUpLine"></div>
        </div>
        <form onsubmit="signUp(event);" class="loginForm" novalidate>
            <div class="signUpInput"><input type="name" id="name"
                    placeholder="Name" required>
            </div>
            <div class="signUpInput"><input class="signUpInput2" type="email" id="email" placeholder="Email" required>
            </div>
            <div class="password_container">
                <div class="password_registration">
                    <div class="signUpInputPassword"><input class="signUpInput2" type="password" id="password" placeholder="Password"
                        required>
                        <img class="registration_eye_img" src="../assets/svg/regi_eye_closed.svg" alt="eye" onclick="togglePasswordVisibility('password', this)">
                    </div>
                </div>
                <div class="password_registration">
                    <div class="signUpInputPassword"><input class="signUpInput2" type="password" id="confirmPassword"
                        placeholder="Confirm Password" required>
                        <img class="registration_eye_img" src="../assets/svg/regi_eye_closed.svg" alt="eye" onclick="togglePasswordVisibility('confirmPassword', this)">
                    </div>
                </div>
            </div>
            <div class="signUpErrorMain">
                <div id="passwordError" class="errorPwMessage"></div>
                <div id="signUpError" class="errorMessage"></div>
            </div>
            <div class="signUpMain">
                <div class="checkboxMain">
                    <input type="checkbox" id="checkbox" class="checkboxBox" onchange="toggleSignUpButton()">
                    <label for="checkbox" class="checkboxInput">I accept the <a class="privacyLink" href="../html/privacy_policy_not_loggedIn.html">Privacy Policy</a></label>
                </div>
                <button type="submit" class="signUpButton signUpButtonMain" disabled>Sign up</button>
            </div>
        </form>
    </div>
</div>
    `
}

/**
 * Returns an HTML string that displays a success message after a user has
 * successfully signed up.
 *
 * @return {string} The HTML string.
 */
function signUpSuccess() {
    return `
    <div class="signUpSuccessClass" id="signUpSuccessID">
        <p class="signUpSuccessP">Du bist jetzt erfolgreich registriert.</p>
    </div>
    `
}