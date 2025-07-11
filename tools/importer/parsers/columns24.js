/* global WebImporter */
export default function parse(element, { document }) {
  // Get the UL containing the thumbnails
  const ul = element.querySelector('ul.thumbnail_container');
  if (!ul) return;
  const lis = Array.from(ul.children);

  // Each LI should provide a column, with an IMG extracted from background-image
  const images = lis.map(li => {
    const imgContainer = li.querySelector('.img-container');
    if (!imgContainer) return '';
    const style = imgContainer.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (!match) return '';
    const img = document.createElement('img');
    img.src = match[1];
    img.loading = 'lazy';
    return img;
  });

  // Header row must be a single cell with block name
  const headerRow = ['Columns (columns24)'];
  // Images row: one image per column in the layout
  const blockTable = WebImporter.DOMUtils.createTable([
    headerRow,
    images
  ], document);
  element.replaceWith(blockTable);
}
