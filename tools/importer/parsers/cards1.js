/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct child cards
  const cardEls = element.querySelectorAll(':scope > .row > .col-md-4');

  // Header row from requirements
  const headerRow = ['Cards (cards1)'];

  // For each card, extract content
  const rows = Array.from(cardEls).map((col) => {
    // 1. Image
    const img = col.querySelector('.thumb img');

    // 2. Title (as h3)
    const title = col.querySelector('.caption .title-3');
    // 3. Call to Action link (label and href)
    const cta = col.querySelector('.button-group a');

    // Build text cell: title (as heading), then CTA link
    const textCell = document.createElement('div');
    if (title) {
      // Use existing element
      textCell.appendChild(title);
    }
    if (cta) {
      // Use the <a> directly (remove inner <p> if present)
      let ctaLink = cta;
      // Remove any <p> wrappers inside the link for clean output
      let linkText = '';
      if (ctaLink.querySelector('p')) {
        linkText = ctaLink.querySelector('p').textContent;
        ctaLink.textContent = linkText;
      }
      textCell.appendChild(ctaLink);
    }
    return [img, textCell];
  });

  // Compose the table data (header + cards)
  const cells = [headerRow, ...rows];

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
