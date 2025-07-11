/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for cards3
  const rows = [
    ['Cards (cards3)']
  ];
  // Find all immediate card containers (col-md-4) within this block
  const cardDivs = element.querySelectorAll('.col-md-4');
  cardDivs.forEach(card => {
    // First column: The image element from .thumb img
    const img = card.querySelector('.thumb img');
    // Second column: Text content (title, description, cta)
    // We'll reference the relevant elements directly from source
    const caption = card.querySelector('.caption.editor');
    // CTA: find .button-group .sub-title-medium .link-text (should be a <p>)
    const cta = card.querySelector('.button-group .sub-title-medium .link-text');
    const textColumnContent = [];
    if (caption) textColumnContent.push(caption);
    if (cta) textColumnContent.push(cta);
    rows.push([
      img,
      textColumnContent
    ]);
  });
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
