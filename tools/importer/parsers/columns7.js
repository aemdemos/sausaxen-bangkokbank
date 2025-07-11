/* global WebImporter */
export default function parse(element, { document }) {
  // Get left content
  let leftContent = '';
  const thumbFull = element.querySelector('.thumb-full');
  if (thumbFull) {
    const outer = thumbFull.querySelector('.outer');
    if (outer) {
      const inner = outer.querySelector('.inner');
      if (inner) {
        const content = inner.querySelector('.content');
        if (content) leftContent = content;
      }
    }
  }

  // Get right content (image)
  let rightContent = '';
  if (thumbFull) {
    const thumb = thumbFull.querySelector('.thumb');
    if (thumb) {
      const bg = thumb.style.backgroundImage;
      const urlMatch = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        const img = document.createElement('img');
        img.src = urlMatch[1];
        img.alt = '';
        rightContent = img;
      }
    }
  }

  // Header row: single cell (one column), even if multiple columns in content row
  const headerRow = ['Columns (columns7)'];
  // Content row: as many columns as needed
  const contentRow = [leftContent, rightContent];
  const cells = [
    headerRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Fix: ensure the header row has only one th spanning all columns
  // (Implementation: merge th cells if createTable doesn't do it automatically)
  if (table && table.rows.length > 0 && table.rows[0].cells.length > 1) {
    // combine header cells into one spanning all columns
    const row = table.rows[0];
    let headerHtml = '';
    for (let i = 0; i < row.cells.length; i++) {
      headerHtml += row.cells[i].innerHTML;
    }
    // Remove all cells except the first
    while (row.cells.length > 1) {
      row.deleteCell(1);
    }
    row.cells[0].innerHTML = headerHtml;
    row.cells[0].colSpan = contentRow.length;
  }

  element.replaceWith(table);
}
