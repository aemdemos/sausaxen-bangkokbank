/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get absolute URL for images
  function absoluteUrl(url) {
    if (!url) return url;
    const a = document.createElement('a');
    a.href = url;
    return a.href;
  }

  // Get the visible banner <li> (first one not display:none)
  const mainImgContainer = element.querySelector('.main-img-container');
  if (!mainImgContainer) return;
  const bannerList = mainImgContainer.querySelector('ul.banner_container');
  if (!bannerList) return;
  const bannerItems = Array.from(bannerList.children);
  let banner = bannerItems.find(li => li.style.display !== 'none');
  if (!banner) return;

  // Extract background image from desktop (prefer), fallback to mobile
  function extractBgUrl(div) {
    if (!div) return null;
    const style = div.getAttribute('style') || '';
    const match = style.match(/background-image: url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/^['"]|['"]$/g, '').trim();
      return absoluteUrl(url);
    }
    return null;
  }
  const desktopImgDiv = banner.querySelector('.banner_container_desktop_img');
  const mobileImgDiv = banner.querySelector('.banner_container_mobile_img');
  let bgImgUrl = extractBgUrl(desktopImgDiv) || extractBgUrl(mobileImgDiv);

  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // Extract all content nodes from desktop content (prefer), else mobile
  let contentBlock = null;
  // Prefer the desktop version if it exists and is visible
  let desktopContent = banner.querySelector('.home_page_banner_content_desktop .home_page_banner_content_inner');
  if (desktopContent) {
    // Move its children into a div (to preserve all text and layout)
    contentBlock = document.createElement('div');
    Array.from(desktopContent.childNodes).forEach(node => contentBlock.appendChild(node));
  } else {
    // Else fallback to mobile version
    let mobileContent = banner.querySelector('.home_page_banner_content_mobile .home_page_banner_content_inner');
    if (mobileContent) {
      contentBlock = document.createElement('div');
      Array.from(mobileContent.childNodes).forEach(node => contentBlock.appendChild(node));
    } else {
      // Fallback: use whatever content is available
      let anyContent = banner.querySelector('.home_page_banner_content_inner');
      if (anyContent) {
        contentBlock = document.createElement('div');
        Array.from(anyContent.childNodes).forEach(node => contentBlock.appendChild(node));
      } else {
        // As a last resort, provide an empty div
        contentBlock = document.createElement('div');
      }
    }
  }

  // Compose table rows - always 1 column and 3 rows as per spec
  const rows = [
    ['Hero (hero18)'],
    [bgImgEl ? bgImgEl : ''],
    [contentBlock],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
