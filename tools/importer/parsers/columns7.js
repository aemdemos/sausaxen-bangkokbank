/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left column: all content in .content
  const leftContent = element.querySelector('.content');

  // Extract right column: image from background-image of .thumb
  let rightCell = null;
  const thumbDiv = element.querySelector('.thumb');
  if (thumbDiv) {
    const bgImg = thumbDiv.style.backgroundImage;
    const urlMatch = bgImg && bgImg.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      const img = document.createElement('img');
      img.src = urlMatch[1];
      img.alt = '';
      rightCell = img;
    }
  }

  // Manually construct table so the header cell has colspan=2
  const table = document.createElement('table');

  // Header row with correct colspan
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns (columns7)';
  headerTh.colSpan = 2; // Set colspan to 2
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Content row: two columns
  const contentTr = document.createElement('tr');
  const tdLeft = document.createElement('td');
  if (leftContent) tdLeft.append(leftContent);
  const tdRight = document.createElement('td');
  if (rightCell) tdRight.append(rightCell);
  contentTr.appendChild(tdLeft);
  contentTr.appendChild(tdRight);
  table.appendChild(contentTr);

  element.replaceWith(table);
}
