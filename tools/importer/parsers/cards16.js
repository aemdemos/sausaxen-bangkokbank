/* global WebImporter */
export default function parse(element, { document }) {
  // The header row: always one cell
  const headerRow = ['Cards (cards16)'];

  // Extract all the relevant text and nav links into a single content element
  const contentWrapper = document.createElement('div');

  // Section title as heading if present
  const sectionName = element.querySelector('#spFirstSectionName');
  if (sectionName && sectionName.textContent.trim()) {
    const heading = document.createElement('strong');
    heading.textContent = sectionName.textContent.trim();
    contentWrapper.appendChild(heading);
    contentWrapper.appendChild(document.createElement('br'));
  }

  // BACK button if present
  const backBtn = element.querySelector('a.btn-back');
  if (backBtn) {
    contentWrapper.appendChild(backBtn);
    contentWrapper.appendChild(document.createElement('br'));
  }

  // Section nav links (as nav or just text with separators)
  const sectionLinks = element.querySelectorAll('#ulSectionTitles a.ancSectionTitle');
  if (sectionLinks.length > 0) {
    const nav = document.createElement('div');
    sectionLinks.forEach((a, idx) => {
      nav.appendChild(a);
      if (idx < sectionLinks.length - 1) {
        nav.appendChild(document.createTextNode(' | '));
      }
    });
    contentWrapper.appendChild(nav);
  }

  // If there's no content in the wrapper (edge case), use all text
  if (!contentWrapper.textContent.trim()) {
    contentWrapper.textContent = element.textContent.trim();
  }

  // Each row should match the Cards (cards16) variant: header = 1 col, each card = 2 cols (image, content). If no image, first cell empty.
  // As per the prompt, even a single simple card should be two columns: ['', content].
  const rows = [
    headerRow,
    ['', contentWrapper]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
