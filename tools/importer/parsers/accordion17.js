/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion section
  const section = element.querySelector('section[data-accordion]');
  if (!section) return;

  // Get all collapse-item blocks (each is an accordion row)
  const items = Array.from(section.querySelectorAll('.collapse-item'));

  // Start with the required header row (must match the block exactly)
  const rows = [['Accordion (accordion17)']];

  // For each item, extract the header and the content
  items.forEach(item => {
    // Title cell: the .collapse-header element (keep as element for semantics)
    const titleEl = item.querySelector('.collapse-header');

    // Content cell: the .collapse-inner element (include all children EXCEPT trailing empty span)
    const inner = item.querySelector('.collapse-inner');
    if (!titleEl || !inner) return; // skip row if structure is broken

    // Remove empty trailing <span> in .collapse-inner if it exists
    const contentNodes = Array.from(inner.childNodes).filter((node, idx, arr) => {
      // Only filter out a span if it's empty and is the last node
      if (node.nodeType === 1 && node.tagName === 'SPAN' && !node.textContent.trim()) {
        if (idx === arr.length - 1) return false;
      }
      return true;
    });
    // If there's only one content node, use it directly, else use as array
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;

    rows.push([titleEl, contentCell]);
  });

  // Create the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
