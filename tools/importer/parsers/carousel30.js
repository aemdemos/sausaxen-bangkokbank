/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row
  const headerRow = ['Carousel (carousel30)'];
  const rows = [headerRow];

  // Find main carousel slides container
  const sliderFor = element.querySelector('.slider-for');
  if (!sliderFor) return;

  // Select all slides
  const slideItems = sliderFor.querySelectorAll('.item');
  slideItems.forEach((item) => {
    // First column: media (img or iframe as link)
    let mediaCell = '';
    const img = item.querySelector('img');
    if (img) {
      mediaCell = img;
    } else {
      const iframe = item.querySelector('iframe');
      if (iframe && iframe.src) {
        // Per requirements, iframe should become a link
        const a = document.createElement('a');
        a.href = iframe.src;
        a.textContent = iframe.src;
        mediaCell = a;
      }
    }
    // Second column: all other content (if any) from the slide except the media
    let textCell = '';
    // Collect all element children that are not the media container
    const extraNodes = [];
    Array.from(item.children).forEach((child) => {
      if (!child.classList.contains('custom-video') && !child.classList.contains('embed-player')) {
        extraNodes.push(child);
      }
    });
    // Also collect any direct text nodes that are not only whitespace
    Array.from(item.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        extraNodes.push(node);
      }
    });
    if (extraNodes.length === 1) {
      textCell = extraNodes[0];
    } else if (extraNodes.length > 1) {
      textCell = extraNodes;
    }
    // Add the slide row
    rows.push([mediaCell, textCell]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
