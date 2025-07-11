/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one cell
  const rows = [
    ['Cards (cards25)']
  ];

  // Parse for the card(s): no image/icon, so left cell is empty string, right cell is the main text
  // Try to get the active tab label from <a> or <option>
  let cardText = '';
  const activeA = element.querySelector('a.active');
  if (activeA && activeA.textContent.trim()) {
    cardText = activeA.textContent.trim();
  } else {
    const activeOption = element.querySelector('option.active');
    if (activeOption && activeOption.textContent.trim()) {
      cardText = activeOption.textContent.trim();
    } else {
      // fallback: any tab label
      const anyTab = element.querySelector('a, option');
      if (anyTab && anyTab.textContent.trim()) {
        cardText = anyTab.textContent.trim();
      }
    }
  }

  // Add card row (with two columns) if content found
  if (cardText) {
    rows.push(['', cardText]);
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
