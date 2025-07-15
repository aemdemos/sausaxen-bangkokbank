/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // Get all direct card columns
  const cardCols = element.querySelectorAll(':scope .col-md-4');
  cardCols.forEach((col) => {
    // Image
    let img = null;
    const imgContainer = col.querySelector('.visual-img img');
    if (imgContainer) img = imgContainer;

    // Text cell content
    const textNodes = [];
    // Title (h3), preserve heading
    const caption = col.querySelector('.caption');
    if (caption) {
      const title = caption.querySelector('h3');
      if (title) textNodes.push(title);
      // All paragraphs with text
      caption.querySelectorAll('p').forEach((p) => {
        if (p.textContent.trim()) textNodes.push(p);
      });
    }
    // CTA: link in button-group
    const btn = col.querySelector('.button-group a');
    if (btn) textNodes.push(btn);

    rows.push([
      img,
      textNodes,
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
