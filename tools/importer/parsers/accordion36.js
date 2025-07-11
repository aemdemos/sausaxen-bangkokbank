/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches spec
  const headerRow = ['Accordion (accordion36)'];

  // Only consider direct children with class 'collapse-item'
  const items = Array.from(element.querySelectorAll(':scope > .collapse-item'));

  // Edge case: If no items, do nothing
  if (items.length === 0) return;

  // For each collapse-item, extract the header and content
  const rows = items.map(item => {
    // Title cell
    const header = item.querySelector(':scope > .collapse-header');
    let titleCell = '';
    if (header) {
      titleCell = header.textContent.trim();
    }
    // Content cell: all content of .collapse-inner except empty spans and .button-group
    const inner = item.querySelector(':scope > .collapse-inner');
    let contentCell = '';
    if (inner) {
      // Collect only node elements that are not empty <span> or .button-group
      const nodes = Array.from(inner.childNodes).filter(node => {
        // Filter empty <span>
        if (node.nodeType === 1 && node.tagName === 'SPAN' && node.textContent.trim() === '') return false;
        // Filter .button-group
        if (node.nodeType === 1 && node.classList.contains('button-group')) return false;
        // Filter empty text nodes
        if (node.nodeType === 3 && node.textContent.trim() === '') return false;
        return true;
      });
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else if (nodes.length > 1) {
        contentCell = nodes;
      } else {
        contentCell = '';
      }
    }
    return [titleCell, contentCell];
  });

  // Build table rows
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
