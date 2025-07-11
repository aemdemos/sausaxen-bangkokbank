/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all direct children (elements and text) from element
  let content = Array.from(element.childNodes).filter(node =>
    node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
  );

  // If there's a single container (like .inner-container), extract its contents
  if (content.length === 1 && content[0].nodeType === Node.ELEMENT_NODE && content[0].childNodes.length > 0) {
    content = Array.from(content[0].childNodes).filter(node =>
      node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
    );
  }

  // Build the table so the header row is a single column (matching the spec!)
  // The card row is still two columns, per the block structure
  const cells = [
    ['Cards (cards26)'],
    ['', content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}