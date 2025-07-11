/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row exactly as specified
  const headerRow = ['Cards (cards13)'];
  const rows = [];
  // Select all immediate children with class 'col-md-4'
  const cardCols = element.querySelectorAll(':scope > .col-md-4');
  cardCols.forEach((col) => {
    // IMAGE CELL: always the image element (don't clone, use a reference)
    const img = col.querySelector('img');
    const imgCell = img;
    // TEXT CELL: wrap title, description, cta together
    const caption = col.querySelector('.caption');
    // Compose a fragment for the text cell
    const textCell = document.createElement('div');
    // Title (keep as heading if present)
    const h3 = caption && caption.querySelector('h3');
    if (h3) textCell.appendChild(h3);
    // Description (paragraph)
    const desc = caption && caption.querySelector('p');
    if (desc) textCell.appendChild(desc);
    // Optional CTA:
    const btn = col.querySelector('.button-group a');
    if (btn) {
      // Use the existing element, but remove unnecessary nesting
      const cta = document.createElement('a');
      cta.href = btn.href;
      // Prefer the button's inner p's text if present
      const btnP = btn.querySelector('p');
      cta.textContent = btnP ? btnP.textContent : btn.textContent;
      cta.className = 'button-link';
      textCell.appendChild(cta);
    }
    rows.push([imgCell, textCell]);
  });
  // Compose the table (header + all card rows)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}