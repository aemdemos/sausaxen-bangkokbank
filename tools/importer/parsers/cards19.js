/* global WebImporter */
export default function parse(element, { document }) {
  // The table header row: single column as per requirements
  const cells = [['Cards (cards19)']];

  // Extract all visible content for the card row
  const inner = element.querySelector('.inner-container');
  if (!inner) return;

  // Collect the breadcrumb navigation (ul) and share icon (a.icon-share)
  const nav = inner.querySelector('ul');
  const share = inner.querySelector('a.icon-share');

  // Compose the card's content cell (second col)
  const cardContent = [];
  if (nav) cardContent.push(nav);
  if (share) cardContent.push(share);

  // Add the card row: 2 columns (first column empty, second = content)
  cells.push(['', cardContent]);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
