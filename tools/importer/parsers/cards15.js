/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards15)'];
  const cells = [headerRow];

  // Find all list items representing cards
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Get image element (reference, not clone)
    const img = item.querySelector('.cmp-image-list__item-image img');

    // Compose text content: title (as heading), description, link
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Compose text cell content
    const textCellContent = [];
    if (titleSpan) {
      // Use <strong> for the heading, keep original text
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      textCellContent.push(heading);
    }
    if (descSpan && descSpan.textContent.trim()) {
      const desc = document.createElement('p');
      desc.textContent = descSpan.textContent;
      textCellContent.push(desc);
    }
    // If title is a link (distinct from heading), add at bottom as CTA
    // In this source, the title is a link; allow users to click from the title heading only
    // No additional CTA link needed as the heading itself is clickable in context

    cells.push([
      img,
      textCellContent
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
