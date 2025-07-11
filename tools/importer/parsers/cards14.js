/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards14)'];

  // Utility to extract content for each card
  function extractCard(col) {
    // Image
    let img = null;
    const figure = col.querySelector('figure');
    if (figure) {
      const thumb = figure.querySelector('.thumb');
      if (thumb) {
        img = thumb.querySelector('img');
      }
    }
    // Text content container
    const textContent = document.createElement('div');
    // Title (h3.title-2)
    const title = figure && figure.querySelector('h3.title-2');
    if (title) {
      textContent.appendChild(title);
    }
    // Description (desc p.text-default)
    const desc = figure && figure.querySelector('.desc');
    if (desc) {
      // append all children (e.g. <p>, which could be more than one)
      Array.from(desc.children).forEach(node => textContent.appendChild(node));
    }
    // CTA (button-group > a)
    const buttonGroup = figure && figure.querySelector('.button-group');
    if (buttonGroup) {
      Array.from(buttonGroup.children).forEach(a => textContent.appendChild(a));
    }
    return [img, textContent];
  }

  // Each immediate child div represents a card column
  const cols = element.querySelectorAll(':scope > div');
  const rows = [headerRow];
  cols.forEach(col => {
    rows.push(extractCard(col));
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
