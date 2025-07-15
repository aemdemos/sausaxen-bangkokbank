/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards8)'];
  const cells = [headerRow];

  // Get all cards (each .col-md-4 under .row)
  const cardCols = element.querySelectorAll(':scope .row > .col-md-4');

  cardCols.forEach(col => {
    // First cell: The card image (img element, not background)
    let imgEl = null;
    const img = col.querySelector('.thumb img');
    if (img) {
      imgEl = img;
    }

    // Second cell: text content (title, desc, CTA)
    const textContent = [];
    const caption = col.querySelector('.caption');
    if (caption) {
      const title = caption.querySelector('h3');
      if (title) textContent.push(title);
      const desc = caption.querySelector('.desc');
      if (desc) textContent.push(desc);
    }
    // Call-to-action button
    const buttonGroup = col.querySelector('.button-group');
    if (buttonGroup) {
      const btn = buttonGroup.querySelector('a');
      if (btn) textContent.push(btn);
    }
    cells.push([
      imgEl,
      textContent
    ]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
