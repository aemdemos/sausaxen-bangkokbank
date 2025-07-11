/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get absolute URL for images
  function getAbsoluteUrl(url) {
    const a = document.createElement('a');
    a.href = url;
    return a.href;
  }

  // Find track containing slides
  const track = element.querySelector('.slick-list .slick-track');
  if (!track) return;
  const slides = Array.from(track.children).filter((c) => c.classList.contains('slick-slide'));
  const cells = [
    ['Carousel (carousel20)'],
  ];
  slides.forEach((slide) => {
    // Each slide has a .item
    const item = slide.querySelector('.item');
    if (!item) return;
    // Image: Prefer <img> inside .imgContainer > .active > picture
    let img = null;
    const activeImg = item.querySelector('.imgContainer .active img');
    if (activeImg) {
      // Reference the actual <img> node from the DOM, but adjust src to full URL
      activeImg.src = getAbsoluteUrl(activeImg.src);
      img = activeImg;
      // If there's a desktop source available, prefer that for src
      const picture = activeImg.closest('picture');
      if (picture) {
        const source = picture.querySelector('source[media]');
        if (source && source.srcset) {
          img.src = getAbsoluteUrl(source.srcset);
        }
      }
    }
    // Text content: pull from .item-desc
    const desc = item.querySelector('.item-desc');
    let cell2Content = [];
    if (desc) {
      // The anchor with title and text (ignore the CTA at bottom for now)
      const mainLink = desc.querySelector('a:not(.btn-primary)');
      if (mainLink) {
        // Promotion tag: .item_meta
        const meta = mainLink.querySelector('.item_meta');
        if (meta && meta.textContent.trim()) {
          // Use a <p> for meta/tag
          cell2Content.push(meta);
        }
        // Title: <h3>
        const h3 = mainLink.querySelector('h3');
        if (h3) {
          cell2Content.push(h3);
        }
        // Description: <p>
        const para = mainLink.querySelector('p');
        if (para) {
          cell2Content.push(para);
        }
      }
      // CTA: anchor.btn-primary
      const cta = desc.querySelector('a.btn-primary');
      if (cta) {
        cell2Content.push(cta);
      }
    }
    cells.push([
      img ? img : '',
      cell2Content.length > 0 ? cell2Content : '',
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
