/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as in example
  const headerRow = ['Carousel (carousel4)'];
  const rows = [headerRow];

  // Find the carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the slides container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const slides = content.querySelectorAll('.cmp-carousel__item');

  slides.forEach((slide) => {
    // IMAGE: Find the first <img> inside .cmp-image or .image wrapper
    let imgElem = null;
    const imgWrapper = slide.querySelector('.cmp-image, .image');
    if (imgWrapper) {
      imgElem = imgWrapper.querySelector('img');
    }
    if (!imgElem) {
      imgElem = slide.querySelector('img');
    }

    // TEXT: Find all text elements not part of the image
    const textFragments = [];
    // Gather all direct children of slide that are not the image wrapper
    Array.from(slide.children).forEach((child) => {
      if (
        child.classList.contains('cmp-image') ||
        child.classList.contains('image')
      ) return;
      // Add heading, paragraph, link, or div/span if present
      if (child.matches('h1, h2, h3, h4, h5, h6, p, a, div, span')) {
        textFragments.push(child);
      }
      // Search for nested paragraphs, headings, links, etc. inside non-image containers
      ['h1','h2','h3','h4','h5','h6','p','a','div','span'].forEach(sel => {
        child.querySelectorAll && child.querySelectorAll(sel).forEach(e => {
          if (!textFragments.includes(e)) textFragments.push(e);
        });
      });
    });
    // If no direct children, look for text nodes
    Array.from(slide.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textFragments.push(span);
      }
    });

    // If nothing was found, cell is empty string
    const textCell = textFragments.length ? textFragments : '';
    rows.push([imgElem, textCell]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
