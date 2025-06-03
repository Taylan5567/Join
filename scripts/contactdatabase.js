/**
 * URL for Firebase Realtime Database.
 * @constant {string}
 */
const CONTACTS_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/contacts";

/**
 * Validates the name input field for minimum length requirement.
 * Displays an error message if the name is less than 2 characters long.
 * Hides the error message if the validation passes.
 * @param {Event} event - The input event triggered by the name input field.
 */
function nameValidate(event) {
  const nameInput = event.target;
  const nameError = document.getElementById("name-error");

  if (nameInput.value.trim().length < 2) {
    showError(nameError, "Name must be at least 2 characters long.", nameInput);
  } else {
    hideError(nameError, nameInput);
  }
}

/**
 * Validates the email input field for the correct format.
 * Displays an error message if the email does not match the regular expression.
 * Hides the error message if the validation passes.
 * @param {Event} event - The input event triggered by the email input field.
 */
function validateEmail(event) {
  const emailInput = event.target;
  const emailError = document.getElementById("email-error");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|de|at|net|org|ch|uk)$/i;
  emailRegex.test(emailInput.value)
    ? hideError(emailError, emailInput)
    : showError(emailError, "Invalid email format.", emailInput);
}

/**
 * Validates the phone input field for a correct format.
 * Ensures the phone number contains between 7 to 15 digits and can include spaces, plus signs, or parentheses.
 * Displays an error message if the phone number does not match the regular expression.
 * Hides the error message if the validation passes.
 * @param {Event} event - The input event triggered by the phone input field.
 */
function validatePhone(event) {
  const phoneInput = event.target;
  const phoneError = document.getElementById("phone-error");
  const phoneRegex = /^[0-9\s\+\-()]{7,15}$/;
  phoneRegex.test(phoneInput.value)
    ? hideError(phoneError, phoneInput)
    : showError(phoneError, "Phone number min 7 digits.", phoneInput);
}

/**
 * Displays an error message for a given input element.
 * Sets the error message text content and makes it visible.
 * Adds an error-border class to the input element to highlight the error.
 * @param {HTMLElement} element - The element where the error message is displayed.
 * @param {string} message - The error message to display.
 * @param {HTMLElement} input - The input element to which the error-border class is added.
 */
function showError(element, message, input) {
  element.textContent = message;
  element.style.display = "block";
  input.classList.add("error-border");
}

/**
 * Hides an error message for a given input element.
 * Sets the error message display to none and removes the error-border class from the input element.
 * @param {HTMLElement} element - The element whose error message is to be hidden.
 * @param {HTMLElement} input - The input element from which the error-border class is removed.
 */
function hideError(element, input) {
  element.style.display = "none";
  input.classList.remove("error-border");
}

/**
 * Synchronizes the local contact list with the data from the Firebase database.
 * Fetches the contact data from the specified URL and updates the local `contacts` array.
 * If the fetch operation is successful, it maps the data into contact objects with `firebaseKey`.
 * Displays the updated contact list and reloads the open contact details.
 * Logs an error message if the fetch operation fails.
 * @throws Logs an error message to the console if there is a network issue or the response is not OK.
 */
async function syncContacts() {
  try {
    const response = await fetch(`${CONTACTS_URL}.json`, { method: "GET" });
    if (!response.ok) return console.error("Fehler beim Abrufen der Kontakte");
    const data = await response.json();
    contacts = data ? Object.entries(data).map(([key, value]) => ({ ...value, firebaseKey: key })) : [];
    showContacts();
    reloadOpenContact();
  } catch (error) {
    console.error("Netzwerkfehler beim Abrufen der Kontakte:", error);
  }
}

/**
 * Reloads the open contact details when the contact list changes.
 * Checks if a contact details view is open and reloads the contact details
 * by calling `showContactDetails` with the index of the open contact.
 * If the contact details view is not open, it does nothing.
 */
function reloadOpenContact() {
  const detailsDiv = document.getElementById("contact-details");
  if (!detailsDiv) return;
  const openContactIndex = detailsDiv.getAttribute("data-contact-index");
  if (openContactIndex !== null) showContactDetails(parseInt(openContactIndex));
}

/**
 * Saves a new or edited contact to the local contact list and the Firebase database.
 * Checks if the contact details are valid (name, phone, email) and if the contact does not already exist.
 * If the contact is new, creates a new contact with the provided details.
 * If the contact is being edited, updates the existing contact with the new details.
 * Synchronizes the local contact list with the Firebase database.
 * If the contact is successfully saved, shows the contact details of the saved contact.
 * Does nothing if the contact details are invalid or the contact already exists.
 * @param {string} name - The name of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} email - The email address of the contact.
 * @returns {Promise<number|null>} - The index of the saved contact or null if the contact was not saved.
 */
async function saveContact(name, phone, email) {
  if (!name || !phone || !email) return;
  const savedIndex = editIndex !== null ? await updateContact(name, phone, email) : await createNewContact(name, phone, email);
  await syncContacts();
  if (savedIndex !== null) showContactDetails(savedIndex);
}

/**
 * Creates a new contact with the given name, phone and email.
 * Checks if a contact with the same name and phone already exists and alerts the user if it does.
 * Creates a new contact with a random color if the contact does not already exist.
 * Saves the new contact to the local contact list and the Firebase database.
 * Shows a success message if the contact is successfully saved.
 * Returns the index of the saved contact or null if the contact was not saved.
 * @param {string} name - The name of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} email - The email address of the contact.
 * @returns {Promise<number|null>} - The index of the saved contact or null if the contact was not saved.
 */
async function createNewContact(name, phone, email) {
  if (contacts.some(c => c.name === name && c.phone === phone)) {
    alert("Duplicate contact detected.");
    return null;
  }
  const newContact = { name, phone, email, color: getRandomColor() };
  newContact.firebaseKey = await pushContactToFirebase(newContact);
  contacts.push(newContact);
  createSuccessMessage("Contact successfully created", "successcreate");
  return contacts.length - 1;
}

/**
 * Updates an existing contact with new details.
 * Checks if the contact exists and if the contact index is valid.
 * Updates the existing contact with the new name, phone and email.
 * Synchronizes the contact with the Firebase database if the contact has a Firebase key.
 * Sets the edit index to null after the contact is updated.
 * Returns the index of the updated contact or null if the contact was not updated.
 * @param {string} name - The new name of the contact.
 * @param {string} phone - The new phone number of the contact.
 * @param {string} email - The new email address of the contact.
 * @returns {Promise<number|null>} - The index of the updated contact or null if the contact was not updated.
 */
async function updateContact(name, phone, email) {
  const contact = contacts[editIndex];
  if (!contact) return null;
  Object.assign(contact, { name, phone, email });
  if (contact.firebaseKey) await updateContactInFirebase(contact);
  editIndex = null;
  return editIndex;
}

/**
 * Deletes the contact at the given index from the contacts array and from the Firebase database.
 * If the index is invalid or the contact does not have a Firebase key, the function does nothing.
 * @param {number} index - The index of the contact to delete.
 * @returns {Promise<void>} - A promise that resolves when the contact has been deleted.
 */
async function deleteContact(index) {
  if (index < 0 || index >= contacts.length) return;
  const contact = contacts[index];
  if (!contact || !contact.firebaseKey) return;
  await deleteContactFromFirebase(contact.firebaseKey);
  contacts = contacts.filter(c => c.firebaseKey !== contact.firebaseKey);
  await syncContacts();
  showNextContact(index);
}

/**
 * Deletes the contact with the given Firebase key from the Firebase database.
 * @param {string} firebaseKey - The Firebase key of the contact to delete.
 * @returns {Promise<void>} - A promise that resolves when the contact has been deleted.
 */
async function deleteContactFromFirebase(firebaseKey) {
  await fetch(`${CONTACTS_URL}/${firebaseKey}.json`, { method: "DELETE" });
}

/**
 * Shows the next contact in the list when the currently shown contact is deleted.
 * @param {number} index - The index of the contact that was deleted.
 * @returns {void}
 */
function showNextContact(index) {
  let nextIndex = index >= contacts.length ? contacts.length - 1 : index;
  contacts.length > 0 && nextIndex >= 0 ? showContactDetails(nextIndex) : clearContactDetails();
}

/**
 * Clears the contact details view by removing all its content and hiding it.
 * @returns {void}
 */
function clearContactDetails() {
  const detailsDiv = document.getElementById("contact-details");
  detailsDiv.innerHTML = "<p>Kein Kontakt ausgewählt.</p>";
  detailsDiv.classList.add("hide");
}

/**
 * Pushes a new contact to the Firebase database.
 * @param {object} contact - The contact to push to Firebase.
 * @returns {Promise<string|null>} - The Firebase key of the newly created contact or null if the contact was not created.
 */
async function pushContactToFirebase(contact) {
  const response = await fetch(`${CONTACTS_URL}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return response.ok ? (await response.json()).name : null;
}

/**
 * Updates a contact in the Firebase database.
 * Checks if the contact exists and if the contact has a Firebase key.
 * Updates the contact in the Firebase database with the new details.
 * If the contact is successfully updated, shows a success message and synchronizes the local contact list with the Firebase database.
 * If the contact is not updated, logs an error message.
 * @param {object} contact - The contact to update in Firebase.
 * @returns {Promise<void>} - A promise that resolves when the contact has been updated.
 */
async function updateContactInFirebase(contact) {
  if (!contact || !contact.firebaseKey) return;
  const updateURL = `${CONTACTS_URL}/${contact.firebaseKey}.json`;
  const response = await fetch(updateURL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  if (response.ok) {
    createSuccessMessage("Contact successfully updated", "successedit");
    await syncContacts();
  } else {
    console.error(`Fehler beim Aktualisieren:`, response.status);
  }
}
document.addEventListener("DOMContentLoaded", syncContacts);
