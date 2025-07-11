/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be a single cell
  const rows = [['Carousel (carousel30)']];

  // Find the main carousel slide container
  const sliderFor = element.querySelector('.slider.slider-for');
  let slideItems = [];
  if (sliderFor) {
    const slickList = sliderFor.querySelector('.slick-list');
    const slickTrack = slickList ? slickList.querySelector('.slick-track') : null;
    if (slickTrack) {
      slideItems = Array.from(slickTrack.children);
    }
  }

  // Find the heading above the carousel (if any)
  const headingElem = element.querySelector('.title-1, h2, h1');

  // For each slide, build a row with two cells
  slideItems.forEach((item, idx) => {
    // First cell: video src as a link
    let firstCell = '';
    const iframe = item.querySelector('iframe');
    if (iframe && iframe.src) {
      const a = document.createElement('a');
      a.href = iframe.src;
      a.textContent = iframe.src;
      firstCell = a;
    }
    // Second cell: heading for first slide, blank for others
    let secondCell = '';
    if (idx === 0 && headingElem) {
      secondCell = headingElem;
    }
    rows.push([firstCell, secondCell]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
