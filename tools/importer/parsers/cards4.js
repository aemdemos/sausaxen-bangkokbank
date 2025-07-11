/* global WebImporter */
export default function parse(element, { document }) {
  // Find the active tab's .inner
  const activeInner = element.querySelector('.inner.active');
  if (!activeInner) return;
  const row = activeInner.querySelector('.row');
  if (!row) return;
  const cardCols = Array.from(row.children).filter(col => col.classList.contains('col-md-4'));

  const cells = [];
  cells.push(['Cards (cards4)']);

  cardCols.forEach(col => {
    // Get the card container
    const card = col.querySelector('.thumb-default.full');
    if (!card) return;
    // Get the image (first img inside .thumb)
    const thumb = card.querySelector('.thumb');
    let img = null;
    if (thumb) {
      img = thumb.querySelector('img');
    }
    // Get description, date, and CTA
    const desc = card.querySelector('.caption .desc');
    const date = card.querySelector('.button-group p');
    const cta = card.querySelector('.button-group a.btn-primary');

    // Build the text block as a single element
    const textDiv = document.createElement('div');
    if (desc) {
      // Use strong for semantic heading inside the card text cell
      const strong = document.createElement('strong');
      strong.innerHTML = desc.innerHTML;
      textDiv.appendChild(strong);
    }
    if (date) {
      textDiv.appendChild(document.createElement('br'));
      textDiv.appendChild(document.createTextNode(date.textContent.trim()));
    }
    if (cta) {
      textDiv.appendChild(document.createElement('br'));
      textDiv.appendChild(cta);
    }
    cells.push([img, textDiv]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
