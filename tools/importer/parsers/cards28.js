/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as requested
  const rows = [['Cards (cards28)']];

  // Get all card columns (each card)
  const cardCols = element.querySelectorAll(':scope > div');

  cardCols.forEach((col) => {
    // Image/Icon (first cell)
    const img = col.querySelector('.visual-img img');
    const imageEl = img || '';

    // Text content (second cell)
    const textCell = [];

    // Title (h3, may have extra spaces)
    const title = col.querySelector('.caption h3');
    if (title) textCell.push(title);

    // Look for description (not present in this HTML, but left for future robustness)
    // Example HTML does not contain description paragraph, so do not force an empty p

    // CTA(s) logic
    const buttonGroup = col.querySelector('.button-group');
    if (buttonGroup) {
      // Check for .custom-links (dropdown of links)
      const customLinks = buttonGroup.querySelectorAll('.custom-links');
      if (customLinks.length > 0) {
        customLinks.forEach((cl) => {
          // The label (e.g., "Select Job Lists")
          const label = cl.querySelector('.text');
          if (label) textCell.push(label);
          // All <a>s in the dropdown (even if hidden by default)
          const allLinks = cl.querySelectorAll('ul li a');
          allLinks.forEach((a) => textCell.push(a));
        });
      }
      // Direct <a> (regular button style, e.g. "Read More", "Register")
      const directLinks = buttonGroup.querySelectorAll(':scope > a');
      directLinks.forEach((a) => textCell.push(a));
    }
    // If nothing present in text cell, add empty string
    if (textCell.length === 0) textCell.push('');

    rows.push([imageEl, textCell.length === 1 ? textCell[0] : textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
