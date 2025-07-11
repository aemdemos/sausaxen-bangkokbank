/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare block header row exactly as in the example
  const cells = [['Cards (cards16)']];

  // Collect all direct content of the block efficiently
  // The block is a navigation/control bar, so we extract all visible and meaningful text (excluding scripts/styles)
  // Reference the original elements directly, not clones
  const contentNodes = [];

  // Grab all direct children for robustness
  const children = Array.from(element.children);
  children.forEach((child) => {
    // If it has visible text (including nested anchors/divs/li/spans), reference the whole child
    if (child.textContent && child.textContent.trim().length > 0) {
      contentNodes.push(child);
    }
  });

  // If no direct children have content, fallback to whole element's text
  if (contentNodes.length === 0) {
    const fallbackText = element.textContent.trim();
    if (fallbackText) {
      const p = document.createElement('p');
      p.textContent = fallbackText;
      contentNodes.push(p);
    }
  }

  // Only add a card row if there's visible content
  if (contentNodes.length > 0) {
    cells.push([contentNodes.length === 1 ? contentNodes[0] : contentNodes]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}