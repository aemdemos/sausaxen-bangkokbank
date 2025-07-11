/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row matching the required block name
  const headerRow = ['Accordion (accordion36)'];

  // Find all accordion items (collapse-item class)
  const items = Array.from(element.querySelectorAll(':scope > .collapse-item'));
  const rows = [headerRow];

  items.forEach((item) => {
    // Get the header (title) element
    const header = item.querySelector(':scope > .collapse-header');
    const titleCell = header || '';

    // Get the content (collapse-inner)
    const inner = item.querySelector(':scope > .collapse-inner');
    let contentCell = '';
    if (inner) {
      // Gather all content except empty spans, button groups, and whitespace
      const nodes = Array.from(inner.childNodes).filter((n) => {
        // Remove empty text
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') return false;
        // Remove empty span
        if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'SPAN' && n.textContent.trim() === '' && !n.children.length) return false;
        // Remove button-group
        if (n.nodeType === Node.ELEMENT_NODE && n.classList.contains('button-group')) return false;
        return true;
      });
      // If only one node, use as is, else as array
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else if (nodes.length > 1) {
        contentCell = nodes;
      } else {
        contentCell = '';
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
