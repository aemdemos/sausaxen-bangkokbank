/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> with images
  const ul = element.querySelector('ul.thumbnail_container');
  if (!ul) return;
  // Get all first-level li children (direct children of ul)
  const lis = ul.querySelectorAll(':scope > li');

  // For each li, collect ALL content (not just image)
  // But in this HTML, only .img-container exists within each li
  // So, for proper extensibility and to match example, wrap the .img-container div itself
  const columns = Array.from(lis).map(li => {
    // If li has multiple children, collect all as an array, else just the .img-container
    const children = Array.from(li.childNodes).filter(n => !(n.nodeType === 3 && !n.textContent.trim()));
    // If there's only one child, just return it directly; otherwise, return array
    if (children.length === 1) return children[0];
    return children;
  });

  // Edge case: if no columns, do not replace
  if (columns.length === 0) return;

  // Block header should match the example: 'Columns (columns24)'
  const headerRow = ['Columns (columns24)'];
  const contentRow = columns;
  const cells = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
