/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matching the block name as specified
  const headerRow = ['Columns (columns19)'];

  // Locate the teaser content and teaser image containers
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImageContainer = element.querySelector('.cmp-teaser__image');
  
  // Prepare left column (all content: pretitle, title, description, CTA)
  const leftColumnContent = [];
  if (teaserContent) {
    Array.from(teaserContent.children).forEach(child => {
      leftColumnContent.push(child);
    });
  }

  // Prepare right column (the main image, if present)
  let rightColumnContent = [];
  if (teaserImageContainer) {
    // Find the first <img> within teaserImageContainer
    const img = teaserImageContainer.querySelector('img');
    if (img) {
      rightColumnContent.push(img);
    }
  }

  // If either content column is empty, preserve cell structure with empty string
  if (leftColumnContent.length === 0) leftColumnContent.push('');
  if (rightColumnContent.length === 0) rightColumnContent.push('');

  // Build the cells array: header, followed by content row with two columns
  const cells = [
    headerRow,
    [leftColumnContent, rightColumnContent]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
