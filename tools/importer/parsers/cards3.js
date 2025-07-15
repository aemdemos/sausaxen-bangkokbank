/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the block spec
  const headerRow = ['Cards (cards3)'];
  const rows = [];

  // Find all card columns (each card)
  const cols = element.querySelectorAll('.row > .col-md-4');
  cols.forEach((col) => {
    // 1. Image/icon in first cell
    let imageEl = null;
    const thumbImg = col.querySelector('.thumb img');
    if (thumbImg) {
      imageEl = thumbImg;
    } else {
      // fallback: take first image in card
      const fallbackImg = col.querySelector('img');
      if (fallbackImg) imageEl = fallbackImg;
    }

    // 2. Text content in second cell
    const textCellElements = [];
    // Title (should be heading - keep as is)
    const title = col.querySelector('.caption h3, .caption .title-3');
    if (title) textCellElements.push(title);
    // Description
    const desc = col.querySelector('.caption .desc');
    if (desc) textCellElements.push(desc);
    // Call-to-action (link)
    const cta = col.querySelector('.button-group a');
    if (cta) textCellElements.push(cta);

    // If any of the three are missing, just skip them (robustness)
    rows.push([imageEl, textCellElements]);
  });
  // Assemble table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
