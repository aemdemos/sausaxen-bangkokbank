/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards54)'];
  const cells = [headerRow];

  // Find the card containers
  const row = element.querySelector('.row');
  if (!row) return;
  const cardDivs = row.querySelectorAll(':scope > .col-md-4');

  cardDivs.forEach(card => {
    // Image: left cell (should be an <img>)
    let imageEl = null;
    const thumbImg = card.querySelector('.thumb img');
    if (thumbImg) {
      imageEl = thumbImg;
    }

    // Right cell: description, date, link
    const rightCellNodes = [];

    // Description (always present, inside .desc)
    const descDiv = card.querySelector('.caption .desc');
    if (descDiv) {
      // Use existing element, but wrap description as paragraph for clarity
      const para = document.createElement('p');
      para.innerHTML = descDiv.innerHTML.trim();
      rightCellNodes.push(para);
    }

    // Date (inside .promotion-valid)
    const dateP = card.querySelector('.button-group .promotion-valid');
    if (dateP && dateP.textContent.trim()) {
      // Use <div> and keep text, add style to make it less prominent
      const dateDiv = document.createElement('div');
      dateDiv.textContent = dateP.textContent.trim();
      dateDiv.style.fontSize = '0.95em';
      dateDiv.style.color = '#555';
      dateDiv.style.margin = '0.5em 0';
      rightCellNodes.push(dateDiv);
    }

    // CTA link (usually present)
    const cta = card.querySelector('.button-group a');
    if (cta) {
      rightCellNodes.push(cta);
    }

    // Add the row if there's at least image and description
    if (imageEl && rightCellNodes.length > 0) {
      cells.push([
        imageEl,
        rightCellNodes.length === 1 ? rightCellNodes[0] : rightCellNodes
      ]);
    }
  });

  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
