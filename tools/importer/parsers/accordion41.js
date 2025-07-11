/* global WebImporter */
export default function parse(element, { document }) {
    // Find the accordion section within the given element
    const accordionSection = element.querySelector('section[data-accordion]');
    if (!accordionSection) return;

    // Find all the accordion items (each one is a row in the table)
    const collapseItems = accordionSection.querySelectorAll('.collapse-item');

    // Table header: block/component name from the requirements
    const rows = [['Accordion (accordion41)']];

    // For each accordion item, extract the header and content
    collapseItems.forEach((item) => {
        const header = item.querySelector('.collapse-header');
        const inner = item.querySelector('.collapse-inner');
        if (!header || !inner) return;
        // Use the header element directly for the title cell
        // For content: collect all children except the trailing <span> (if present and empty)
        const contentElements = [];
        Array.from(inner.childNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN' && !node.textContent.trim()) {
                return;
            }
            if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
                return;
            }
            contentElements.push(node);
        });
        let contentCell;
        if (contentElements.length === 1) {
            contentCell = contentElements[0];
        } else {
            contentCell = contentElements;
        }
        rows.push([header, contentCell]);
    });

    // Create the block table
    const table = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the original element with the table
    element.replaceWith(table);
}
