/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row, matching the example exactly
  const headerRow = ['Accordion (accordion11)'];
  const rows = [headerRow];

  // Select all accordion items
  const accordionItems = element.querySelectorAll('.collapse-item');
  accordionItems.forEach((item) => {
    // Title: the .collapse-header element (as-is, preserving formatting)
    const header = item.querySelector('.collapse-header');

    // Content: the main content container within .collapse-inner
    // Prefer .editor, fallback to .collapse-inner excluding the header
    const inner = item.querySelector('.collapse-inner');
    let content = inner.querySelector('.editor');
    if (!content) {
      // If there is no .editor, use all children of .collapse-inner except header and empty span
      // Put these nodes into a DocumentFragment
      const fragment = document.createDocumentFragment();
      Array.from(inner.childNodes).forEach((child) => {
        // skip empty text nodes and empty spans
        if (
          (child.nodeType === 3 && !child.textContent.trim()) ||
          (child.nodeType === 1 && child.tagName === 'SPAN' && !child.textContent.trim())
        ) {
          return;
        }
        // skip .collapse-header if for some reason it's present
        if (child.nodeType === 1 && child.classList.contains('collapse-header')) {
          return;
        }
        fragment.appendChild(child);
      });
      content = fragment.childNodes.length ? fragment : document.createTextNode('');
    }
    rows.push([header, content]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
