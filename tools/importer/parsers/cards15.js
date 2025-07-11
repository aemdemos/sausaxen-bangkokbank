/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main card/banner container
  const bannerList = element.querySelector('ul.banner_container');
  if (!bannerList) return;

  const cardLis = Array.from(bannerList.querySelectorAll(':scope > li'));
  const rows = [['Cards (cards15)']];

  cardLis.forEach((li) => {
    // Extract the content block for the card
    let contentBlock = li.querySelector('.home_page_banner_content_desktop .home_page_banner_content_inner')
      || li.querySelector('.home_page_banner_content_mobile .home_page_banner_content_inner')
      || li.querySelector('.home_page_banner_content_inner');
    if (!contentBlock) return;

    // Get all content inside contentBlock (preserving all text, links, markup)
    const textDiv = document.createElement('div');
    Array.from(contentBlock.childNodes).forEach((node) => {
      // Reference existing nodes (do not clone)
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        textDiv.appendChild(node);
      }
    });
    // If textDiv is empty, skip
    if (!textDiv.textContent.trim()) return;

    // Extract image (prefer desktop, fallback to mobile)
    let imgUrl = null;
    let imgDiv = li.querySelector('.banner_container_desktop_img') || li.querySelector('.banner_container_mobile_img');
    if (imgDiv && imgDiv.style.backgroundImage) {
      const match = imgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) imgUrl = match[1];
    }
    let imgElem = null;
    if (imgUrl) {
      imgElem = document.createElement('img');
      imgElem.src = imgUrl;
      imgElem.alt = '';
    }
    if (!imgElem) return;

    rows.push([imgElem, textDiv]);
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
