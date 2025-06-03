/**
 * Highlights all occurrences of the given keywords in the text element.
 *
 * @param {array} keywords - An array of keywords to highlight.
 */
function highlightKeywords() {
    let text = textElement.innerHTML;
    keywords.forEach(keyword => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        text = text.replace(regex, `<span style="color: blue;">$1</span>`);
    });
    textElement.innerHTML = text;
}
highlightKeywords();