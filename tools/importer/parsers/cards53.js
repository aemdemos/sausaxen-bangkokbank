/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row as per spec
  const rows = [['Cards (cards53)']];
  
  // Get all cards (immediate .col-md-4 children inside .row.row-left)
  const cardColumns = element.querySelectorAll('.row.row-left > .col-md-4');

  cardColumns.forEach(col => {
    // First cell: image (icon)
    const img = col.querySelector('.thumb-info .visual-img img');
    // Second cell: text content (heading and description)
    const caption = col.querySelector('.thumb-info .caption');

    // Defensive: If missing, fill with empty
    const imgCell = img || '';
    const captionCell = caption || '';

    rows.push([imgCell, captionCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
