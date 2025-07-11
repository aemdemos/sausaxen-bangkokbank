/* global WebImporter */
export default function parse(element, { document }) {
  // The table header row, matching the block name and variant
  const headerRow = ['Columns (columns45)'];

  // Get the left column content (all content except the image)
  // Find the left side .content
  const leftCol = element.querySelector('.content');
  // Reference the actual .content element as the cell (not clone)

  // Get the right column image (from .thumb background-image)
  const thumbDiv = element.querySelector('.thumb');
  let rightImg = '';
  if (thumbDiv) {
    const style = thumbDiv.getAttribute('style') || '';
    // Extract URL from background-image
    const match = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1];
      img.alt = '';
      rightImg = img;
    }
  }

  // Compose the data rows as per the example: header, then a single row with two columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCol, rightImg]
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
