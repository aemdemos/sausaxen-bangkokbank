import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Simple overview block - just ensure proper structure
  const rows = [...block.children];
  
  rows.forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
      const paragraph = col.querySelector('p');
      
      if (heading) {
        heading.classList.add('overview-title');
      }
      
      if (paragraph) {
        paragraph.classList.add('overview-description');
      }
    });
  });
} 