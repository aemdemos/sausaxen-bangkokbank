/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table header
  const headerRow = ['Cards (cards2)'];
  const rows = [];
  // Select all card columns (direct children of the row)
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach(card => {
    // Get the card's main image (first <img> inside .thumb or .inner)
    let img = card.querySelector('.thumb img, .inner img, img');
    // If no image found, set to empty string
    if (!img) img = '';
    // Get the caption div, fallback to card if not found
    let textDiv = card.querySelector('.caption.editor, .caption, .editor') || card;
    // Build the text cell: include heading and all paragraph elements in order
    const cellText = [];
    // Heading (h1, h2, h3, ...), if present
    const heading = textDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) cellText.push(heading);
    // All paragraphs in order
    const paragraphs = textDiv.querySelectorAll('p');
    paragraphs.forEach(p => cellText.push(p));
    // Add the row: [image, [heading, paragraphs]]
    rows.push([img, cellText]);
  });
  // Compose the table and replace the original element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
