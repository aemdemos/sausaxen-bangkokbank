/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion section
  const section = element.querySelector('section[data-accordion]');
  if (!section) return;

  // Find all .collapse-item (these are the accordion entries)
  const items = Array.from(section.querySelectorAll(':scope > .collapse-item'));

  // Start table rows with header
  const rows = [['Accordion (accordion6)']];

  items.forEach(item => {
    // Title cell: the .collapse-header element (reference directly)
    const header = item.querySelector(':scope > .collapse-header');
    let titleCell = header || '';

    // Content cell: the .collapse-inner > .text-default.editor (reference directly)
    let contentCell = '';
    const inner = item.querySelector(':scope > .collapse-inner');
    if (inner) {
      // Only use direct child .text-default.editor elements as content
      const contentBlocks = Array.from(inner.querySelectorAll(':scope > .text-default.editor'));
      if (contentBlocks.length === 1) {
        contentCell = contentBlocks[0];
      } else if (contentBlocks.length > 1) {
        contentCell = contentBlocks;
      } else {
        // fallback: check for any non-empty text node or other element
        // (Some entries might be 'None' inside a <p> or raw text)
        const alt = Array.from(inner.childNodes).filter(n => {
          if (n.nodeType === Node.ELEMENT_NODE) {
            return !(n.tagName === 'SPAN' && n.textContent.trim() === '');
          } else if (n.nodeType === Node.TEXT_NODE) {
            return n.textContent.trim();
          }
          return false;
        });
        if (alt.length === 1) {
          contentCell = alt[0];
        } else if (alt.length > 1) {
          contentCell = alt;
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
