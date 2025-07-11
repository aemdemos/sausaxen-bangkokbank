/* global WebImporter */
export default function parse(element, { document }) {
  // Get banner and thumbnail containers
  const bannerList = element.querySelector('.banner_container');
  const thumbnailList = element.querySelector('.thumbnail_outer ul.thumbnail_container');
  if (!bannerList || !thumbnailList) return;

  // Build a thumbnail lookup: data-map-id => image URL
  const thumbMap = {};
  thumbnailList.querySelectorAll('li').forEach(li => {
    const id = li.getAttribute('data-map-id');
    const imgDiv = li.querySelector('.img-container');
    if (imgDiv && imgDiv.style.backgroundImage) {
      const match = imgDiv.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
      if (match && id) thumbMap[id] = match[1];
    }
  });

  // Prepare rows (first row is the block header)
  const rows = [['Cards (cards15)']];

  bannerList.querySelectorAll('li').forEach(cardLi => {
    // Find image src (prefer thumbnail, fallback to desktop bg)
    const dataId = cardLi.getAttribute('data-id');
    let imgSrc = thumbMap[dataId];
    if (!imgSrc) {
      const bgDiv = cardLi.querySelector('.banner_container_desktop_img');
      if (bgDiv && bgDiv.style.backgroundImage) {
        const match = bgDiv.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
        if (match) imgSrc = match[1];
      }
    }
    if (!imgSrc) return; // skip cards that lack an image
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = '';

    // Get content: prefer desktop .home_page_banner_content_inner, fallback to mobile
    let contentRoot = cardLi.querySelector('.home_page_banner_content_desktop .home_page_banner_content_inner');
    if (!contentRoot) contentRoot = cardLi.querySelector('.home_page_banner_content_mobile .home_page_banner_content_inner');
    if (!contentRoot) return;

    // Compose the text cell
    const textCell = [];
    // Title (h1)
    const h1 = contentRoot.querySelector('h1');
    if (h1) {
      // If h1 contains an <img>, use as-is for branding; else, wrap the heading in <strong>
      if (h1.querySelector('img')) {
        textCell.push(h1);
      } else {
        const strong = document.createElement('strong');
        strong.innerHTML = h1.innerHTML; // preserve <br> and formatting
        textCell.push(strong);
      }
    }
    // Description (first <p>)
    const p = contentRoot.querySelector('p');
    if (p) {
      if (textCell.length) textCell.push(document.createElement('br'));
      textCell.push(p);
    }
    // CTA (first <a.btn-primary>)
    const cta = contentRoot.querySelector('a.btn-primary');
    if (cta) {
      textCell.push(document.createElement('br'));
      textCell.push(cta);
    }
    // Only include card row if there is at least a heading or description
    if (textCell.length > 0) {
      rows.push([img, textCell]);
    }
  });

  // Only replace if there are rows beyond header
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
