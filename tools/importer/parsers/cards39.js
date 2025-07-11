/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner div with class 'active' (cards are only there)
  const activeInner = element.querySelector('.inner.active');
  if (!activeInner) return;
  const scrolling = activeInner.querySelector('.scrolling-x');
  if (!scrolling) return;
  const row = scrolling.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > .col-md-4');
  const cells = [['Cards (cards39)']];
  cols.forEach(col => {
    // Image cell: first image in the card
    const thumbImg = col.querySelector('.thumb img');
    const imageCell = thumbImg || '';

    // Textual cell
    const content = [];
    // Title: as in example, styled as heading (bold)
    const desc = col.querySelector('.caption .desc');
    if (desc && desc.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = desc.textContent.trim();
      content.push(strong);
    }
    // Date: add as a <p> below title (if present)
    const date = col.querySelector('.button-group .promotion-valid');
    if (date && date.textContent.trim()) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      content.push(dateP);
    }
    // CTA: the 'Read More' link (if present)
    const cta = col.querySelector('.button-group a.btn-primary');
    if (cta) {
      content.push(cta);
    }
    cells.push([imageCell, content]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
