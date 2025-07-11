/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the active year section (the currently visible tab content)
  const activeYearSection = element.querySelector('article.stories section[data-tab-content] > .inner.active');
  if (!activeYearSection) return;

  // 2. Find the carousel container within the active year section
  const carousel = activeYearSection.querySelector('[data-carousel]');
  if (!carousel) return;

  // 3. Extract only the real slides (not slick-cloned)
  let slides = Array.from(carousel.querySelectorAll('.col-md-4.slick-slide'));
  slides = slides.filter(slide => {
    const idx = parseInt(slide.getAttribute('data-slick-index'), 10);
    return !slide.classList.contains('slick-cloned') && idx >= 0;
  });
  if (!slides.length) return;

  // 4. Prepare the header row as in the example
  const cells = [];
  cells.push(['Carousel (carousel32)']);

  // 5. For each slide, populate the table row
  slides.forEach(slide => {
    const caption = slide.querySelector('.caption.editor');
    if (!caption) return;

    // Collect all meaningful content in caption, preserving order, referencing original nodes
    const contentArr = [];
    // Loop through all children, including text nodes
    for (let node = caption.firstChild; node; node = node.nextSibling) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Only include elements with visible text or list items
        if (
          (node.tagName === 'UL' && node.querySelectorAll('li').length) ||
          (node.tagName === 'OL' && node.querySelectorAll('li').length) ||
          (node.textContent && node.textContent.trim())
        ) {
          contentArr.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent && node.textContent.trim()) {
          // Wrap significant text nodes in a <p> (to match HTML semantics)
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          contentArr.push(p);
        }
      }
    }
    // Defensive: fallback to all caption text if empty
    if (!contentArr.length && caption.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = caption.textContent.trim();
      contentArr.push(p);
    }
    if (contentArr.length) {
      cells.push(['', contentArr]);
    }
  });

  // 6. Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
