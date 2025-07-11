/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image URL from the style attribute
  const style = element.getAttribute('style') || '';
  let imageUrl = null;
  const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
  if (match && match[1]) {
    imageUrl = match[1];
    // If the URL is relative, convert to absolute
    if (imageUrl.startsWith('/')) {
      const a = document.createElement('a');
      a.href = imageUrl;
      imageUrl = a.href;
    }
  }

  let imageEl = '';
  if (imageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imageUrl;
    imageEl.alt = '';
  }

  // Create the rows for the block table
  const headerRow = ['Hero (hero22)'];
  const imageRow = [imageEl];
  const contentRow = ['']; // No heading, subheading, or CTA in this HTML

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
