/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion <section> within the provided element
  const section = element.querySelector('section[data-accordion]');
  if (!section) return;

  // Find all accordion items (direct children of the section)
  const items = Array.from(section.querySelectorAll(':scope > .collapse-item'));

  // Prepare the block table rows
  const rows = [['Accordion (accordion6)']];

  // For each accordion item, extract title and content
  items.forEach(item => {
    // Title cell: text content of the .collapse-header
    const header = item.querySelector('.collapse-header');
    let titleCell = '';
    if (header) {
      titleCell = header.textContent.trim();
    }

    // Content cell: .collapse-inner's child nodes, referencing existing elements
    const collapseInner = item.querySelector('.collapse-inner');
    let contentCell = '';
    if (collapseInner) {
      // Only include non-empty, non-redundant content
      // We'll collect all non-empty elements except empty <span>
      const children = Array.from(collapseInner.childNodes).filter(child => {
        if (child.nodeType === 1 && child.tagName === 'SPAN' && !child.textContent.trim()) return false;
        if (child.nodeType === 3 && !child.textContent.trim()) return false;
        return true;
      });
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        // Group multiple existing elements in a fragment
        const frag = document.createDocumentFragment();
        children.forEach(ch => frag.appendChild(ch));
        contentCell = frag;
      } else {
        contentCell = '';
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion section with the new table block
  section.replaceWith(table);
}
