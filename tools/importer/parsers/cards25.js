/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Cards (cards25)'];

  // Collect all unique visible card titles (from both tab header and dropdown)
  const cardTitles = new Set();

  // Get text from .tab-header a
  element.querySelectorAll('.tab-header a').forEach(a => {
    const t = a.textContent.trim();
    if (t) cardTitles.add(t);
  });

  // Get text from dropdown options
  element.querySelectorAll('select[data-select] option').forEach(option => {
    const t = option.textContent.trim();
    if (t) cardTitles.add(t);
  });

  // Compose card rows: two columns, first cell blank (no image), second cell is the card content
  const cardRows = Array.from(cardTitles).map(title => {
    const strong = document.createElement('strong');
    strong.textContent = title;
    return ['', strong];
  });

  // Assemble block table and replace
  const rows = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
