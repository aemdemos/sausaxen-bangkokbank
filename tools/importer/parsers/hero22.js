/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background-image URL from style attribute
  let bgUrl = '';
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
  if (bgMatch && bgMatch[1]) {
    bgUrl = bgMatch[1].startsWith('http') ? bgMatch[1] : `${bgMatch[1].startsWith('/') ? '' : '/'}${bgMatch[1]}`;
  }

  let imgEl = null;
  if (bgUrl) {
    imgEl = document.createElement('img');
    imgEl.src = bgUrl;
    imgEl.alt = '';
  }

  const headerRow = ['Hero (hero22)'];
  // Row 2: image (if present)
  const imageRow = [imgEl ? imgEl : ''];
  // Row 3: content (empty, since provided HTML has no headings or CTAs)
  const contentRow = [''];
  const rows = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
