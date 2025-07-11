/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example exactly
  const headerRow = ['Hero (hero10)'];

  // --- IMAGE ROW: Extract the most prominent image ---
  // Look for the first .thumb > img (desktop preferred)
  let imgElem = null;
  const desktopThumb = element.querySelector('.thumb.desktop-banner');
  if (desktopThumb && desktopThumb.querySelector('img')) {
    imgElem = desktopThumb.querySelector('img');
  } else {
    // Fallback: any .thumb > img
    const anyThumb = element.querySelector('.thumb img');
    if (anyThumb) imgElem = anyThumb;
  }
  const imageRow = [imgElem ? imgElem : ''];

  // --- CONTENT ROW: Gather all text content in desktop and mobile captions ---
  // Combine all .caption .desktop-banner and .caption .mobile-banner content
  let contentElems = [];
  const caption = element.querySelector('.caption');
  if (caption) {
    // Find all direct banners inside caption
    caption.querySelectorAll('.desktop-banner, .mobile-banner').forEach(banner => {
      // For each banner, gather all children (headings, paragraphs, etc)
      Array.from(banner.children).forEach(child => {
        contentElems.push(child);
      });
    });
  }
  // Fallback: all headings and paragraphs in .caption if not found
  if (contentElems.length === 0 && caption) {
    caption.querySelectorAll('h1,h2,h3,h4,h5,h6,p').forEach(el => {
      contentElems.push(el);
    });
  }
  // Fallback: all headings/paragraphs in the section if .caption missing
  if (contentElems.length === 0) {
    element.querySelectorAll('h1,h2,h3,h4,h5,h6,p').forEach(el => {
      contentElems.push(el);
    });
  }
  // Final fallback for empty
  const contentRow = [contentElems.length ? contentElems : ''];

  // Build table and replace
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
