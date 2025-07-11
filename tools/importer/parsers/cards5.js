/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards5)'];
  const rows = [];

  // Helper to extract card cell content
  function getCardContent(figure) {
    // Find image (first img in .thumb)
    let imgDiv = null;
    const thumb = figure.querySelector('.thumb');
    if (thumb) {
      const img = thumb.querySelector('img');
      if (img) {
        imgDiv = img;
      }
    }
    // Find text content
    const figcaption = figure.querySelector('figcaption');
    const textParts = [];
    if (figcaption) {
      const title = figcaption.querySelector('h3');
      if (title) textParts.push(title);
      const desc = figcaption.querySelector('.desc');
      if (desc) {
        // Get all child nodes of .desc and append them (preserves <p> etc)
        Array.from(desc.childNodes).forEach(node => textParts.push(node));
      }
      const btnGroup = figcaption.querySelector('.button-group');
      if (btnGroup) {
        const btn = btnGroup.querySelector('a');
        if (btn) textParts.push(btn);
      }
    }
    return [imgDiv, textParts];
  }

  // Find all <figure> in order
  const figures = element.querySelectorAll('figure.thumb-large');
  figures.forEach(fig => {
    const [img, text] = getCardContent(fig);
    rows.push([img, text]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
