/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion section
  const accordion = element.querySelector('section[data-accordion]');
  if (!accordion) return;

  // Get all collapse-item blocks (each accordion item)
  // These are the direct children of the accordion section
  let collapseItems = accordion.querySelectorAll(':scope > .collapse-item');
  // If not found, try deeper: covers cases where collapse-items are nested further
  if (!collapseItems.length) {
    collapseItems = accordion.querySelectorAll('.collapse-item');
  }

  const rows = [];
  // Header row - must match the exact block name
  rows.push(['Accordion (accordion17)']);

  // For each collapse item, grab title and body
  collapseItems.forEach((item) => {
    // Title is in .collapse-header
    const header = item.querySelector('.collapse-header');
    // Content is in .collapse-inner
    const inner = item.querySelector('.collapse-inner');
    let titleCell = '';
    let contentCell = '';
    if (header) titleCell = header;
    if (inner) {
      // Find the content element(s) inside collapse-inner
      // Prefer 'text-default editor', but include all children except empty spans
      const contentCandidates = Array.from(inner.childNodes).filter(node => {
        // Keep elements that are not empty spans
        if (node.nodeType === 1) {
          if (node.tagName === 'SPAN' && !node.textContent.trim()) return false;
          return true;
        }
        // Keep text nodes if not just whitespace
        if (node.nodeType === 3) {
          return node.textContent.trim().length > 0;
        }
        return false;
      });
      
      // If there is only one content candidate, use that
      if (contentCandidates.length === 1) {
        contentCell = contentCandidates[0];
      } else if (contentCandidates.length > 1) {
        // If multiple, put them all in an array so createTable will append them
        contentCell = contentCandidates;
      } else {
        // fallback to the whole inner if above not found
        contentCell = inner;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
