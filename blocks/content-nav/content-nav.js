import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  
  rows.forEach((row, index) => {
    const cols = [...row.children];
    
    // First row contains the back button
    if (index === 0) {
      cols.forEach((col) => {
        const paragraph = col.querySelector('p');
        if (paragraph && paragraph.textContent.trim().toUpperCase() === 'BACK') {
          paragraph.classList.add('content-nav-back');
          col.classList.add('content-nav-back-container');
        }
      });
    }
    
    // Second row contains the navigation list (dropdown)
    if (index === 1) {
      cols.forEach((col) => {
        const ul = col.querySelector('ul');
        if (ul) {
          ul.classList.add('content-nav-list');
          col.classList.add('content-nav-list-container');
          
          // Create dropdown button with dynamic content
          // Use first list item as button text, or fallback to "Menu"
          const firstItem = ul.querySelector('li');
          const buttonText = firstItem ? firstItem.textContent.trim() : 'Menu';
          
          const dropdownButton = document.createElement('button');
          dropdownButton.classList.add('content-nav-dropdown-button');
          dropdownButton.innerHTML = `
            <span>${buttonText}</span>
            <span class="content-nav-dropdown-arrow">▼</span>
          `;
          
          // Insert button before the list
          col.insertBefore(dropdownButton, ul);
          
          // Add classes to list items
          const listItems = ul.querySelectorAll('li');
          listItems.forEach((li) => {
            li.classList.add('content-nav-item');
          });
          
          // Add click functionality for dropdown
          let isOpen = false;
          
          dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            ul.style.display = isOpen ? 'block' : 'none';
            
            // Rotate arrow
            const arrow = dropdownButton.querySelector('.content-nav-dropdown-arrow');
            arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
          });
          
          // Close dropdown when clicking outside
          document.addEventListener('click', () => {
            isOpen = false;
            ul.style.display = 'none';
            const arrow = dropdownButton.querySelector('.content-nav-dropdown-arrow');
            arrow.style.transform = 'rotate(0deg)';
          });
        }
      });
    }
  });
} 