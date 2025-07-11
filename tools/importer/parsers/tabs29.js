/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract tab labels from tab header (ul) or dropdown select
  let tabLabels = [];
  const tabHeader = element.querySelector('ul[data-tab-header]');
  if (tabHeader) {
    tabLabels = Array.from(tabHeader.querySelectorAll('li')).map(li => {
      const a = li.querySelector('a');
      return a ? a.textContent.trim() : li.textContent.trim();
    });
  } else {
    const dropdown = element.querySelector('select[data-select]');
    if (dropdown) {
      tabLabels = Array.from(dropdown.querySelectorAll('option')).map(opt => opt.textContent.trim());
    }
  }

  // 2. Extract tab content blocks in order
  const section = element.querySelector('section[data-tab-content]');
  if (!section) return;
  const tabContentDivs = Array.from(section.querySelectorAll('[data-tab-content-item]'));

  // 3. For each tab, collect all HTML content (text, elements, and images)
  const tabContents = tabContentDivs.map(div => {
    // Gather all nodes (including text nodes and elements)
    const container = document.createElement('div');
    Array.from(div.childNodes).forEach(node => {
      container.appendChild(node);
    });
    // If the container only contains whitespace, return an empty string
    if (container.innerHTML.trim() === '') return '';
    return container;
  });

  // 4. Build table rows: header is single cell, then each tab is [label, content]
  const rows = [ ['Tabs'] ]; // Header row EXACTLY as in the example: single cell
  for (let i = 0; i < Math.min(tabLabels.length, tabContents.length); i++) {
    rows.push([tabLabels[i], tabContents[i]]);
  }
  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
