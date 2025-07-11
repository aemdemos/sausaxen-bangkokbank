/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const headerRow = ['Cards (cards38)'];
  const rows = [];

  // Find all direct card elements
  const cardCols = element.querySelectorAll(':scope > .row > .col-md-4');
  cardCols.forEach((col) => {
    // Image: use the <img> (not a link)
    const img = col.querySelector('img');

    // Text content: title (h3), description, and CTA
    const caption = col.querySelector('.caption');
    const contentEls = [];

    if (caption) {
      // Title
      const title = caption.querySelector('h1, h2, h3, h4, h5, h6');
      if (title) contentEls.push(title);
      // Description (desc): always include, even if empty
      const desc = caption.querySelector('.desc');
      if (desc) contentEls.push(desc);
    }

    // CTA button (link)
    const buttonGroup = col.querySelector('.button-group');
    if (buttonGroup) {
      const cta = buttonGroup.querySelector('a');
      if (cta) contentEls.push(cta);
    }

    // If contentEls is empty (should not happen), leave blank cell
    rows.push([img, contentEls.length === 1 ? contentEls[0] : contentEls]);
  });

  // Build and replace with table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
