/* global WebImporter */
export default function parse(element, { document }) {
  // Header matches example exactly
  const headerRow = ['Cards (cards51)'];
  const rows = [headerRow];

  // Get all direct child columns representing cards
  const cardCols = element.querySelectorAll('.row > .col-md-4');

  cardCols.forEach(col => {
    // First cell: the image element (mandatory)
    const img = col.querySelector('.thumb-info .visual-img img');

    // Second cell: text content (title, description, CTA)
    const caption = col.querySelector('.caption');
    const textCellContent = [];
    
    if (caption) {
      // Title (optional)
      const title = caption.querySelector('h3');
      if (title) {
        textCellContent.push(title);
      }
      // Description (optional, <p> after h3, only if has text)
      // This "description" p is often empty in this set, so let's check
      const desc = caption.querySelector('p');
      if (desc && desc.textContent.trim() !== '') {
        textCellContent.push(desc);
      }
    }

    // CTA (button group) (optional)
    const buttonGroup = col.querySelector('.button-group');
    // CTA should be linked text only if present
    if (buttonGroup) {
      const btn = buttonGroup.querySelector('a');
      if (btn) {
        textCellContent.push(btn);
      }
    }
    // If there's nothing in the right cell, add empty string (shouldn't happen here, but for safety)
    if (textCellContent.length === 0) {
      textCellContent.push('');
    }

    // Add the row: [image, text content]
    rows.push([
      img,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
