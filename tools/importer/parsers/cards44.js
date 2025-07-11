/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by the block spec
  const headerRow = ['Cards (cards44)'];

  // Find all card columns (immediate children under .row.row-center)
  const cardCols = element.querySelectorAll('.row.row-center > .col-md-4');

  const rows = Array.from(cardCols).map((col) => {
    // Image: prefer <img> inside .thumb
    const img = col.querySelector('.thumb img');
    // Text content: .caption (title), .button-group (CTA)
    const caption = col.querySelector('.caption');
    const cta = col.querySelector('.button-group'); // Wraps the CTA link and any containing <p>

    // Compose right cell contents
    const contents = [];
    if (caption) contents.push(caption);
    if (cta) contents.push(cta);
    // If both missing, fallback to all inner text (shouldn't happen in this structure)
    if (!caption && !cta) contents.push(col);

    return [img, contents];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
