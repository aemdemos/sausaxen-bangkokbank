/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per spec and example
  const cells = [
    ['Cards (cards8)']
  ];

  // Find the row of cards
  const row = element.querySelector('.row');
  if (!row) return;

  // Each card is a .col-md-4 inside .row
  const cardCols = Array.from(row.querySelectorAll(':scope > .col-md-4'));

  cardCols.forEach((col) => {
    // Get image (if present)
    const img = col.querySelector('.thumb-info .visual-img img');

    // Get card heading (h3), description (p.text-default), and CTA (a inside .button-group)
    const caption = col.querySelector('.thumb-info .caption');
    const content = [];
    if (caption) {
      const heading = caption.querySelector('h3');
      if (heading) content.push(heading);
      const desc = caption.querySelector('p');
      // Only add if not empty
      if (desc && desc.textContent.trim()) content.push(desc);
      else if (desc && !desc.textContent.trim()) {
        // If it's empty, but visually there in source, add for spacing consistency
        content.push(desc);
      }
    }
    // CTA link
    const cta = col.querySelector('.thumb-info .button-group a');
    if (cta) content.push(cta);

    cells.push([
      img || '',
      content.length === 1 ? content[0] : content
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
