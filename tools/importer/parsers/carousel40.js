/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header
  const headerRow = ['Carousel (carousel40)'];

  // Find the slide: .thumb-large figure with img and caption
  const figure = element.querySelector('figure.thumb-large');

  let img = null;
  let captionContent = [];

  if (figure) {
    // Image: must be in first cell and is required
    img = figure.querySelector('img');

    // Caption: may contain title, description, CTA
    const figcaption = figure.querySelector('figcaption.intro-info');
    if (figcaption) {
      // Title (h3)
      const title = figcaption.querySelector('h3');
      if (title) {
        captionContent.push(title);
      }
      // Description (desc)
      const desc = figcaption.querySelector('.desc');
      if (desc) {
        // Add each child node (e.g. <p>)
        Array.from(desc.childNodes).forEach((n) => {
          captionContent.push(n);
        });
      }
      // CTA (button-group > a)
      const buttonGroup = figcaption.querySelector('.button-group');
      if (buttonGroup) {
        const cta = buttonGroup.querySelector('a');
        if (cta) {
          captionContent.push(cta);
        }
      }
    }
  }

  // If no image was found, don't create the block (edge case guard)
  if (!img) return;

  // Build the table: header, then one row for the slide
  const cells = [
    headerRow,
    [img, captionContent]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
