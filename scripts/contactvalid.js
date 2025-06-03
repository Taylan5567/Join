/**
 * Updates an existing contact with new data.
 *
 * This asynchronous function updates the contact at the current edit index in the `contacts` array.
 * If the contact has an associated Firebase key, it also updates the contact in Firebase.
 * After updating, it displays a success message.
 *
 * @async
 * @function updateExistingContact
 * @param {string} name - The new name of the contact.
 * @param {string} phone - The new phone number of the contact.
 * @param {string} email - The new email address of the contact.
 * @returns {Promise<void>} A promise that resolves once the update (and Firebase update, if applicable) is complete.
 */
async function updateExistingContact(name, phone, email) {
    contacts[editIndex].name = name;
    contacts[editIndex].phone = phone;
    contacts[editIndex].email = email;
    if (contacts[editIndex].firebaseKey) {
      await updateContactInFirebase(contacts[editIndex].firebaseKey, { name, phone, email });
    }
  
    createSuccessMessage("Contact successfully updated", "successedit");
  }
/**
 * Creates a new contact and adds it to the contacts array.
 *
 * This function generates a new contact object with a unique ID, name, phone, email, and a random color.
 * It then pushes the new contact into the global `contacts` array and displays a success message.
 *
 * @function createNewContact
 * @param {string} name - The name of the new contact.
 * @param {string} phone - The phone number of the new contact.
 * @param {string} email - The email address of the new contact.
 */
  function createNewContact(name, phone, email) {
    const newContact = { 
      id: generateUniqueId(), 
      name, 
      phone, 
      email, 
      color: getRandomColor() 
    };
  
    contacts.push(newContact);
    createSuccessMessage("Contact successfully created", "successcreate");
  }
  
/**
 * Validates the phone input field by allowing only numeric characters.
 *
 * This function listens for input events on the phone input field and removes any non-digit characters,
 * ensuring that only numbers are entered.
 *
 * @function validatePhoneInput
 * @param {Event} event - The input event triggered on the phone input field.
 */
  function createSuccessMessage(message, targetClass) {
    const successDiv = document.querySelector(`.${targetClass}`);
    if (successDiv) {
      successDiv.textContent = message;
      successDiv.classList.remove("hide");
      successDiv.classList.add("show");
      setTimeout(() => {
        successDiv.classList.remove("show");
        successDiv.classList.add("hide");
      }, 3000);
    } 
  }
  
  /* Validates the phone input field, allowing only numbers. */
  function validatePhoneInput(event) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  

/**
 * Initializes event listeners for the contact form inputs and submission.
 *
 * This function sets up:
 * - An input event listener on the phone input to validate the phone number.
 * - An input event listener on the name input for custom handling (via `handleNameInput`).
 * - A submit event listener on the form to handle form submission (via `handleFormSubmit`).
 *
 * @function initializeEventListeners
 */
  function initializeEventListeners() {
    const phoneInput = document.getElementById("contact-phone");
    const nameInput = document.getElementById("contact-name");
    const form = document.getElementById("contact-form");
    if (phoneInput) {
      phoneInput.addEventListener("input", validatePhoneInput);
    }
    if (nameInput) {
      nameInput.addEventListener("input", handleNameInput);
    }
    if (form) {
      form.addEventListener("submit", handleFormSubmit);
    }
  }
  
  document.addEventListener("DOMContentLoaded", initializeEventListeners);
  
 /**
 * Toggles the collapse state of additional contact options.
 *
 * This function toggles the "open" class on the element with the ID "collapseContent",
 * effectively showing or hiding additional options. It also references a button element,
 * which could be used for further interactions or visual feedback.
 *
 * @function toggleCollapse
 */
  function toggleCollapse() {
    const content = document.getElementById("collapseContent");
    const button = document.querySelector(".collapse-button");
  
    if (content.classList.contains("open")) {
      content.classList.remove("open");
    } else {
      content.classList.add("open");
    }
  }
  
  /**
 * Deletes the contact with the given ID from the local contact list and the Firebase database.
 * @param {string} id - The ID of the contact to delete.
 * @returns {Promise<void>} - A promise that resolves when the contact has been deleted.
 */
async function deleteContact(id) {
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  if (contactIndex === -1) {
    return;
  }
  const contact = contacts[contactIndex];
  try {
    if (contact.firebaseKey) {
      await deleteContactFromFirebase(contact.firebaseKey);
    }
    contacts.splice(contactIndex, 1);
    showContacts();
  } catch (error) {
  }
}

/**
 * Deletes the contact with the given Firebase key from the Firebase database.
 * @param {string} firebaseKey - The Firebase key of the contact to delete.
 * @returns {Promise<void>} - A promise that resolves when the contact has been deleted.
 */
async function deleteContactFromFirebase(firebaseKey) {
  try {
    const response = await fetch(`${CONTACTS_URL}/contacts/${firebaseKey}.json`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`Fehler beim Löschen von Firebase: ${response.status}`);
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts in Firebase:", error);
  }
}

/**
 * Handles input events on the contact name input field in the overlay.
 * Updates the circle preview element with the initials and color based on the input value.
 * @param {Event} event - The input event object.
 * @returns {void}
 */
function handleNameInput(event) {
  const name = event.target.value.trim();
  const circleDiv = document.querySelector(".overlay-content .circle");
  updateCirclePreview(name, circleDiv);
}

/**
 * Updates the preview circle element with the initials and color based on the given name.
 * @param {string} name - The name to generate the initials and color for.
 * @param {HTMLElement} circleDiv - The element to update with the initials and color preview.
 * @returns {void}
 */
function updateCirclePreview(name, circleDiv) {
  if (name) {
    circleDiv.textContent = getInitials(name);
    circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  } else {
    circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  }
}

/**
 * Handles the submission of the contact form.
 * Prevents the default form submission behavior, extracts the name, phone, and email input values, and checks if the name and phone are not empty.
 * If the name and phone are not empty, calls the saveContact function to save the contact to Firebase and then closes the overlay and shows the contact list.
 * If the name or phone are empty, alerts the user to fill in the required fields.
 * @param {Event} event - The form submission event object.
 * @returns {void}
 */
function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  if (!name || !phone) {
    alert("Bitte Name und Telefonnummer eingeben!");
    return;
  }
  saveContact(name, phone, email);
  closeOverlay();
  showContacts();
}

/**
 * Saves a new or updated contact to the local contacts list and Firebase.
 * Determines whether the contact is new or existing based on the edit index,
 * updates the existing contact or creates a new one accordingly.
 * Closes the contact overlay, refreshes the contact list display,
 * and shows the details of the saved contact if successful.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} email - The email address of the contact.
 * @returns {Promise<void>} - A promise that resolves when the contact is saved.
 */
async function saveContact(name, phone, email) {
  let savedIndex = editIndex;
  if (editIndex !== null) {
    await updateExistingContact(name, phone, email);
  } else {
    savedIndex = await createNewContact(name, phone, email); 
  }
  closeOverlay(); 
  showContacts();
  if (savedIndex !== null) {
    showContactDetails(savedIndex);
  }
}

/**
 * Updates the contact at the index given by the editIndex variable with the given name, phone and email.
 * If the contact has a Firebase key, updates the corresponding entry in the Firebase database.
 * Shows a success message if the contact is successfully updated.
 * @param {string} name - The new name of the contact.
 * @param {string} phone - The new phone number of the contact.
 * @param {string} email - The new email address of the contact.
 * @returns {Promise<void>} - A promise that resolves when the contact has been updated.
 */
async function updateExistingContact(name, phone, email) {
  contacts[editIndex].name = name;
  contacts[editIndex].phone = phone;
  contacts[editIndex].email = email;
  if (contacts[editIndex].firebaseKey) {
    await updateContactInFirebase(contacts[editIndex].firebaseKey, { name, phone, email });
  }
  createSuccessMessage("Contact successfully updated", "successedit");
}

/**
 * Creates a new contact with the given name, phone and email.
 * Generates a unique ID, assigns a random color and adds the contact to the local contact list.
 * Shows a success message if the contact is successfully created.
 * @param {string} name - The name of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} email - The email address of the contact.
 * @returns {Promise<void>} - A promise that resolves when the contact has been created.
 */
function createNewContact(name, phone, email) {
  const newContact = { 
    id: generateUniqueId(), 
    name, 
    phone, 
    email, 
    color: getRandomColor() 
  };
  contacts.push(newContact);
  createSuccessMessage("Contact successfully created", "successcreate");
}

/**
 * Shows a success message in the given targetClass element for 3 seconds.
 * The message is displayed in the element's text content and the element's
 * classes are toggled between "hide" and "show" to show/hide the message.
 * @param {string} message - The message to be displayed.
 * @param {string} targetClass - The class of the element to display the message in.
 * @returns {void}
 */
function createSuccessMessage(message, targetClass) {
  const successDiv = document.querySelector(`.${targetClass}`);
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.classList.remove("hide");
    successDiv.classList.add("show");
    setTimeout(() => {
      successDiv.classList.remove("show");
      successDiv.classList.add("hide");
    }, 3000);
  } 
}

/**
 * Handles the input event of the phone input field.
 * Removes all non-digit characters from the input field's value.
 * @param {Event} event - The input event object.
 * @returns {void}
 */
function validatePhoneInput(event) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
}

/**
 * Initializes event listeners for the phone input field, name input field, and contact form.
 * Attaches an input event listener to the phone input field to remove all non-digit characters from the input value.
 * Attaches an input event listener to the name input field to check if the name is valid.
 * Attaches a submit event listener to the contact form to handle the form submission.
 * @returns {void}
 */
function initializeEventListeners() {
  const phoneInput = document.getElementById("contact-phone");
  const nameInput = document.getElementById("contact-name");
  const form = document.getElementById("contact-form");
  if (phoneInput) {
    phoneInput.addEventListener("input", validatePhoneInput);
  }
  if (nameInput) {
    nameInput.addEventListener("input", handleNameInput);
  }
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
}
document.addEventListener("DOMContentLoaded", initializeEventListeners);

/**
 * Toggles the visibility of the collapse content.
 * The content is identified by its id 'collapseContent' and the toggle button is
 * identified by its class 'collapse-button'. If the content is visible, it is
 * hidden by removing the 'open' class, otherwise it is shown by adding the 'open'
 * class.
 * @returns {void}
 */
function toggleCollapse() {
  const content = document.getElementById("collapseContent");
  const button = document.querySelector(".collapse-button");

  if (content.classList.contains("open")) {
    content.classList.remove("open");
  } else {
    content.classList.add("open");
  }
}

/**
 * Selects the contact main element and removes the selection from all other contact
 * main elements. If the element is already selected, it is deselected.
 * @param {HTMLElement} selectedElement The element to select
 * @returns {void}
 */
function selectContactMain(selectedElement) {
  const isSelected = selectedElement.classList.contains('selected');
  const allContacts = document.querySelectorAll('.contactmain');
  allContacts.forEach((element) => {
    element.classList.remove('selected');
  });
  if (!isSelected) {
    selectedElement.classList.add('selected');
  }
}
const colors = [
  "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD",
  "#2ECC71", "#E74C3C", "#3498DB", "#1ABC9C", "#D35400",
  "#C0392B", "#9B59B6", "#1E8449", "#F39C12", "#34495E",
  "#16A085"
];

let colorIndex = 0;
let firstCall = true;

/**
 * Returns a random color from the predefined colors array.
 * The first call to this function returns the first color in the array.
 * After the first call, the function returns the next color in the array
 * in a circular manner (i.e., it wraps around to the first color after
 * the last color in the array is reached).
 * @returns {string} A random color as a string in the format "#rrggbb"
 */
function getRandomColor() {
  if (firstCall) {
    firstCall = false;
    return colors[colorIndex]; 
  }
  colorIndex = (colorIndex + 1) % colors.length; 
  return colors[colorIndex];
}
