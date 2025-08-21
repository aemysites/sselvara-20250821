/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards25)'];
  const cells = [headerRow];

  // Locate the image card list
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // Find content article
    const article = item.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // ========== Image cell ==========
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        // fallback: render the link if no image found
        imageCell = imageLink;
      }
    }

    // ========== Text cell ==========
    const textCellContent = [];
    // Title as strong (per typical card layout, matches visual emphasis in example)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent && titleSpan.textContent.trim() !== '') {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textCellContent.push(strong);
      }
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent && desc.textContent.trim() !== '') {
      // Insert a <br> between title and description if both present
      if (textCellContent.length > 0) {
        textCellContent.push(document.createElement('br'));
      }
      textCellContent.push(desc);
    }

    // At least provide empty cell if no text found
    if (textCellContent.length === 0) textCellContent.push('');
    if (!imageCell) imageCell = '';
    cells.push([
      imageCell,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
