let contacts = [];
let editIndex = null;

/**
 * Generates initials from a name by taking the first letter of the first and last name.
 * @param {string} name - The name from which to extract the initials.
 * @returns {string} The initials of the given name.
 */
function getInitials(name) {
  const parts = name.split(" ");
  const initials = parts.map(part => part[0]).join("").toUpperCase();
  return initials;
}

/**
 * Sets up the contact edit form with the contact at the given index.
 * @param {number} index - The index of the contact in the contacts array to edit.
 * @returns {void}
 */
function setupEditContact(index) {
  const elements = setNewContact();
  if (!contacts[index]) return; 
  const contact = contacts[index];
  populateEditContactFields(elements, contact);
  updateCircleAppearance(elements.circleDiv, contact);
  editIndex = index;
  updateContactDetailsAfterEdit()
}

/**
 * Populates the contact edit form with the given contact's details.
 * @param {object} elements - The object containing the DOM elements of the contact edit form.
 * @param {object} contact - The contact object to populate the form with.
 * @returns {void}
 */
function populateEditContactFields(elements, contact) {
  elements.title.textContent = "Edit Contact";
  elements.nameInput.value = contact.name;
  elements.phoneInput.value = contact.phone;
  elements.emailInput.value = contact.email;

  elements.submitButton.innerHTML = `Save changes <img class="check" src="../assets/icons/contact/check.png">`;
  elements.cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  elements.cancelButton.setAttribute("onclick", "closeOverlay()"); 
}

/**
 * Updates the contact circle's appearance with the contact's initials and color.
 * If the contact doesn't have a color yet, it generates a random color.
 * @param {HTMLElement} circleDiv - The div element representing the contact circle.
 * @param {object} contact - The contact object to update the circle's appearance with.
 * @returns {void}
 */
function updateCircleAppearance(circleDiv, contact) {
  circleDiv.textContent = getInitials(contact.name);
  if (!contact.color) {
    contact.color = getRandomColor();
  }
  circleDiv.style.backgroundColor = contact.color; 
}

/**
 * Updates the open contact details after editing a contact.
 * If the contact details view is open and the open contact index is valid,
 * it reloads the contact details by calling `showContactDetails` with the index of the open contact.
 * If the contact details view is not open, it does nothing.
 * @returns {void}
 */
function updateContactDetailsAfterEdit() {
  const detailsDiv = document.getElementById("contact-details");
  if (!detailsDiv) return;
  const openContactIndex = detailsDiv.getAttribute("data-contact-index");
  if (openContactIndex !== null) {
    const contactData = contacts[parseInt(openContactIndex)];
    if (contactData) {
      showContactDetails(parseInt(openContactIndex));
    }
  }
}

/**
 * Opens the contact overlay in either "edit" or "new" mode.
 * @param {string} mode - The mode to open the overlay in, either "edit" or "new".
 * @param {number} [index] - The index of the contact to edit, if mode is "edit".
 * @returns {void}
 */
function openOverlay(mode, index = null) {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("hide");
  overlay.classList.add("show");
  overlay.style.display = "flex";

  if (mode === "edit") {
    setupEditContact(index);
  } else {
    setupNewContact();
  }
}

/**
 * Returns an object with references to the DOM elements of the contact overlay.
 * @returns {{
 *   title: HTMLHeadingElement,
 *   description: HTMLParagraphElement,
 *   nameInput: HTMLInputElement,
 *   phoneInput: HTMLInputElement,
 *   emailInput: HTMLInputElement,
 *   circleDiv: HTMLDivElement,
 *   submitButton: HTMLButtonElement,
 *   cancelButton: HTMLButtonElement
 * }}
 */
function setNewContact() {
  return {
    title: document.querySelector(".overlay-left h1"),
    description: document.querySelector(".description"),
    nameInput: document.getElementById("contact-name"),
    phoneInput: document.getElementById("contact-phone"),
    emailInput: document.getElementById("contact-email"),
    circleDiv: document.querySelector(".overlay-content .circle"),
    submitButton: document.querySelector(".submit"),
    cancelButton: document.querySelector(".cancel")
  };
}

/**
 * Sets up the overlay for adding a new contact.
 * Retrieves the DOM elements of the overlay content with `setNewContact` and initializes the UI with `initializeNewContactUI`.
 * Resets the contact inputs with `resetContactInputs` and sets `editIndex` to `null`.
 * @returns {void}
 */
function setupNewContact() {
  const elements = setNewContact();
  initializeNewContactUI(elements);
  resetContactInputs(elements);
  editIndex = null;
}

/**
 * Initializes the contact overlay UI for adding a new contact.
 * Sets the title to "Add Contact", description to "Tasks are better with a team!",
 * circle to a default circle with a white background, submit button to "Create contact"
 * and cancel button to "Cancel" with an onclick handler that closes the overlay.
 * @param {{title: HTMLHeadingElement, description: HTMLParagraphElement, circleDiv: HTMLDivElement, submitButton: HTMLButtonElement, cancelButton: HTMLButtonElement}} elements - The object containing the DOM elements of the contact overlay.
 * @returns {void}
 */
function initializeNewContactUI({ title, description, circleDiv, submitButton, cancelButton }) {
  title.textContent = "Add Contact";
  description.textContent = "Tasks are better with a team!";
  circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  circleDiv.style.backgroundColor = "";
  submitButton.innerHTML = `Create contact <img class="check" src="../assets/icons/contact/check.png">`;
  cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  cancelButton.setAttribute("onclick", "closeOverlay()");
}

/**
 * Resets the contact inputs to their initial values.
 * Resets the name, phone, and email input values to empty strings.
 * @param {{nameInput: HTMLInputElement, phoneInput: HTMLInputElement, emailInput: HTMLInputElement}} elements - The object containing the DOM elements of the contact inputs.
 * @returns {void}
 */
function resetContactInputs({ nameInput, phoneInput, emailInput }) {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
}

/**
 * Sets up the overlay for adding a new contact.
 * Retrieves the DOM elements of the overlay content with `setNewContact` and initializes the UI with `initializeNewContactUI`.
 * Resets the contact inputs with `resetContactInputs` and sets `editIndex` to `null`.
 * @returns {void}
 */
function setupNewContact() {
  const elements = setNewContact();
  initializeNewContactUI(elements);
  resetContactInputs(elements);
  editIndex = null;
}

/**
 * Initializes the contact overlay UI for adding a new contact.
 * Sets the title to "Add Contact", description to "Tasks are better with a team!",
 * circle to a default circle with a white background, submit button to "Create contact"
 * and cancel button to "Cancel" with an onclick handler that closes the overlay.
 * @param {{title: HTMLHeadingElement, description: HTMLParagraphElement, circleDiv: HTMLDivElement, submitButton: HTMLButtonElement, cancelButton: HTMLButtonElement}} elements - The object containing the DOM elements of the contact overlay.
 * @returns {void}
 */
function initializeNewContactUI({ title, description, circleDiv, submitButton, cancelButton }) {
  title.textContent = "Add Contact";
  description.textContent = "Tasks are better with a team!";
  circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  circleDiv.style.backgroundColor = "";
  submitButton.innerHTML = `Create contact <img class="check" src="../assets/icons/contact/check.png">`;
  cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  cancelButton.setAttribute("onclick", "closeOverlay()");
}

/**
 * Resets the contact input fields to empty strings.
 * This function clears the values of the name, phone, and email input elements, 
 * effectively resetting the contact form fields to their initial blank state.
 * @param {{nameInput: HTMLInputElement, phoneInput: HTMLInputElement, emailInput: HTMLInputElement}} elements - 
 * The object containing the DOM elements of the contact inputs.
 * @returns {void}
 */
function resetContactInputs({ nameInput, phoneInput, emailInput }) {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
}

/**
 * Closes the contact overlay by removing the 'show' class and adding the 'hide' class.
 * Sets the overlay's display to 'none' after a 300ms delay.
 * @returns {void}
 */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("show");
  overlay.classList.add("hide");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 300);
}

/**
 * Displays the list of contacts in the contact list element.
 * Clears the innerHTML of the contact list element, groups the contacts by letter,
 * and displays the grouped contacts in the list element.
 * @returns {void}
 */
function showContacts() {
  const contactList = document.getElementById("contactlist");
  if (!contactList) {
    return;
  }
  contactList.innerHTML = "";
  const groupedContacts = groupContactsByLetter(contacts);
  displayGroupedContacts(groupedContacts, contactList);
}

/**
 * Groups an array of contacts by their first letter.
 * @param {array} contacts The array of contacts to group.
 * @returns {object} An object containing the grouped contacts. The keys are the
 * letters and the values are arrays of contacts whose first letter is the key.
 */
function groupContactsByLetter(contacts) {
  return contacts.reduce((groups, contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(contact);
    return groups;
  }, {});
}

/**
 * Displays the grouped contacts in the contact list element.
 * The grouped contacts are displayed in alphabetical order of the first letter
 * of each contact's name. The contacts are grouped by letter and each group is
 * displayed in a div element with the corresponding letter as the display name.
 * @param {object} groupedContacts An object containing the grouped contacts.
 * The keys are the letters and the values are arrays of contacts whose first
 * letter is the key.
 * @param {HTMLElement} contactList The element to display the grouped contacts in.
 * @returns {void}
 */
function displayGroupedContacts(groupedContacts, contactList) {
  Object.keys(groupedContacts)
    .sort()
    .forEach(letter => {
      const groupDiv = createGroupDiv(letter);
      groupedContacts[letter].forEach(contact => appendContact(contact, groupDiv));
      contactList.appendChild(groupDiv);
    });
}

/**
 * Creates a div element for a contact group with the given letter.
 * The group div contains the letter as a heading and a horizontal rule.
 * @param {string} letter The letter of the contact group to create a div for.
 * @returns {HTMLElement} The created group div element.
 */
function createGroupDiv(letter) {
  const groupDiv = document.createElement("div");
  groupDiv.classList.add("contact-group");
  groupDiv.innerHTML = `<h2 class="bigletter">${letter}</h2><hr>`;
  return groupDiv;
}

/**
 * Appends a contact to the specified contact group division.
 * Ensures that the contact has a color, generating a random one if absent.
 * Creates an HTML element for the contact and appends it to the group.
 * 
 * @param {object} contact - The contact object to append.
 * @param {HTMLElement} groupDiv - The div element representing the contact group.
 * @returns {void}
 */
function appendContact(contact, groupDiv) {
  if (!contact.color) contact.color = getRandomColor();
  const contactDiv = createContactDiv(contact);
  groupDiv.appendChild(contactDiv);
}

/**
 * Displays the contact list and updates the contact details view.
 * Ensures that the contact list UI is properly displayed by calling
 * contactListAdd, synchronizes the local contact list with the database,
 * and displays the contacts using showContacts. Finally, it updates the
 * contact details view to reflect the currently selected contact, if any.
 * The function is asynchronous due to the syncContacts operation.
 * @returns {Promise<void>}
 */
async function showContactList() {
  contactListAdd();
  await syncContacts(); 
  showContacts(); 
  updateContactDetailsView(); 
}

/**
 * Updates the contact details view to reflect the currently selected contact, if any.
 * Gets the open contact index from the contact details div, and if it exists, retrieves the contact data
 * and updates the contact details view with the contact data. Sets the contact details div to show and removes the hide class.
 * @returns {void}
 */
function updateContactDetailsView() {
  const detailsDiv = document.getElementById("contact-details");
  if (!detailsDiv) return; 
  const openContactIndex = detailsDiv.getAttribute("data-contact-index");
  if (openContactIndex !== null) {
    const contactData = getContactByIndex(parseInt(openContactIndex));
    if (contactData) {
      updateContactDetails(contactData); 
    }
    detailsDiv.classList.add("show");
    detailsDiv.classList.remove("hide");
  }
}

/**
 * Toggles the contact list visibility and hides the contact details view.
 * Adds the "show" class and removes the "hide" class from the contact list.
 * Adds the "hide" class and removes the "show" class from the contact details view.
 * @returns {void}
 */
function contactListAdd() {
  const contactList = document.querySelector(".scrolllist");
  const detailsDiv = document.getElementById("contact-details");
  contactList.classList.add("show");
  contactList.classList.remove("hide");
  detailsDiv.classList.add("hide");
  detailsDiv.classList.remove("show");
}

/**
 * Zeigt die Detailansicht f r den Kontakt mit dem berlegten Index.
 * Aktualisiert die Detailansicht mit den Daten des ausgew hlte
 * Kontakts und blendet die Detailansicht ein.
 * @param {number} index - Der Index des ausgew hlte Kontakts
 * @returns {void}
 */
function showContactDetails(index) {
  const detailsDiv = document.getElementById("contact-details");
  const contact = contacts[index];
  if (!contact) return;
  detailsDiv.setAttribute("data-contact-index", index);
  detailsDiv.innerHTML = `
    <h2>${contact.name}</h2>
    <p>Email: ${contact.email}</p>
    <p>Telefon: ${contact.phone}</p>
  `;
  detailsDiv.classList.add("show");
  detailsDiv.classList.remove("hide");
}

