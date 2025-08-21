/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row - match exactly as example
  const headerRow = ['Hero (hero38)'];

  // Find .cmp-teaser child
  const cmpTeaser = element.querySelector('.cmp-teaser');
  if (!cmpTeaser) {
    // No content, replace with table with just header
    const cells = [headerRow];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  // Find image section (background image)
  let imageRowContent = '';
  const cmpTeaserImage = cmpTeaser.querySelector('.cmp-teaser__image');
  if (cmpTeaserImage) {
    // Reference the entire image div
    imageRowContent = cmpTeaserImage;
  }

  // Find content section (title and description)
  let textRowContent = '';
  const cmpTeaserContent = cmpTeaser.querySelector('.cmp-teaser__content');
  if (cmpTeaserContent) {
    textRowContent = cmpTeaserContent;
  }

  // Construct the block table: 1 column, 3 rows (header, image, text)
  const cells = [
    headerRow,
    [imageRowContent],
    [textRowContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
