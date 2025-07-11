/* global WebImporter */
export default function parse(element, { document }) {
  // Find all cards
  const cardCols = element.querySelectorAll(':scope .row > .col-md-4');
  const rows = [];
  // Block header (matches exactly)
  rows.push(['Cards (cards44)']);

  cardCols.forEach((col) => {
    // Get image element, prefer the <img>, fallback to background style
    let imgEl = col.querySelector('.img-print');
    if (!imgEl) {
      const thumbDiv = col.querySelector('.thumb');
      if (thumbDiv && thumbDiv.style.backgroundImage) {
        const urlMatch = thumbDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          const fallbackImg = document.createElement('img');
          fallbackImg.src = urlMatch[1];
          imgEl = fallbackImg;
        }
      }
    }

    // Text content cell
    const textCell = document.createElement('div');
    // Title (as heading)
    const titleEl = col.querySelector('.caption .title-3');
    if (titleEl) {
      textCell.appendChild(titleEl);
    }
    // There is no description, but CTA link is present
    const ctaLink = col.querySelector('.button-group a');
    if (ctaLink) {
      textCell.appendChild(ctaLink);
    }
    // Add the row: [image, text content]
    rows.push([
      imgEl || '',
      textCell
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
