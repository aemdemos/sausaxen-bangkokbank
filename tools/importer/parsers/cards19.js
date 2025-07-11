/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element contains .breadcrumb
  const breadcrumb = element.querySelector('.breadcrumb');
  if (!breadcrumb) return;

  const inner = breadcrumb.querySelector('.inner-container');
  if (!inner) return;

  // Breadcrumbs list (should always exist)
  const ul = inner.querySelector('ul');
  // Social share div (may be empty)
  const socialShare = inner.querySelector('.social-share');

  // Compose a div containing both breadcrumbs and social share block
  const textCell = document.createElement('div');
  if (ul) textCell.appendChild(ul);
  if (socialShare) textCell.appendChild(socialShare);

  // The Cards (cards19) block requires an image/icon. Try to find an icon or make a fallback.
  // Search for a .icon-share in the socialShare as a possible visual element
  let iconCell = null;
  if (socialShare) {
    const iconShare = socialShare.querySelector('.icon-share');
    if (iconShare) {
      iconCell = iconShare;
    }
  }
  // Fallback: use a transparent 1x1 pixel gif if no icon present, to keep cell non-empty
  if (!iconCell) {
    const img = document.createElement('img');
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    img.alt = '';
    iconCell = img;
  }

  // Compose rows for the block
  const rows = [
    ['Cards (cards19)'],
    [iconCell, textCell],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
