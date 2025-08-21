/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content fragment with surf spot cards
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Prepare the rows for the block table
  const rows = [];
  // Add header row (must match example exactly)
  rows.push(['Cards (cards3)']);

  // Get all direct children (elements only)
  const children = Array.from(cfElements.childNodes).filter(n => n.nodeType === 1);
  let i = 0;

  // Find intro image and first paragraph (before the first surf spot)
  let introImg = null, introP = null;
  while (i < children.length) {
    const node = children[i];
    if (!introImg && node.querySelector && node.querySelector('.cmp-image')) {
      introImg = node.querySelector('.cmp-image');
    }
    if (!introP && node.tagName === 'P') {
      introP = node;
    }
    if (introImg && introP) {
      rows.push([introImg, introP]);
      i++;
      break;
    }
    i++;
  }

  // Now process all card blocks for each surf spot (H2 + image + paragraph)
  // Use a more flexible approach to ensure all cards get captured
  while (i < children.length) {
    // Look for an H2 heading marking the start of a card
    if (children[i].tagName === 'H2') {
      const heading = children[i];
      let img = null;
      let desc = null;
      // Search forward for image and paragraph, up to 8 siblings ahead
      for (let look = 1; look <= 8; look++) {
        const sib = children[i + look];
        if (!sib) break;
        if (!img && sib.querySelector && sib.querySelector('.cmp-image')) {
          img = sib.querySelector('.cmp-image');
        }
        if (!desc && sib.tagName === 'P') {
          desc = sib;
        }
        // If we found both, stop looking ahead
        if (img && desc) break;
      }
      // Compose text cell (heading + description)
      const textCell = desc ? [heading, desc] : [heading];
      rows.push([img ? img : '', textCell]);
    }
    i++;
  }

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  contentFragment.replaceWith(table);
}
