/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first visible banner (display !== 'none')
  const list = element.querySelector('ul.banner_container');
  if (!list) return;
  const banners = Array.from(list.children);
  const visibleBanner = banners.find(li => li.style.display !== 'none');
  if (!visibleBanner) return;

  // Extract desktop background image
  const desktopImgDiv = visibleBanner.querySelector('.banner_container_desktop_img');
  let bgImgUrl = '';
  if (desktopImgDiv) {
    const bgStyle = desktopImgDiv.style.backgroundImage;
    if (bgStyle) {
      const match = bgStyle.match(/url\(["']?(.*?)["']?\)/);
      bgImgUrl = match ? match[1] : '';
    }
  }
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // Prefer desktop content, fallback to mobile content
  let contentBlock = visibleBanner.querySelector('.home_page_banner_content.home_page_banner_content_desktop')
    || visibleBanner.querySelector('.home_page_banner_content_desktop')
    || visibleBanner.querySelector('.home_page_banner_content.home_page_banner_content_mobile')
    || visibleBanner.querySelector('.home_page_banner_content_mobile');

  let contentCell = '';
  if (contentBlock) {
    // Collect all text and element content (preserving semantic structure)
    // Use all children so as not to miss headings/paragraphs/buttons
    const children = Array.from(contentBlock.querySelectorAll(':scope > *'));
    // If there are no element children, fallback to textContent
    if (children.length > 0) {
      contentCell = children;
    } else {
      const text = contentBlock.textContent.trim();
      contentCell = text ? [text] : '';
    }
  }

  // Build table rows: header, image, content
  const rows = [
    ['Hero (hero18)'],
    [bgImgEl || ''],
    [contentCell]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
