/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row: exactly one cell
  const headerRow = ['Cards (cards7)'];

  // Extract section name (as heading)
  const sectionName = element.querySelector('#spFirstSectionName');
  // Extract section titles as nav links
  const sectionTitlesUl = element.querySelector('#ulSectionTitles');
  let navLinks = [];
  if (sectionTitlesUl) {
    navLinks = Array.from(sectionTitlesUl.querySelectorAll('a'));
  }

  // Use the back button as the 'icon' if present
  let iconCol = '';
  const backBtn = element.querySelector('.btn-back');
  if (backBtn) {
    iconCol = backBtn;
  }

  // Build the text cell with heading and nav links
  const textCell = document.createElement('div');
  if (sectionName) {
    const heading = document.createElement('strong');
    heading.textContent = sectionName.textContent.trim();
    textCell.appendChild(heading);
  }
  if (navLinks.length > 0) {
    textCell.appendChild(document.createElement('br'));
    navLinks.forEach((link, i) => {
      textCell.appendChild(link);
      if (i < navLinks.length - 1) {
        textCell.appendChild(document.createTextNode(', '));
      }
    });
  }

  // Each card row must have exactly two cells
  const cardRows = [[iconCol, textCell]];

  // Structure: headerRow (1 cell), then each card row (2 cells)
  const cells = [headerRow, ...cardRows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
