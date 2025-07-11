/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the markdown example
  const headerRow = ['Hero (hero21)'];

  // Extract background image URL from .thumb-full.large
  let bgImgUrl = '';
  const thumbFull = element.querySelector('.thumb-full.large');
  if (thumbFull && thumbFull.style && thumbFull.style.backgroundImage) {
    const match = thumbFull.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      bgImgUrl = match[1];
    }
  }

  // Reference the background image element or ''
  let bgImgEl = '';
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // Prefer .desktop-tools .inner, fallback to .mobile-tools .inner
  let contentContainer = element.querySelector('.desktop-tools .inner');
  if (!contentContainer) {
    contentContainer = element.querySelector('.mobile-tools .inner');
  }
  // Fallback: if neither is found, use entire thumbFull
  if (!contentContainer && thumbFull) {
    contentContainer = thumbFull;
  }
  // Fallback: if nothing is found, use the whole input element
  if (!contentContainer) {
    contentContainer = element;
  }

  // Collect all direct children (including text nodes and elements) in order
  // and ensure ALL text is included
  let contentChildren = [];
  contentContainer.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim() !== '') {
        // Text node retained as a text node
        contentChildren.push(document.createTextNode(node.textContent));
      }
    } else {
      contentChildren.push(node);
    }
  });

  // Remove leading or trailing empty text nodes
  while (contentChildren.length && contentChildren[0].nodeType === Node.TEXT_NODE && contentChildren[0].textContent.trim() === '') contentChildren.shift();
  while (contentChildren.length && contentChildren[contentChildren.length-1].nodeType === Node.TEXT_NODE && contentChildren[contentChildren.length-1].textContent.trim() === '') contentChildren.pop();

  // Table structure as per spec: header, background image, content
  const rows = [
    headerRow,
    [bgImgEl ? bgImgEl : ''],
    [contentChildren.length > 0 ? contentChildren : ''],
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
