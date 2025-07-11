/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly as in the example
  const headerRow = ['Cards (cards46)'];
  const cells = [headerRow];

  // Get all direct card columns
  const cardCols = element.querySelectorAll(':scope > .col-md-3');

  cardCols.forEach((col) => {
    // Within each col, find image (img), title (h3), and link (a)
    // Image: .thumb img
    const img = col.querySelector('.thumb img');
    // Title: .caption.editor h3
    const title = col.querySelector('.caption.editor h3');
    // CTA: .button-group a
    const cta = col.querySelector('.button-group a');

    // Compose text cell. Title is always first (even if missing, cell won't be empty because it's mandatory)
    // The example has only a title and a CTA (no description)
    // We'll include both, if present, in order: title, then CTA
    const textContents = [];
    if (title) textContents.push(title);
    if (cta) textContents.push(cta);
    // Fallback: if neither present, leave blank
    let textCell;
    if (textContents.length === 0) {
      textCell = '';
    } else if (textContents.length === 1) {
      textCell = textContents[0];
    } else {
      textCell = textContents;
    }
    // Add row: [image, text cell]
    cells.push([
      img || '',
      textCell
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
