/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion section element
  const accordionSection = element.querySelector('section[data-accordion]');
  if (!accordionSection) return;

  // Find all .collapse-item elements directly inside the accordion section
  const items = Array.from(accordionSection.querySelectorAll(':scope > .collapse-item'));
  // Fallback: if not direct child, get all descendants
  const collapseItems = items.length ? items : Array.from(accordionSection.querySelectorAll('.collapse-item'));

  const cells = [];
  // Always use the exact header from the requirements
  const headerRow = ['Accordion (accordion50)'];
  cells.push(headerRow);

  collapseItems.forEach(item => {
    // Title cell: the header div textContent
    const headerEl = item.querySelector('.collapse-header');
    // Content cell: the .collapse-inner DIV (contains the full content)
    const contentEl = item.querySelector('.collapse-inner');
    if (!headerEl || !contentEl) return; // skip malformed

    // Use trimmed textContent for header, reference the actual DOM element for content
    cells.push([
      headerEl.textContent.trim(),
      contentEl
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire accordion section with the block table
  accordionSection.replaceWith(block);
}
