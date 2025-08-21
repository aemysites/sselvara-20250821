/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the main hero image from the FIRST .image block (should be prominent at top)
  let heroImg = null;
  const imageBlocks = element.querySelectorAll('.image');
  for (const imgBlock of imageBlocks) {
    const img = imgBlock.querySelector('img');
    if (img && !heroImg) {
      heroImg = img;
      break;
    }
  }

  // 2. Extract headline, subheading, and intro text as required
  const textEls = [];

  // Find all heading/title elements at the top
  const titleBlocks = element.querySelectorAll('.title .cmp-title');
  for (const block of titleBlocks) {
    const h1 = block.querySelector('h1');
    if (h1) textEls.push(h1);
    const h4 = block.querySelector('h4');
    if (h4) textEls.push(h4);
  }

  // Find the first main paragraph under article.contentfragment
  const contentFragment = element.querySelector('article.contentfragment');
  if (contentFragment) {
    // Find the first paragraph in cmp-contentfragment__elements
    const cfEls = contentFragment.querySelector('.cmp-contentfragment__elements');
    if (cfEls) {
      const ps = cfEls.querySelectorAll('p');
      if (ps.length) {
        textEls.push(ps[0]);
      }
    }
  }

  // 3. Build table block as per Hero (hero37) spec
  // Header matches EXACTLY: 'Hero (hero37)'
  const cells = [
    ['Hero (hero37)'],
    [heroImg],
    [textEls]
  ];

  // 4. Replace original element with new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
