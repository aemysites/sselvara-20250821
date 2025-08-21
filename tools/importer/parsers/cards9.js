/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the block containing the cards list
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Build the table header
  const cells = [['Cards (cards9)']];

  // Helper: get trimmed text content
  function getTextContent(el) {
    return el ? el.textContent.trim() : '';
  }

  // For each card in the image list
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Image (first image block inside li)
    const imageBlock = li.querySelector('.cmp-image-list__item-image .cmp-image');

    // Text cell for card content
    const textContent = [];

    // Title as <strong>
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink && titleLink.querySelector('.cmp-image-list__item-title');
    if (titleSpan && getTextContent(titleSpan)) {
      const strong = document.createElement('strong');
      strong.textContent = getTextContent(titleSpan);
      textContent.push(strong);
    }

    // Description (span)
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && getTextContent(descSpan)) {
      // If there's title, add a br for separation in cell
      if (textContent.length) textContent.push(document.createElement('br'));
      textContent.push(descSpan);
    }

    // CTA (add a link if titleLink exists)
    if (titleLink && titleLink.getAttribute('href')) {
      // Only add CTA if not duplicating the title
      // Separate CTA from previous with br
      if (textContent.length) textContent.push(document.createElement('br'));
      const cta = document.createElement('a');
      cta.href = titleLink.getAttribute('href');
      cta.textContent = 'Read More';
      textContent.push(cta);
    }

    // Fallback: If no title or description, grab any text from article
    if (!textContent.length) {
      const article = li.querySelector('article');
      if (article && getTextContent(article)) {
        textContent.push(document.createTextNode(getTextContent(article)));
      }
    }

    // Only add row if there's at least one image or text
    if (imageBlock || textContent.length) {
      cells.push([
        imageBlock,
        textContent
      ]);
    }
  });

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
