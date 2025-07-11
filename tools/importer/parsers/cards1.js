/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Cards (cards1)'];
  const rows = [];

  // Get all the immediate card columns
  const cardCols = element.querySelectorAll(':scope .col-md-4');
  cardCols.forEach((col) => {
    // Image: first <img> directly inside the card
    const img = col.querySelector('img'); // reference, not cloning
    
    // Title: <h3> inside .caption.editor
    const caption = col.querySelector('.caption.editor');
    let titleElem = null;
    if (caption) {
      titleElem = caption.querySelector('h3');
    }

    // CTA: <a> inside .button-group.editor
    const buttonGroup = col.querySelector('.button-group.editor');
    let ctaElem = null;
    if (buttonGroup) {
      ctaElem = buttonGroup.querySelector('a');
    }

    // Compose right cell: title (heading), and CTA (as existing <a>)
    const cellContent = [];
    if (titleElem) cellContent.push(titleElem);
    if (ctaElem) cellContent.push(ctaElem);

    rows.push([img, cellContent]);
  });

  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
