/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Hero (hero35)'];

  // 2nd row: Background image (optional)
  let imageRow = [''];
  const img = element.querySelector('figure.thumb-large .thumb img');
  if (img) {
    imageRow = [img]; // Reference the existing <img>
  }

  // 3rd row: Title, subtitle, description, CTA
  // We'll gather all relevant caption content in the correct order
  const cellContent = [];
  const figcaption = element.querySelector('figure.thumb-large figcaption.intro-info');
  if (figcaption) {
    // Title (h3 title-2)
    const title = figcaption.querySelector('.title-2');
    if (title) cellContent.push(title);

    // Description div (may contain p, a, br, etc)
    const desc = figcaption.querySelector('.desc');
    if (desc) {
      // Add all children (text, paragraphs, links, breaks) in order
      desc.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          cellContent.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          cellContent.push(p);
        }
      });
    }
  }
  const textRow = [cellContent];

  // Compose the table as per instructions
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
