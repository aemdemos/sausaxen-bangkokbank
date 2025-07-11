/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row
  const headerRow = ['Carousel (carousel40)'];

  // Find the single slide (figure)
  const figure = element.querySelector('figure.thumb-large, figure');
  if (!figure) return;

  // Extract image (mandatory, first cell)
  let img = figure.querySelector('img');
  // Edge case: if no img found, skip this slide
  let imageCell = img || '';

  // Extract caption area (second cell; may be empty)
  const caption = figure.querySelector('figcaption');
  const textCellContent = [];
  if (caption) {
    // Title (h3)
    const h3 = caption.querySelector('h3');
    if (h3) textCellContent.push(h3);
    // Description (desc > p or all .desc children)
    const desc = caption.querySelector('.desc');
    if (desc) {
      // If desc has multiple children, add all; else add desc
      if (desc.children.length) {
        Array.from(desc.children).forEach(child => textCellContent.push(child));
      } else {
        textCellContent.push(desc);
      }
    }
    // CTA (button-group > a)
    const btn = caption.querySelector('.button-group a');
    if (btn) textCellContent.push(btn);
  }
  // Only use array if there is content, else empty string
  let textCell = textCellContent.length ? textCellContent : '';

  // Build table structure
  const cells = [
    headerRow,
    [imageCell, textCell],
  ];

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
