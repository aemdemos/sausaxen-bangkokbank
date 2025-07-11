/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Prepare header row exactly as in example
  const headerRow = ['Cards (cards3)'];

  // 2. Find all immediate card columns. Should be direct children of .row
  const cardColumns = Array.from(element.querySelectorAll(':scope > .col-md-4, :scope > div > .col-md-4'));
  // Some HTML puts .col-md-4 inside another div, so try both.
  const cards = cardColumns.length ? cardColumns : Array.from(element.querySelectorAll(':scope > div'));

  const rows = cards.map(card => {
    // --- IMAGE ---
    // Try to find .thumb img inside the card
    let imageEl = null;
    const thumb = card.querySelector('.thumb img');
    if (thumb) {
      imageEl = thumb;
    }
    // --- TEXT CONTENT ---
    const cellContent = [];
    // Caption block with heading and description
    const caption = card.querySelector('.caption, .caption.editor');
    if (caption) {
      // Title (h3 or h4)
      const heading = caption.querySelector('h3, h4, .title-3');
      if (heading) cellContent.push(heading);
      // Description (p inside .caption)
      // (if multiple p, keep them all)
      const descPs = caption.querySelectorAll('p');
      descPs.forEach(p => cellContent.push(p));
    }
    // --- CTA ---
    const buttonGroup = card.querySelector('.button-group');
    if (buttonGroup) {
      // Try to extract readable CTA link or element
      // Usually a <span> or <a> with text inside
      // We'll include the entire buttonGroup to preserve structure
      cellContent.push(buttonGroup);
    }
    return [imageEl, cellContent];
  });

  // 3. Compose table cells, header first
  const tableCells = [headerRow, ...rows];
  // 4. Build the table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  // 5. Replace the original element
  element.replaceWith(block);
}
