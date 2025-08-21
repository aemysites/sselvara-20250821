/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the teaser block which contains the hero info
  const teaser = element.querySelector('.cmp-teaser');
  let imageEl = null;
  let textEls = [];
  if (teaser) {
    // Get image element (reference existing, not clone)
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }
    // Get all textual content (headline, subheading, CTA, etc)
    const contentContainer = teaser.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      // Gather all heading and paragraph-like children for the hero text
      const headingEls = Array.from(contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6, p'));
      if (headingEls.length) {
        textEls.push(...headingEls);
      } else {
        // If only text nodes, wrap them in paragraphs
        if (contentContainer.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = contentContainer.textContent;
          textEls.push(p);
        }
      }
    }
  }
  // Compose cells array for table
  const cells = [];
  // Header row: block name (exact)
  cells.push(['Hero (hero6)']);
  // Row 2: Image (optional)
  cells.push([imageEl ? imageEl : '']);
  // Row 3: Text content (headings, paragraphs)
  cells.push([textEls.length ? textEls : '']);
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with block table
  element.replaceWith(table);
}
