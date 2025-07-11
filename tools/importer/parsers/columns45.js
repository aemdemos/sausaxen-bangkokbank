/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as required
  const headerRow = ['Columns (columns45)'];

  // Find left column content: .content
  const leftContent = element.querySelector('.content');
  // Find right column background image: .thumb
  const rightThumb = element.querySelector('.thumb');

  // Prepare right column: extract background-image as <img>
  let rightImg = null;
  if (rightThumb && rightThumb.style && rightThumb.style.backgroundImage) {
    const match = rightThumb.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
    if (match && match[2]) {
      rightImg = document.createElement('img');
      rightImg.src = match[2];
      rightImg.alt = '';
    }
  }

  // Defensive: if leftContent is missing, use empty div
  const leftCell = leftContent || document.createElement('div');
  // Defensive: if rightImg is missing, use empty div
  const rightCell = rightImg || document.createElement('div');

  // Table rows: header, then columns
  const cells = [
    headerRow,
    [leftCell, rightCell],
  ];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
