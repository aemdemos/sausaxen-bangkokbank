/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards46)'];
  const cardRows = [];
  // Each card is a .col-md-3
  const cards = element.querySelectorAll(':scope > .col-md-3');
  cards.forEach(card => {
    // Find the image element (keep the original reference)
    const img = card.querySelector('img');

    // Find the title element
    const titleEl = card.querySelector('.caption.editor h3');
    let titleNode = null;
    if (titleEl) {
      // Use a <strong> to mimic the heading styling in cards
      titleNode = document.createElement('strong');
      titleNode.textContent = titleEl.textContent.trim();
    }

    // There is no description in the HTML cards, so nothing for description

    // Find the button/link element (keep the original reference)
    const link = card.querySelector('.button-group a');
    let linkNode = null;
    if (link) {
      // Use the original link, but only reference, don't clone
      linkNode = link;
      linkNode.textContent = link.textContent.trim();
      // Remove wrapping <p> if present for clean output (optional but cleans up)
      const p = linkNode.querySelector('p');
      if (p) {
        linkNode.innerHTML = p.textContent;
      }
    }

    // Compose right cell: Title (strong), link below
    const contentCell = [];
    if (titleNode) contentCell.push(titleNode);
    if (linkNode) {
      // Add a <br> between the title and the button for clarity, if both present
      if (contentCell.length) contentCell.push(document.createElement('br'));
      contentCell.push(linkNode);
    }

    // Add this card's row to the table
    cardRows.push([
      img,
      contentCell
    ]);
  });

  // Compose the final table
  const tableCells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the element with the block table
  element.replaceWith(block);
}
