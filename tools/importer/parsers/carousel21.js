/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as in the example
  const headerRow = ['Carousel (carousel21)'];
  const rows = [headerRow];

  // Find the carousel content section (holds slides)
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all direct child carousel items (slides)
  const slideItems = Array.from(carouselContent.children).filter(
    (el) => el.classList.contains('cmp-carousel__item')
  );

  slideItems.forEach((slide) => {
    // First cell: Image
    let imgElem = null;
    const imgContainer = slide.querySelector('.cmp-teaser__image [data-cmp-is="image"]');
    if (imgContainer) {
      const slideImg = imgContainer.querySelector('img');
      if (slideImg) {
        imgElem = slideImg;
      }
    }
    if (!imgElem) {
      // fallback: any img in slide
      imgElem = slide.querySelector('img');
    }

    // Second cell: text content (title, description, cta as in example)
    const content = slide.querySelector('.cmp-teaser__content');
    const textContent = [];
    if (content) {
      // Title heading (should be heading - h2 in example)
      const title = content.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
      if (title && title.textContent.trim()) {
        // Use existing heading element (to keep references and semantics)
        textContent.push(title);
      }
      // Description
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) {
        // If the description contains block elements (e.g., <p>), include them, else wrap in <p>
        let hasBlock = false;
        Array.from(desc.childNodes).forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            ['P', 'UL', 'OL', 'DIV'].includes(node.nodeName)
          ) {
            hasBlock = true;
          }
        });
        if (hasBlock) {
          textContent.push(...Array.from(desc.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())));
        } else {
          // Otherwise, wrap as <p>
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          textContent.push(p);
        }
      }
      // CTA link - must be last in cell
      const cta = content.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textContent.push(cta);
      }
    }

    // Always 2 columns: one for image, one for content
    rows.push([
      imgElem || '',
      textContent.length ? textContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
