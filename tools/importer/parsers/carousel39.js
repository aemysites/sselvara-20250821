/* global WebImporter */
export default function parse(element, { document }) {
  // The carousel header as specified in the example
  const headerRow = ['Carousel (carousel39)'];

  // Find the carousel and its content wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all direct carousel slide items
  const slideEls = content.querySelectorAll('.cmp-carousel__item');
  const rows = [];

  // Helper: get heading, description, links in slide
  function extractTextElements(slideEl, document) {
    const elements = [];
    // Find heading: h1-h6
    const heading = slideEl.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) elements.push(heading);
    // Find description: first paragraph not inside heading
    Array.from(slideEl.querySelectorAll('p')).forEach(p => {
      // Check if parent is NOT heading
      let inHeading = false;
      let parent = p.parentElement;
      while (parent && parent !== slideEl) {
        if (/^H[1-6]$/i.test(parent.tagName)) {
          inHeading = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (!inHeading) elements.push(p);
    });
    // Find CTA links: visible <a> tags
    Array.from(slideEl.querySelectorAll('a')).forEach(a => {
      if (a.textContent.trim() && a.href) {
        elements.push(a);
      }
    });
    // Also: captions from image meta or image container
    const imageWrappers = slideEl.querySelectorAll('.image, [data-cmp-is="image"]');
    imageWrappers.forEach(wrapper => {
      const metaCaption = wrapper.querySelector('meta[itemprop="caption"]');
      if (metaCaption && metaCaption.content) {
        // If not already present in elements
        if (!elements.some(e => e.textContent === metaCaption.content)) {
          const p = document.createElement('p');
          p.textContent = metaCaption.content;
          elements.push(p);
        }
      }
    });
    // If none found, fallback: use image alt as description (if present and not duplicate)
    const imgEl = slideEl.querySelector('img');
    if (imgEl && imgEl.alt && !elements.some(e => e.textContent === imgEl.alt)) {
      const p = document.createElement('p');
      p.textContent = imgEl.alt;
      elements.push(p);
    }
    // Remove duplicate text nodes (by text)
    const seen = new Set();
    return elements.filter(e => {
      const txt = e.textContent.trim();
      if (!txt || seen.has(txt)) return false;
      seen.add(txt);
      return true;
    });
  }

  slideEls.forEach(slideEl => {
    // First cell: mandatory image
    const imgEl = slideEl.querySelector('img');
    // Second cell: heading, description, CTA, caption (all text content)
    const textElements = extractTextElements(slideEl, document);
    const textCell = textElements.length ? textElements : '';
    rows.push([imgEl, textCell]);
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
