/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matching the spec
  const headerRow = ['Hero (hero10)'];

  // --------
  // Row 2: Background image (prefer desktop, fallback to mobile), use existing <img> element
  let bgImgEl = null;
  let imgCandidates = element.querySelectorAll('.thumb img');
  if (imgCandidates.length > 0) {
    bgImgEl = imgCandidates[0];
  }

  // --------
  // Row 3: All text content (combine desktop and mobile banners, preserving tags and line breaks)
  let textCellContent = [];
  const caption = element.querySelector('.caption');
  if (caption) {
    // There is always an .inner-container, containing both desktop and mobile banners (if present)
    const inner = caption.querySelector('.inner-container');
    if (inner) {
      // Get all direct children (desktop-banner and mobile-banner)
      const banners = Array.from(inner.children);
      for (let banner of banners) {
        // For each child node (not just elements), preserve text formatting
        Array.from(banner.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
            textCellContent.push(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // For plain text nodes, wrap in a <span> to preserve text
            const span = document.createElement('span');
            span.textContent = node.textContent;
            textCellContent.push(span);
          }
        });
      }
    }
  }

  // If nothing found, fallback to all text content (should not happen)
  if (!textCellContent.length) {
    textCellContent = [document.createTextNode(element.textContent.trim())];
  }

  // --------
  // Compose table
  const cells = [
    headerRow,
    [bgImgEl || ''],
    [textCellContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
