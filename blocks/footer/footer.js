import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';
  
  while (fragment.firstElementChild) {
    footer.append(fragment.firstElementChild);
  }

  // Add specific classes for better styling control
  const sections = footer.querySelectorAll('.section');
  sections.forEach((section, index) => {
    if (index < sections.length - 1) {
      // Navigation sections
      section.classList.add('footer-nav-section');
      
      // Find and style the main category heading
      const mainLi = section.querySelector('ul > li');
      if (mainLi) {
        mainLi.classList.add('footer-category');
        
        // Extract the category name and create a proper heading
        const categoryText = mainLi.childNodes[0]?.textContent?.trim();
        if (categoryText) {
          const heading = document.createElement('h3');
          heading.textContent = categoryText;
          heading.className = 'footer-category-title';
          
          // Remove the text node and replace with heading
          mainLi.childNodes[0].remove();
          mainLi.insertBefore(heading, mainLi.firstChild);
        }
        
        // Style the sub-navigation
        const subUl = mainLi.querySelector('ul');
        if (subUl) {
          subUl.classList.add('footer-nav-list');
          
          // Add classes to navigation items
          const navItems = subUl.querySelectorAll('li');
          navItems.forEach(item => {
            item.classList.add('footer-nav-item');
            const link = item.querySelector('a');
            if (link) {
              link.classList.add('footer-nav-link');
            }
          });
        }
      }
    } else {
      // Copyright section
      section.classList.add('footer-copyright-section');
      
      // Style copyright content
      const paragraphs = section.querySelectorAll('p');
      paragraphs.forEach((p, pIndex) => {
        if (pIndex === 0) {
          p.classList.add('footer-copyright');
        } else if (pIndex === 1) {
          p.classList.add('footer-legal-links');
        } else if (pIndex === 2) {
          p.classList.add('footer-browser-info');
        }
      });
    }
  });

  // Add responsive behavior for mobile menu toggle if needed
  const handleResize = () => {
    const width = window.innerWidth;
    footer.classList.toggle('footer-mobile', width < 768);
    footer.classList.toggle('footer-tablet', width >= 768 && width < 1024);
    footer.classList.toggle('footer-desktop', width >= 1024);
  };

  // Initial setup
  handleResize();
  
  // Listen for resize events
  window.addEventListener('resize', handleResize);

  block.append(footer);
}
