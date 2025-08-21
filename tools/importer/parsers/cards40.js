/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image list root (could be direct or one level down)
  let imageList = element.querySelector('.cmp-image-list');
  if (!imageList) {
    // fallback: look for direct ul if structure changes
    imageList = element.querySelector('ul');
  }
  const items = imageList ? Array.from(imageList.children) : [];
  const rows = [
    ['Cards (cards40)']
  ];
  items.forEach((li) => {
    const article = li.querySelector('.cmp-image-list__item-content');
    // Image block: find the <img> in this card
    let imgContainer = article.querySelector('.cmp-image-list__item-image');
    let img = imgContainer ? imgContainer.querySelector('img') : null;
    // Text block: Title, Description
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    const description = article.querySelector('.cmp-image-list__item-description');
    // Compose the text cell
    const textCell = [];
    if (titleSpan) {
      // Use heading style: strong for title
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCell.push(strong);
    }
    if (description) {
      // Add description as plain text (keep formatting)
      // If description contains any child nodes, preserve them
      // Otherwise, just use its textContent
      if (description.childNodes.length > 1) {
        description.childNodes.forEach(node => textCell.push(node));
      } else {
        textCell.push(document.createTextNode(description.textContent));
      }
    }
    // Compose row: [image, text cell]
    rows.push([
      img || '',
      textCell
    ]);
  });
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
