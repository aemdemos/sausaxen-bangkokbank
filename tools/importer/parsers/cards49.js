/* global WebImporter */
export default function parse(element, { document }) {
  // Block header according to the guidelines
  const headerRow = ['Cards (cards49)'];
  const rows = [];

  // Find all immediate child columns (cards)
  const cardCols = element.querySelectorAll(':scope > div');
  cardCols.forEach((col) => {
    const card = col.querySelector('.thumb-default');
    if (!card) return;
    const caption = card.querySelector('.caption');
    if (!caption) return;

    // Assemble card content (reference EXISTING elements, do not clone)
    // 1. Try to find heading/title
    const heading = caption.querySelector('h3, .title-3');
    // 2. Try to find download link
    const downloadLink = caption.querySelector('a.download-file');

    // Build cell content array, referencing actual elements
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (downloadLink) cellContent.push(downloadLink);
    // Only push non-empty cards
    if (cellContent.length) {
      rows.push([cellContent]);
    }
  });

  // The block table has a single column (no images/icons present)
  const tableRows = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  element.replaceWith(block);
}
