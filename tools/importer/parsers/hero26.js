/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matches example
  const headerRow = ['Hero (hero26)'];

  // Extract the image (background image)
  let imageRow = [''];
  const imageSection = element.querySelector('.cmp-teaser__image');
  if (imageSection) {
    const img = imageSection.querySelector('img');
    if (img) {
      imageRow = [img];
    }
  }

  // Extract content (title, description, CTA)
  let contentItems = [];
  const contentSection = element.querySelector('.cmp-teaser__content');
  if (contentSection) {
    // Title (h2), use h2 for semantic fidelity
    const title = contentSection.querySelector('.cmp-teaser__title');
    if (title) {
      contentItems.push(title);
    }
    // Description (div), convert to <p>
    const desc = contentSection.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      // Use the existing element for resilience
      contentItems.push(desc);
    }
    // CTA (link)
    const cta = contentSection.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentItems.push(cta);
    }
  }
  // Place all content in a single cell, as an array, as per example structure
  const contentRow = [contentItems];

  // Assemble the table (no Section Metadata block in the example, so don't add one)
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
