/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards4)'];
  const rows = [];

  // Find the currently active year tab (with cards in .row)
  const activeInner = element.querySelector('.inner.active');
  if (!activeInner) return;
  const cardCols = activeInner.querySelectorAll('.row > .col-md-4');

  cardCols.forEach(col => {
    // --- Image cell ---
    let imgCell = null;
    const img = col.querySelector('img');
    if (img) {
      imgCell = img;
    } else {
      // Fallback: try to get from background-image if present
      const thumb = col.querySelector('.thumb-default .inner .thumb');
      if (thumb && thumb.style.backgroundImage) {
        const m = thumb.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
        if (m && m[1]) {
          const fallbackImg = document.createElement('img');
          fallbackImg.src = m[1];
          imgCell = fallbackImg;
        }
      }
    }
    if (!imgCell) {
      // If still not found, just use an empty div to keep table structure
      imgCell = document.createElement('div');
    }

    // --- Text cell ---
    const textCell = document.createElement('div');
    // Title/Description - wrap first line as strong if possible
    const desc = col.querySelector('.caption .desc');
    if (desc) {
      // If desc contains <br>, split into title and rest
      const html = desc.innerHTML;
      const brIdx = html.indexOf('<br');
      if (brIdx > -1) {
        // Text before <br> is title
        const strong = document.createElement('strong');
        strong.textContent = desc.textContent.split('\n')[0].trim();
        textCell.appendChild(strong);
        textCell.appendChild(document.createElement('br'));
        // Rest (after first <br>) is description
        const frag = document.createElement('span');
        frag.innerHTML = html.slice(brIdx + 4).replace(/^.*?>/, '').trim();
        textCell.appendChild(frag);
      } else {
        // No <br>, treat all as title
        const strong = document.createElement('strong');
        strong.textContent = desc.textContent.trim();
        textCell.appendChild(strong);
      }
    }
    // Date below
    const date = col.querySelector('.button-group .promotion-valid');
    if (date) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(date);
    }
    // CTA link
    const cta = col.querySelector('.button-group a.btn-primary');
    if (cta) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(cta);
    }

    rows.push([imgCell, textCell]);
  });

  // Only create the table if there is at least one card
  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
