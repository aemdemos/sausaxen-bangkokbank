/* global WebImporter */
export default function parse(element, { document }) {
  // Get the tab labels
  let tabLabels = [];
  const tabHeaderList = element.querySelector('ul[data-tab-header]');
  if (tabHeaderList) {
    tabLabels = Array.from(tabHeaderList.querySelectorAll('li > a')).map(a => a.textContent.trim());
  } else {
    // fallback: select dropdown
    const dropdown = element.querySelector('.tabs-dropdown select');
    if (dropdown) {
      tabLabels = Array.from(dropdown.querySelectorAll('option')).map(opt => opt.textContent.trim());
    }
  }

  // Get tab contents in order
  let tabContents = [];
  const contentSection = element.querySelector('section[data-tab-content]');
  if (contentSection) {
    tabContents = Array.from(contentSection.querySelectorAll('div[data-tab-content-item]')).map(item => {
      // Gather all child nodes (elements and text nodes)
      const parts = [];
      item.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          parts.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          parts.push(p);
        }
      });
      if (parts.length === 0) return '';
      if (parts.length === 1) return parts[0];
      return parts;
    });
  }

  // Compose table rows: first row header (single cell), subsequent rows two cells
  const rows = [];
  // The header row: one cell only
  rows.push(['Tabs']);

  // For each tab, a two-column row
  const numTabs = Math.min(tabLabels.length, tabContents.length);
  for (let i = 0; i < numTabs; i++) {
    rows.push([tabLabels[i], tabContents[i]]);
  }

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Fix the header cell to have colspan=2
  const th = block.querySelector('tr:first-child th');
  if (th && block.rows.length > 1 && block.rows[1].cells.length === 2) {
    th.setAttribute('colspan', '2');
  }

  element.replaceWith(block);
}
