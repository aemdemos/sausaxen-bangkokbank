/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to resolve relative URLs
  function resolveUrl(url) {
    if (!url) return '';
    const a = document.createElement('a');
    a.href = url;
    return a.href;
  }

  // Find the carousel container inside the provided element
  const carouselContainer = element.querySelector('.tips_insight_carousal_container');
  if (!carouselContainer) return;
  const carousel = carouselContainer.querySelector('.tips_insight_carousal');
  if (!carousel) return;

  // Get all carousel items
  const items = carousel.querySelectorAll('.tips_insight_carousal_item');

  // Prepare the table rows
  const rows = [];
  // Header row, exactly as in example
  rows.push(['Carousel (carousel12)']);

  items.forEach((item) => {
    // --- IMAGE CELL ---
    let imageUrl = '';
    const desktopBg = item.querySelector('.tips_insight_carousal_bg');
    if (desktopBg) {
      const bgStyle = desktopBg.style.backgroundImage;
      const match = bgStyle.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        imageUrl = resolveUrl(match[1]);
      }
    }
    // Fallback to mobile image if desktop not found
    if (!imageUrl) {
      const mobileBg = item.querySelector('.tips_insight_carousal_bg_mobile');
      if (mobileBg) {
        const bgStyle = mobileBg.style.backgroundImage;
        const match = bgStyle.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {
          imageUrl = resolveUrl(match[1]);
        }
      }
    }
    let imgEl = null;
    if (imageUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imageUrl;
      imgEl.loading = 'lazy';
    }
    // --- CONTENT CELL ---
    const content = item.querySelector('.tips_insight_carousal_content');
    let cellContent = [];
    if (content) {
      // Instead of cloning or creating elements, reference children directly
      // Remove hidden <span>s
      Array.from(content.children).forEach((n) => {
        if (n.tagName === 'SPAN' && n.style.display === 'none') return;
        // For badge: use as a <div> (simply reference)
        if (n.classList.contains('tips_insight_carousal_badge')) {
          cellContent.push(n);
        }
        // For title: use as a <h2>
        else if (n.classList.contains('tips_insight_carousal_title')) {
          // Use heading for semantic meaning
          const heading = document.createElement('h2');
          heading.textContent = n.textContent.trim();
          cellContent.push(heading);
        }
        // For CTA button: reference directly in a paragraph for separation
        else if (n.classList.contains('tips_insight_carousal_cta')) {
          const p = document.createElement('p');
          p.appendChild(n);
          cellContent.push(p);
        }
        // Otherwise, if it's any extra element (shouldn't be, but for flexibility)
        else if (n.textContent && n.textContent.trim()) {
          cellContent.push(n);
        }
      });
      // If no child nodes, fallback to text
      if (!cellContent.length && content.textContent.trim()) {
        cellContent = [content.textContent.trim()];
      }
    } else {
      cellContent = [''];
    }
    rows.push([
      imgEl || '',
      cellContent.length === 1 ? cellContent[0] : cellContent
    ]);
  });

  // Build table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace carousel container with block table
  carouselContainer.replaceWith(block);
}
