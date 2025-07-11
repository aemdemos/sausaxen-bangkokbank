/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards13)'];
  // Get all cards (each .col-md-4 is a card)
  const cards = Array.from(element.querySelectorAll(':scope > .col-md-4'));
  const rows = cards.map(card => {
    // First cell: image (keep original reference)
    const img = card.querySelector('.thumb img');
    // Second cell: content
    const content = [];
    const caption = card.querySelector('.caption');
    if (caption) {
      // Title (h3)
      const h3 = caption.querySelector('h3');
      if (h3) content.push(h3);
      // Description (first <p> inside .caption)
      const p = caption.querySelector('p');
      if (p) content.push(p);
    }
    // Call-to-action button (link)
    const btn = card.querySelector('.button-group a');
    if (btn) content.push(btn);
    return [img, content];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
