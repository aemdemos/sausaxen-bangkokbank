/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .col-md-4 column containing the carousel
  let carouselCol = null;
  const directDivs = element.querySelectorAll(':scope > div');
  for (const div of directDivs) {
    if (div.querySelector('.tips_insight_carousal_container')) {
      carouselCol = div;
      break;
    }
  }
  if (!carouselCol) return;

  // Find the carousel container and the actual carousel
  const carousalContainer = carouselCol.querySelector('.tips_insight_carousal_container');
  if (!carousalContainer) return;
  const carousal = carousalContainer.querySelector('.tips_insight_carousal');
  if (!carousal) return;

  // Get all carousal items/slides
  const slideEls = carousal.querySelectorAll('.tips_insight_carousal_item');
  if (!slideEls.length) return;

  // Helper to get the background image URL from a div
  function bgUrlFromDiv(div) {
    if (!div) return null;
    const style = div.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
    if (match && match[1]) {
      // Resolve relative URLs
      const a = document.createElement('a');
      a.href = match[1];
      return a.href;
    }
    return null;
  }

  // Build table rows
  const rows = [['Carousel (carousel12)']];

  for (const slide of slideEls) {
    // 1st cell: Image
    const desktopBgDiv = slide.querySelector('.tips_insight_carousal_bg');
    const mobileBgDiv = slide.querySelector('.tips_insight_carousal_bg_mobile');
    let imgUrl = bgUrlFromDiv(desktopBgDiv) || bgUrlFromDiv(mobileBgDiv);
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.setAttribute('loading', 'lazy');
    }

    // 2nd cell: Compose all text/cta content from .tips_insight_carousal_content
    const contentDiv = slide.querySelector('.tips_insight_carousal_content');
    let cellContent = [];
    if (contentDiv) {
      // Gather all content as per HTML structure, reference elements directly
      // Badge/category
      const badge = Array.from(contentDiv.childNodes).find(el => el.classList && el.classList.contains('tips_insight_carousal_badge'));
      if (badge && badge.textContent.trim()) {
        const badgeDiv = document.createElement('div');
        badgeDiv.textContent = badge.textContent.trim();
        badgeDiv.style.fontWeight = 'bold';
        badgeDiv.style.fontSize = '0.9em';
        cellContent.push(badgeDiv);
      }
      // Title
      const title = Array.from(contentDiv.childNodes).find(el => el.classList && el.classList.contains('tips_insight_carousal_title'));
      if (title && title.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = title.textContent.trim();
        cellContent.push(h2);
      }
      // CTA (link)
      const cta = Array.from(contentDiv.childNodes).find(el => el.tagName === 'A' && el.classList.contains('tips_insight_carousal_cta'));
      if (cta) {
        cellContent.push(cta);
      }
      // In case there is any other (text) content in contentDiv that is not badge/title/cta (edge case)
      // Go through children and add any text nodes
      Array.from(contentDiv.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const textNode = document.createTextNode(node.textContent.trim());
          cellContent.push(textNode);
        }
      });
    }
    rows.push([
      imgEl || '',
      cellContent.length > 0 ? cellContent : ''
    ]);
  }

  // Create the block table with extracted rows
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
