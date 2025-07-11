/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion section
  const accordionSection = element.querySelector('section[data-accordion]');
  if (!accordionSection) return;

  // Find all the accordion items directly under the section
  const items = Array.from(accordionSection.querySelectorAll(':scope > .collapse-item'));

  // Compose the table rows: header row, then one row per accordion item
  const rows = [];
  // Header row must exactly match the example
  rows.push(['Accordion (accordion50)']);

  items.forEach(item => {
    // Title cell: extract text from .collapse-header (should be string)
    const header = item.querySelector(':scope > .collapse-header');
    // Content cell: reference the .collapse-inner content element
    const inner = item.querySelector(':scope > .collapse-inner');

    // Prepare title (always string or empty string if missing)
    const title = header ? header.textContent.trim() : '';
    // Prepare content: find the main editor area for content, else fallback to .collapse-inner
    let content = null;
    if (inner) {
      const editor = inner.querySelector('.text-default.editor');
      if (editor) {
        content = editor;
      } else {
        // Fallback: use all children except empty spans for resilience
        const nodes = Array.from(inner.childNodes).filter(n => {
          if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'SPAN' && !n.textContent.trim()) return false;
          return true;
        });
        // If only one node, reference that, else array
        content = (nodes.length === 1) ? nodes[0] : nodes;
      }
    } else {
      content = '';
    }
    rows.push([title, content]);
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
