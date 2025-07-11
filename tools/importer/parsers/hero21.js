/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract background image URL from style attribute
  function getBackgroundImageUrl(div) {
    if (!div) return null;
    const style = div.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
    return match ? match[1] : null;
  }

  // Get background image from .thumb-full (prefer .large if present)
  const bgDiv = element.querySelector('.thumb-full.large') || element.querySelector('.thumb-full');
  const bgImgUrl = getBackgroundImageUrl(bgDiv);

  // Only create an <img> if background image exists
  let bgImgElem = '';
  if (bgImgUrl) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgImgUrl;
    bgImgElem.alt = '';
  }

  // Get content from desktop variant if present, else mobile
  let contentInner = element.querySelector('.inner-container.desktop-tools .inner');
  if (!contentInner) {
    contentInner = element.querySelector('.inner-container.mobile-tools .inner');
  }

  // Gather all direct children of contentInner into an array in document order
  const contentParts = [];
  if (contentInner) {
    Array.from(contentInner.children).forEach(child => {
      contentParts.push(child);
    });
  }

  // Compose the table rows as per spec
  const cells = [
    ['Hero (hero21)'],
    [bgImgElem],
    [contentParts]
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
