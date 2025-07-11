/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get the currently active year carousel slides
  function getActiveCarouselSlides() {
    const stories = element.querySelector('article.stories');
    if (!stories) return [];
    const section = stories.querySelector('section[data-tab-content]');
    if (!section) return [];
    const activeInner = section.querySelector('.inner.active');
    if (!activeInner) return [];
    const carousel = activeInner.querySelector('[data-carousel]');
    if (!carousel) return [];
    // Only real slides (not slick-cloned)
    return Array.from(carousel.querySelectorAll('.slick-slide')).filter(slide => !slide.classList.contains('slick-cloned'));
  }

  const cells = [['Carousel (carousel32)']];
  const slides = getActiveCarouselSlides();

  slides.forEach((slide) => {
    // No images per slide, so first cell is blank
    let leftCell = '';
    let rightCell = '';
    const caption = slide.querySelector('.caption.editor');
    if (caption) {
      // Create a fragment that references all non-empty, visible content
      const frag = document.createElement('div');
      // Move all non-empty nodes, preserving ul, li, br, and text nodes
      Array.from(caption.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName === 'P' && !node.textContent.trim()) {
            // skip empty paragraphs
            return;
          }
          if ((node.nodeName === 'P' || node.nodeName === 'BR' || node.nodeName === 'UL' || node.nodeName === 'LI')) {
            frag.appendChild(node);
            return;
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.trim()) {
            frag.appendChild(document.createTextNode(node.textContent));
          }
        }
      });
      // If there's still no content, fallback to caption's textContent
      if (!frag.textContent.trim()) {
        frag.textContent = caption.textContent.trim();
      }
      // If fragment ends up empty (all empty), set blank string
      rightCell = frag.childNodes.length ? frag : '';
    }
    cells.push([leftCell, rightCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
