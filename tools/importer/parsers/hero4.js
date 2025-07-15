/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Hero (hero4)'];

  // 2nd row: Background image from style attribute
  let bgImgRow = [''];
  const bgDiv = element.querySelector('.thumb-full');
  if (bgDiv) {
    const style = bgDiv.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1].replace(/(^"|"$)/g, '');
      img.alt = '';
      bgImgRow = [img];
    }
  }

  // 3rd row: Gather all text content relevant to the hero from source HTML
  // Prefer .desktop-tools .inner; if not found, fallback to .mobile-tools .inner; if not found, to .inner
  let contentContainer = element.querySelector('.desktop-tools .inner')
    || element.querySelector('.mobile-tools .inner')
    || element.querySelector('.inner');

  let contentCell = [''];
  if (contentContainer) {
    // Remove duplicate .inner in mobile/desktop if they are in the same parent
    // (not needed here since querySelector finds only one)
    contentCell = [contentContainer];
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentCell,
  ], document);

  element.replaceWith(table);
}
