/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards31)'];
  // Find all top-level card columns
  const row = element.querySelector('.row.row-center');
  if (!row) return;
  const cardCols = Array.from(row.querySelectorAll(':scope > .col-md-4'));
  const rows = cardCols.map(col => {
    // 1st cell: image (mandatory)
    const img = col.querySelector('.thumb img');
    // 2nd cell: text content (title, description, CTA)
    const textContent = [];
    const caption = col.querySelector('.caption');
    if (caption) {
      // Title (h3)
      const heading = caption.querySelector('h3');
      if (heading) textContent.push(heading);
      // Description (p)
      const desc = caption.querySelector('p');
      if (desc) textContent.push(desc);
    }
    // Call-to-Action link (if present)
    const cta = col.querySelector('.button-group a');
    if (cta) textContent.push(cta);
    return [img, textContent];
  });
  if (rows.length === 0) return;
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
