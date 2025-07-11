/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards51)'];
  const rows = [headerRow];
  // Find all card columns in the row
  const row = element.querySelector('.scrolling-x .row');
  if (!row) return;
  const colDivs = Array.from(row.children).filter(div => div.classList.contains('col-md-4'));
  colDivs.forEach(col => {
    // Image cell
    const card = col.querySelector('.thumb-info');
    if (!card) return;
    const imgEl = card.querySelector('.visual-img img');
    // Text cell
    const textCell = document.createElement('div');
    // Title
    const caption = card.querySelector('.caption');
    if (caption) {
      const h3 = caption.querySelector('h3');
      if (h3) textCell.appendChild(h3);
      // Description (only if not empty and not just dashes)
      const desc = caption.querySelector('p');
      if (desc && desc.textContent && desc.textContent.trim() && desc.textContent.trim() !== '--') {
        textCell.appendChild(desc);
      }
    }
    // CTA
    const buttonGroup = card.querySelector('.button-group');
    if (buttonGroup) {
      const a = buttonGroup.querySelector('a');
      if (a) textCell.appendChild(a);
    }
    rows.push([
      imgEl || '',
      textCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
