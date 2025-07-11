/* global WebImporter */
export default function parse(element, { document }) {
  // Cards28 block header
  const headerRow = ['Cards (cards28)'];
  const rows = [headerRow];

  // Get all top-level card columns
  const cardCols = element.querySelectorAll(':scope > .col-md-3');
  cardCols.forEach((col) => {
    // First cell: image or icon (must use reference to the existing <img>)
    const img = col.querySelector('.thumb-info .visual-img img');

    // Second cell: text content, may include title, description, and cta
    const textContent = [];

    // Title (as <strong> for block heading style, but keep element reference)
    const title = col.querySelector('.caption .title-3, .caption h3');
    if (title) {
      // Use existing element, but as block expects heading to be bold, wrap in <strong> if not already
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.replace(/\s+/g, ' ').trim();
      textContent.push(strong);
      textContent.push(document.createElement('br'));
    }

    // Description (none in the provided HTML, but if there were, would be here)
    // e.g. look for a <p> after title or in caption
    // We can future-proof by including all caption content except the heading
    if (title && title.parentElement) {
      Array.from(title.parentElement.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node !== title && node.tagName.toLowerCase() !== 'br') {
          textContent.push(node);
        }
      });
    }
    // Find CTA (either a set of links or a button)
    // Custom links: <ul>
    const linksList = col.querySelector('.custom-links .all-links ul');
    if (linksList) {
      textContent.push(linksList);
    } else {
      // Single CTA button
      const cta = col.querySelector('.button-group > a');
      if (cta) {
        textContent.push(cta);
      }
    }

    // Remove any undefined or empty from textContent
    const filteredTextContent = textContent.filter(e =>
      (typeof e === 'string' && e.trim().length > 0) || (e && e.nodeType === Node.ELEMENT_NODE)
    );

    // Add row with [image, text content]
    rows.push([
      img,
      filteredTextContent.length === 1 ? filteredTextContent[0] : filteredTextContent
    ]);
  });

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
