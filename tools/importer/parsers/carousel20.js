/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Carousel (carousel20)'];
  const rows = [headerRow];

  // Get all slides
  const slideElements = element.querySelectorAll('.slick-track > .slick-slide');

  slideElements.forEach(slide => {
    const item = slide.querySelector('.item');
    if (!item) return;

    // --- Image Cell ---
    let imageEl = null;
    // Use the active picture's img as the main image
    const activeImg = item.querySelector('.imgContainer .active img');
    if (activeImg && activeImg.src) {
      imageEl = activeImg;
    } else {
      // fallback to any image inside .imgContainer
      const fallbackImg = item.querySelector('.imgContainer img');
      if (fallbackImg && fallbackImg.src) {
        imageEl = fallbackImg;
      }
    }

    // --- Text/Content Cell ---
    const desc = item.querySelector('.item-desc');
    let cellContent = [];
    if (desc) {
      // The main block link wraps the meta, h3, p
      const mainLink = desc.querySelector('a:not(.btn-primary)');
      if (mainLink) {
        // Promotion tag (optional)
        const meta = mainLink.querySelector('.item_meta');
        if (meta) cellContent.push(meta);
        // Title (h3, required if present)
        const title = mainLink.querySelector('h3');
        if (title) cellContent.push(title);
        // Description (p)
        const para = mainLink.querySelector('p');
        if (para) cellContent.push(para);
      }
      // CTA button (a.btn-primary)
      const cta = desc.querySelector('a.btn-primary');
      if (cta) cellContent.push(cta);
    }
    
    let contentCell;
    if (cellContent.length === 0) {
      contentCell = '';
    } else if (cellContent.length === 1) {
      contentCell = cellContent[0];
    } else {
      contentCell = cellContent;
    }

    rows.push([
      imageEl || '',
      contentCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
