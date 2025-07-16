import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { createModal } from '../modal/modal.js';

export default function decorate(block) {
  const isCards9 = block.classList.contains('cards9');
  
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    
    [...li.children].forEach((div, index) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (isCards9 && index === 2) {
        // Special case for cards9: 3rd element becomes dialog content
        div.className = 'cards-card-dialog';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  
  // Add click handlers for "Read more" buttons in cards9
  if (isCards9) {
    ul.querySelectorAll('li').forEach((li) => {
      const dialogContent = li.querySelector('.cards-card-dialog');
      
      if (dialogContent) {
        // Look for any element that contains "Read more" text
        const cardBody = li.querySelector('.cards-card-body');
        if (cardBody) {
          const allElements = cardBody.querySelectorAll('*');
          let readMoreElement = null;
          
          // Check all elements for "Read more" text
          allElements.forEach((element) => {
            const elementText = element.textContent.trim().toLowerCase();
            if (elementText === 'read more' || elementText.includes('read more')) {
              readMoreElement = element;
            }
          });
          
          if (readMoreElement) {
            // Make the element clickable
            readMoreElement.style.cursor = 'pointer';
            readMoreElement.style.color = '#0056b3';
            readMoreElement.style.textDecoration = 'underline';
            
            readMoreElement.addEventListener('click', async (e) => {
              e.preventDefault();
              
              // Clone the dialog content to avoid removing it from the original location
              const contentClone = dialogContent.cloneNode(true);
              contentClone.style.display = 'block'; // Make sure content is visible in modal
              
              const { showModal } = await createModal([contentClone]);
              showModal();
            });
            
            // Add hover effect
            readMoreElement.addEventListener('mouseenter', () => {
              readMoreElement.style.color = '#003fa6';
            });
            
            readMoreElement.addEventListener('mouseleave', () => {
              readMoreElement.style.color = '#0056b3';
            });
          }
        }
      }
    });
  }
  
  block.textContent = '';
  block.append(ul);
}
