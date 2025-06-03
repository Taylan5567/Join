/**
 * Goes back to the summary page.
 * @returns {void} - Does not return a value.
 */
function goBack() {
  window.location.href = 'summary.html';
}

/**
 * Highlights all occurrences of the words "Join" and "Developer Akademie GmbH" in all paragraphs on the page.
 */
function highlightJoinInParagraphs() {
  document.querySelectorAll("p").forEach(paragraph => {
    highlightText(paragraph, "Join");
    highlightText(paragraph, "Developer Akademie GmbH");
  });
}

/**
 * Highlights all occurrences of a specified word within a given HTML element's content.
 * Replaces each occurrence of the word with a <span> element styled with a specified color.
 *
 * @param {HTMLElement} element - The HTML element whose content is to be searched and modified.
 * @param {string} word - The word to be highlighted within the element's content.
 */
function highlightText(element, word) {
  if (element.textContent.includes(word)) {
    const regex = new RegExp(word, "g");
    element.innerHTML = element.innerHTML.replace(regex, `<span style="color: #29ABE2;">${word}</span>`);
  }
}
highlightJoinInParagraphs();