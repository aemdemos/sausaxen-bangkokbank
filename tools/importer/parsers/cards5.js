/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards5) block: header is 1 column, all card rows are 2 columns
  const ul = element.querySelector('ul');
  if (!ul) return;
  const items = Array.from(ul.children).filter(li => li.nodeType === 1);
  // Prepare rows: each is [image/icon(blank), text content]
  const rows = items.map(li => {
    // Collect all child nodes (including <a> and any possible text)
    const content = Array.from(li.childNodes).filter(node => {
      // Include all text nodes and element nodes
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
    // If empty (shouldn't happen), fallback to textContent
    const cellContent = content.length > 0 ? content : [document.createTextNode(li.textContent.trim())];
    return ['', cellContent];
  });
  // The header row is EXACTLY one column
  const cells = [['Cards (cards5)'], ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
