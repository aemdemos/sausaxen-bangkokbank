/* global WebImporter */
export default function parse(element, { document }) {
  // Compose all visible content within the nav/control bar into a single card, preserving semantics
  // Header row must match exactly
  const cells = [['Cards (cards2)']];

  // Create a container for the card text content
  const cardDiv = document.createElement('div');

  // 1. Add the back button link, if present
  const backBtn = element.querySelector('.btn-back');
  if (backBtn) cardDiv.appendChild(backBtn);

  // 2. Add the visible section name text (About Capital Markets), if present
  const sectionName = element.querySelector('#spFirstSectionName');
  if (sectionName) {
    // Use bold to highlight (as it functions as a heading in this bar)
    const strong = document.createElement('strong');
    strong.textContent = sectionName.textContent.trim();
    cardDiv.appendChild(document.createElement('br'));
    cardDiv.appendChild(strong);
  }

  // 3. Add the tab/section link list (the nav tabs)
  const sectionList = element.querySelector('#ulSectionTitles');
  if (sectionList) {
    cardDiv.appendChild(document.createElement('br'));
    cardDiv.appendChild(sectionList);
  }

  // Only add the row if there is any content
  if (cardDiv.childNodes.length > 0) {
    cells.push([cardDiv]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
