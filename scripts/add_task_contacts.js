let selectedContactsGlobal = [];

/**
 * Generates an HTML element for a contact circle with the contact's initials and
 * the corresponding color from the Firebase database.
 * @param {string} contactName The name of the contact
 * @returns {HTMLElement} The element representing the contact circle
 */
function createInitialsCircle(contactName) {
    const circle = document.createElement('div');
    circle.classList.add('initials-circle');
    circle.textContent = getInitials(contactName);
    circle.style.backgroundColor = getContactColor(contactName); // Farbe aus Firebase
    return circle;
}

/**
 * Generates an HTML element for a contact item that can be selected and
 * unselected. The element consists of a circle with the contact's initials, a
 * label with the contact's name, and a checkbox. The element is clickable and
 * toggles the checkbox and the selected class on the element. The function takes
 * a contact object as an argument and returns the generated HTML element.
 * @param {object} contact The contact object to generate the element for
 * @returns {HTMLElement} The generated HTML element
 */
function createContactDiv(contact) {
    const circle = createInitialsCircle(contact.name);
    const label = createElementWithClass('span', 'contact-label', contact.name);
    const checkbox = createElementWithClass('input', 'checkbox');
    checkbox.type = 'checkbox';
    const container = createElementWithClass('div', 'contact-item');
    const circleLabelDiv = createElementWithClass('div', 'contact-circle-label', '', [circle, label]);
    container.append(circleLabelDiv, checkbox);
    container.dataset.fullname = contact.name;
    container.onclick = () => toggleContactDiv(container, checkbox, label, circle, contact);
    return container;
}


function toggleContactDiv(container, checkbox, label, circle, contact) {
    checkbox.checked = !checkbox.checked;
    container.classList.toggle('selected', checkbox.checked);
    toggleContactSelection(contact, checkbox.checked, document.getElementById('selected-contacts'));
}

/**
 * Toggles a contact's selection state and updates the selected contacts UI
 * @param {object} contact The contact object to toggle
 * @param {boolean} isSelected Whether the contact should be selected or deselected
 * @param {HTMLElement} selectedContactsContainer The container element to update with the selected contacts
 */
function toggleContactSelection(contact, isSelected, selectedContactsContainer) {
    if (isSelected) {
        if (!selectedContactsGlobal.includes(contact.name)) {
            selectedContactsGlobal.push(contact.name);
        }
    } else {
        selectedContactsGlobal = selectedContactsGlobal.filter(name => name !== contact.name);
    }
    renderSelectedContacts(selectedContactsGlobal, selectedContactsContainer);
}

/**
 * Renders the list of selected contacts as initials circles in the given container.
 * A maximum of 4 contacts are displayed, and a "+X" label is displayed if there are more than 4 selected contacts.
 * @param {string[]} selectedContacts The list of selected contacts' full names
 * @param {HTMLElement} container The element to render the selected contacts in
 */
function renderSelectedContacts(selectedContacts, container) {
    container.innerHTML = '';
    const maxDisplayed = 4, displayed = selectedContacts.slice(0, maxDisplayed), hiddenCount = selectedContacts.length - maxDisplayed;
    displayed.forEach(name => {
        const circle = createInitialsCircle(name), sel = createElementWithClass('div', 'selected-contact');
        sel.dataset.fullname = name; sel.append(circle); container.append(sel);
    });
    if (hiddenCount > 0) {
        let extra = container.querySelector('.extra-contacts');
        if (!extra) { extra = createElementWithClass('div', 'extra-contacts'); container.append(extra); }
        extra.textContent = `+${hiddenCount}`;
    } else {
        let extra = container.querySelector('.extra-contacts'); if (extra) extra.remove();
    }
}

/**
 * Retrieves the list of selected contacts from the UI.
 * The function queries the DOM for elements with the class 'selected-contact' within the 
 * '#selected-contacts' container and extracts their 'data-fullname' attribute values.
 * 
 * @returns {string[]} An array of full names of the selected contacts.
 */
function getSelectedContacts() {
    const selectedContacts = Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
        .map(el => el.dataset.fullname);
    return selectedContacts;
}

/**
 * Creates a dropdown wrapper element with a toggle button and a content area.
 * @returns {{wrapper: HTMLElement, content: HTMLElement}} The wrapper element and the content area element
 */
function createDropdownWrapper() {
    const wrapper = createElementWithClass('div', 'dropdown-wrapper');
    const content = createElementWithClass('div', 'dropdown-content');
    const toggle = createDropdownToggle(content);
    wrapper.append(toggle, content);
    return { wrapper, content };
}

/**
 * Creates a dropdown toggle button that toggles the visibility of the dropdown content.
 * The toggle button contains a text span and an arrow span.
 * When the toggle button is clicked, the visibility of the dropdown content is toggled.
 * @param {HTMLElement} dropdownContent The content area of the dropdown.
 * @returns {HTMLElement} The toggle button.
 */
function createDropdownToggle(dropdownContent) {
    const toggle = createElementWithClass('div', 'dropdown-toggle');
    const textSpan = createElementWithClass('span', '', 'Select contacts to assign');
    const arrowSpan = createElementWithClass('span', 'dropdown-arrow');
    toggle.append(textSpan, arrowSpan);
    toggle.onclick = () => {
        const isVisible = dropdownContent.style.display === 'block';
        dropdownContent.style.display = isVisible ? 'none' : 'block';
    };
    return toggle;
}

/**
 * Initializes the contacts dropdown in the task edit overlay.
 * Retrieves the list of contacts from the contacts database and renders each contact
 * as a div in the dropdown content area. The dropdown toggle button is also set up
 * to toggle the visibility of the dropdown content area.
 * The function also adds an outside click event listener to the dropdown wrapper to
 * hide the dropdown content area when the user clicks outside of it.
 * Finally, the function replaces the #task-assigned container with the dropdown wrapper
 * and appends a container for the selected contacts.
 */
async function initializeContactsDropdown() {
    const container = document.getElementById('task-assigned');
    if (!container) return console.error("#task-assigned not found.");
    if (!contacts || contacts.length === 0) await syncContacts();
    const { wrapper, content } = createDropdownWrapper();
    contacts.forEach(contact => content.append(createContactDiv(contact)));
    setupDropdownToggle(wrapper);
    addOutsideClickListener(wrapper, content);
    container.replaceWith(wrapper);
    wrapper.append(createElementWithClass('div', 'selected-contacts', '', [], 'selected-contacts'));
}

/**
 * Sets up the dropdown toggle button in the given wrapper element to toggle the visibility of the dropdown content
 * @param {HTMLElement} wrapper The wrapper element containing the dropdown toggle button and content
 */
function setupDropdownToggle(wrapper) {
    const dropdownToggle = wrapper.querySelector('.dropdown-toggle');
    dropdownToggle.onclick = () => toggleDropdownContact(wrapper);
}

/**
 * Toggles the visibility of the dropdown content within a wrapper element.
 * Changes the display style of the dropdown content between 'block' and 'none',
 * and toggles the 'open' class on the dropdown toggle button based on visibility.
 * @param {HTMLElement} wrapper - The wrapper element containing the dropdown elements.
 */
function toggleDropdownContact(wrapper) {
    const dropdownContent = wrapper.querySelector('.dropdown-content');
    const isVisible = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isVisible ? 'none' : 'block';
    wrapper.querySelector('.dropdown-toggle').classList.toggle('open', !isVisible);
}

/**
 * Adds an event listener to the document to listen for outside clicks on the given dropdown wrapper.
 * If the user clicks outside of the wrapper, the function hides the dropdown content and removes the 'open' class
 * from the dropdown toggle button.
 * @param {HTMLElement} wrapper - The dropdown wrapper element containing the toggle button and content.
 * @param {HTMLElement} content - The dropdown content element to be hidden if the user clicks outside.
 */
function addOutsideClickListener(wrapper, content) {
    document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target)) {
            content.style.display = 'none';
            wrapper.querySelector('.dropdown-toggle').classList.remove('open');
        }
    });
}

/**
 * Retrieves the color associated with a contact's name.
 * If the contact has a predefined color, it returns that color.
 * Otherwise, it returns a default color.
 * @param {string} name The name of the contact to find.
 * @returns {string} The color associated with the contact or the default color.
 */
function getContactColor(name) {
    const contact = contacts.find(contact => contact.name === name);
    if (contact && contact.color) {
        return contact.color;
    } else {
        return "#CCCCCC";
    }
}