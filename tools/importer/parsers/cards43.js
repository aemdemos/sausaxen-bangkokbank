/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards43)'];
  const cells = [headerRow];

  // Get all figure.card elements in the correct row order
  const figures = element.querySelectorAll('figure.thumb-large');

  figures.forEach(figure => {
    // Image: get the <img> element inside .thumb
    const thumbDiv = figure.querySelector('.thumb');
    let img = thumbDiv ? thumbDiv.querySelector('img') : null;
    // Use the original <img> reference if possible
    // Text content: build a container for all text/cta
    const figcaption = figure.querySelector('figcaption.intro-info');
    const textDiv = document.createElement('div');
    if (figcaption) {
      // Heading (title)
      const h3 = figcaption.querySelector('h3');
      if (h3) textDiv.appendChild(h3);
      // Description
      const desc = figcaption.querySelector('.desc');
      if (desc) {
        const p = desc.querySelector('p');
        if (p) textDiv.appendChild(p);
        else textDiv.appendChild(desc);
      }
      // CTA
      const btn = figcaption.querySelector('.button-group a');
      if (btn) textDiv.appendChild(btn);
    }
    cells.push([
      img || '',
      textDiv
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
