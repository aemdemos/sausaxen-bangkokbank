/* global WebImporter */
export default function parse(element, { document }) {
  // Find the currently active inner block with cards
  const activeInner = element.querySelector('.inner.active');
  if (!activeInner) return;
  // Cards are inside .row-left, but sometimes may be direct children
  const rowLeft = activeInner.querySelector('.row-left') || activeInner;
  const cards = Array.from(rowLeft.querySelectorAll(':scope > .col-md-4'));

  // Table header row as in the example
  const rows = [['Cards (cards39)']];

  cards.forEach(card => {
    // === IMAGE CELL ===
    // Use the actual <img> element from the card if available
    let imgCell = null;
    const img = card.querySelector('.thumb img');
    if (img) imgCell = img;

    // === TEXT CELL ===
    // Use a <div> to wrap the elements as a cell block
    const textDiv = document.createElement('div');

    // Title - from .caption .desc, styled as <strong> (visually closest to example)
    const desc = card.querySelector('.caption .desc');
    if (desc && desc.textContent && desc.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = desc.textContent.trim();
      textDiv.appendChild(strong);
    }

    // Description is not separate: only a title in this HTML
    // But sometimes there could be additional description (not here)

    // Date (if any)
    const date = card.querySelector('.button-group p');
    if (date && date.textContent && date.textContent.trim()) {
      const dateDiv = document.createElement('div');
      dateDiv.textContent = date.textContent.trim();
      textDiv.appendChild(document.createElement('br'));
      textDiv.appendChild(dateDiv);
    }

    // CTA link (if any)
    const cta = card.querySelector('.button-group a');
    if (cta) {
      textDiv.appendChild(document.createElement('br'));
      textDiv.appendChild(cta);
    }

    rows.push([imgCell, textDiv]);
  });

  // Create table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
