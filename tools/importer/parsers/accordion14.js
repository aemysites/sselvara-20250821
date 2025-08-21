/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the accordion block
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // 2. Prepare the header row (exactly as required)
  const headerRow = ['Accordion (accordion14)'];

  // 3. Collect all accordion items in order
  const items = Array.from(accordion.querySelectorAll('.cmp-accordion__item'));
  const rows = items.map(item => {
    // Title cell: get title from .cmp-accordion__title (inside button)
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleEl;
    if (titleSpan) {
      // Reference the actual span element, preserving any formatting/classes
      titleEl = titleSpan;
    } else {
      // fallback: just use the button text if no span found
      const button = item.querySelector('button');
      titleEl = document.createElement('span');
      titleEl.textContent = button ? button.textContent.trim() : '';
    }

    // Content cell: gather all relevant visible elements from the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentEls = [];
    if (panel) {
      // In most AEM setups, content is inside .cmp-container, which contains .text, etc.
      // We want to reference ONLY the content blocks - not wrappers
      const containers = Array.from(panel.querySelectorAll('.cmp-container'));
      if (containers.length > 0) {
        containers.forEach(container => {
          // For each container, find .text (FAQ answer), image, or other block-level content
          Array.from(container.children).forEach(child => {
            if (child.classList.contains('text')) {
              // Reference each child of .text (e.g., .cmp-text)
              Array.from(child.children).forEach(grandchild => {
                contentEls.push(grandchild);
              });
            } else {
              // Reference other content blocks directly
              contentEls.push(child);
            }
          });
        });
      } else {
        // Fallback: reference all direct children of the panel
        contentEls = Array.from(panel.children);
      }
    }
    // If no content found, use an empty string
    if (contentEls.length === 0) contentEls = [''];
    return [titleEl, contentEls];
  });

  // 4. Build the cells array with header and rows
  const cells = [headerRow, ...rows];

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original accordion block with the table
  accordion.replaceWith(block);
}
