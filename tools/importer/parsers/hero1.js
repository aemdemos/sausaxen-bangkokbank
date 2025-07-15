/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name exactly as specified in the requirements
  const headerRow = ['Hero (hero1)'];

  // 2. Background image row: use the first <img> in the block as the image
  let backgroundImg = element.querySelector('img[src]');
  const backgroundRow = [backgroundImg ? backgroundImg : ''];

  // 3. Content row: Gather all text content (headings, paragraphs) from .caption .inner-container
  let contentElements = [];
  const captionInner = element.querySelector('.caption .inner-container');
  if (captionInner) {
    // Gather all direct children of .caption .inner-container
    const directChildren = Array.from(captionInner.children);
    directChildren.forEach(child => {
      // For each child (desktop-banner and mobile-banner), extract its children
      contentElements.push(...Array.from(child.children));
    });
  }
  // Fallback: if nothing found, use .caption directly
  if (contentElements.length === 0) {
    const caption = element.querySelector('.caption');
    if (caption) {
      contentElements = Array.from(caption.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, strong, em'));
    }
  }

  // Guarantee at least an empty string if we couldn't find anything
  const contentRow = [contentElements.length > 0 ? contentElements : ''];

  // 4. Compose table rows
  const rows = [headerRow, backgroundRow, contentRow];

  // 5. Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
