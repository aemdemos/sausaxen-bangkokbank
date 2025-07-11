/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Get all immediate col divs (each is a card)
  const cardColumns = element.querySelectorAll(':scope > div');
  cardColumns.forEach(col => {
    // The card is inside a figure
    const figure = col.querySelector('figure');
    if (!figure) return;

    // Image: inside .thumb > img
    let img = figure.querySelector('.thumb img');
    // Defensive: fallback to any img in figure if not found
    if (!img) {
      img = figure.querySelector('img');
    }

    // Text column: build from figcaption
    const figcaption = figure.querySelector('figcaption');
    let textElements = [];
    if (figcaption) {
      // Title (e.g., h3)
      const title = figcaption.querySelector('h3');
      if (title) textElements.push(title);
      // Description (all .desc content)
      const desc = figcaption.querySelector('.desc');
      if (desc) {
        // Push all child nodes of the desc (including <p>)
        Array.from(desc.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            textElements.push(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // If there's plain text in .desc
            textElements.push(document.createTextNode(node.textContent));
          }
        });
      }
      // Call to action (button-group -> a)
      const button = figcaption.querySelector('.button-group a');
      if (button) textElements.push(button);
    }

    // Add this card row
    rows.push([
      img,
      textElements
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
