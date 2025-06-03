/**
 * Generates the HTML template for the login page.
 * @returns {string} the HTML template for the login page
 */
function loginTemplate() {
    return `
    <section class="max-width">
        <header>
            <img id="logoMain" src="../assets/svg/logo.svg" alt="">
            <div class="regiUser">
                <p class="registerButton">Not a Join user?</p>
                <button class="SignUpButton" onclick="window.location.href = 'registration.html';">Sign up</button>
            </div>
        </header>
        <section class="sectionOne">
            <div class="mainLogin">
                <div class="LoginCtn">
                    <h1 class="loginHeaderH1">Log in</h1>
                    <div class="loginLine"></div>
                </div>
                <form onsubmit="login(); return false;" class="loginForm">
                    <div class="loginEmail">
                        <input class="loginInput" type="email" id="email" placeholder="Email"required>
                    </div>
                    <div class="loginPassword"><input class="loginInput" type="password" id="password"
                            placeholder="Password" required></div>
                </form>
                <div class="rememberMeCtn">
                <input class="rememberMe" type="checkbox" id="rememberMe"><label for="rememberMe">Remember me</label>
                </div>
                <div class="loginButtons">
                    <button class="loginButton" onclick="login()">Log in</button>
                    <button class="guestButton" onclick="guestLogin()">Guest Log In</button>
                </div>
                <div id="loginError" class="errorMessage"></div>
            </div>
        </section>
        <div class="regiUser mobilelogin">
                <p class="registerButton">Not a Join user?</p>
                <button class="SignUpButton" onclick="window.location.href = 'registration.html';">Sign up</button>
            </div>
        <footer>
            <div class="privacy">
                <a href="../html/privacy_policy_not_loggedIn.html">Privacy Policy</a>
                <a href="../html/legal_not_loggedIn.html">Legal notice</a>
            </div>
        </footer>
    </section>
    `
}