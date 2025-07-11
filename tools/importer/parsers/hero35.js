/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match the block name exactly
  const headerRow = ['Hero (hero35)'];

  // Get the figure containing the image and text
  const figure = element.querySelector('figure');

  // --- Row 2: Background Image ---
  let imageEl = null;
  if (figure) {
    // Try to find an <img> in the .thumb div
    const thumbDiv = figure.querySelector('.thumb');
    if (thumbDiv) {
      // Prefer the <img> if present
      const imgEl = thumbDiv.querySelector('img');
      if (imgEl && imgEl.src) {
        imageEl = imgEl;
      } else {
        // fallback to background-image style
        const bg = thumbDiv.style.backgroundImage;
        const match = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && match[1]) {
          // Create an <img> only if no real <img> exists
          imageEl = document.createElement('img');
          imageEl.src = match[1];
        }
      }
    }
  }
  // Always put something, even if imageEl is null (edge case)
  const row2 = [imageEl || ''];

  // --- Row 3: Headline, Description, CTA ---
  // The figcaption contains the text, headline, and CTA
  let row3Content = [];
  if (figure) {
    const figcaption = figure.querySelector('figcaption');
    if (figcaption) {
      // Collect headline, description, cta (in order)
      // Title (optional)
      const title = figcaption.querySelector('h3, h1, h2');
      if (title) row3Content.push(title);
      // Description (could be a <div class="desc"><p>...</p></div>)
      const desc = figcaption.querySelector('.desc');
      if (desc) {
        // Description is a <p>
        const p = desc.querySelector('p');
        if (p) row3Content.push(p);
      }
      // There may be additional content; ensure all relevant text is included
      // If there is a button group, and it's not empty, add it
      const btnGroup = figcaption.querySelector('.button-group');
      if (btnGroup && btnGroup.children.length > 0) {
        row3Content.push(...btnGroup.children);
      }
    }
  }
  if (row3Content.length === 0) row3Content = [''];
  // Ensure all content is referenced (not cloned)
  const row3 = [row3Content];

  // Compose final block table, no Section Metadata required
  const cells = [
    headerRow,
    row2,
    row3
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
