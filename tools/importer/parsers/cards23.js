/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as the example
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  // Helper to extract card info from a card container row
  function extractCards(cardRow) {
    const cards = [];
    if (!cardRow) return cards;
    // Select only direct children (columns)
    const cardCols = cardRow.querySelectorAll(':scope > div');
    cardCols.forEach((col) => {
      const thumb = col.querySelector('.thumb-square-caption');
      if (thumb) {
        // Extract image from background-image
        let imgUrl = '';
        const bgStyle = thumb.style.backgroundImage;
        if (bgStyle && bgStyle.startsWith('url(')) {
          imgUrl = bgStyle.slice(4, -1).replace(/['"]/g, '');
        }
        let imgEl = '';
        if (imgUrl) {
          imgEl = document.createElement('img');
          imgEl.src = imgUrl;
          imgEl.alt = '';
        }
        // Extract all children of .info for text content
        const info = thumb.querySelector('.info');
        let textContent = [];
        if (info) {
          // Reference only real elements (not empty text nodes)
          textContent = Array.from(info.childNodes).filter(n => {
            if (n.nodeType === 1) return n.textContent.trim();
            if (n.nodeType === 3) return n.textContent.trim();
            return false;
          });
        }
        cards.push([imgEl, textContent]);
      }
    });
    return cards;
  }

  // Only extract from the FIRST matching row with .thumb-square-caption (desktop version)
  let cardRow = element.querySelector('.desktop-teaser-container .row');
  if (!cardRow) {
    // fallback for mobile or alternate markup
    cardRow = element.querySelector('.row');
  }
  if (cardRow) {
    extractCards(cardRow).forEach(row => rows.push(row));
  }

  // If no cards found, try fallback to any direct .thumb-square-caption in element
  if (rows.length === 1) {
    element.querySelectorAll('.thumb-square-caption').forEach((thumb) => {
      // Same extraction logic as above
      let imgUrl = '';
      const bgStyle = thumb.style.backgroundImage;
      if (bgStyle && bgStyle.startsWith('url(')) {
        imgUrl = bgStyle.slice(4, -1).replace(/['"]/g, '');
      }
      let imgEl = '';
      if (imgUrl) {
        imgEl = document.createElement('img');
        imgEl.src = imgUrl;
        imgEl.alt = '';
      }
      const info = thumb.querySelector('.info');
      let textContent = [];
      if (info) {
        textContent = Array.from(info.childNodes).filter(n => {
          if (n.nodeType === 1) return n.textContent.trim();
          if (n.nodeType === 3) return n.textContent.trim();
          return false;
        });
      }
      rows.push([imgEl, textContent]);
    });
  }

  // Replace the section with the new table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
