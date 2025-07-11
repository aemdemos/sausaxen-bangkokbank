/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards31)'];
  const rows = [];
  // Each card is a .col-md-4
  const cards = element.querySelectorAll('.col-md-4');
  cards.forEach((card) => {
    // Get image element (not a clone)
    const img = card.querySelector('.thumb img');
    // Build array for text content
    const cellContent = [];
    // Title (h3)
    const caption = card.querySelector('.caption');
    if (caption) {
      const h3 = caption.querySelector('h3');
      if (h3) {
        // Use strong for "visual heading", matching example
        const strong = document.createElement('strong');
        strong.textContent = h3.textContent.trim();
        cellContent.push(strong);
      }
      // Description: All <p> in caption
      const paragraphs = caption.querySelectorAll('p');
      paragraphs.forEach((p) => {
        // Ignore empty content or whitespace
        if (p.textContent && p.textContent.trim().length > 0) {
          // Use the existing element, but remove any trailing <br>
          if (
            p.lastChild &&
            p.lastChild.nodeType === Node.ELEMENT_NODE &&
            p.lastChild.tagName === 'BR'
          ) {
            p.removeChild(p.lastChild);
          }
          cellContent.push(document.createElement('br'));
          cellContent.push(p);
        }
      });
    }
    // CTA: .button-group a
    const cta = card.querySelector('.button-group a');
    if (cta) {
      // Place on a new line
      cellContent.push(document.createElement('br'));
      cellContent.push(cta);
    }
    rows.push([
      img,
      cellContent
    ]);
  });
  const tableArr = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
