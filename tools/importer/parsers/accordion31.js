/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function: extract only the main contentfragment article
  const cfArticle = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Utility: Finds all h2 titles in content, and their following content (p, images, blockquotes, etc.) until next h2
  function extractAccordionSections(root) {
    const children = Array.from(root.childNodes).filter(n => n.nodeType === 1); // Only element nodes
    const sections = [];
    let currentTitle = null;
    let currentContent = [];

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      // Title sections: h2.cmp-title__text wrapped in div.cmp-title
      const h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
      if (h2) {
        if (currentTitle && currentContent.length) {
          sections.push({ title: currentTitle, content: currentContent });
        }
        currentTitle = h2;
        currentContent = [];
        continue;
      }
      // Collect as content if we already have a currentTitle
      if (currentTitle) {
        // If this node has interesting children, flatten them in order (e.g., text/image grids)
        // Otherwise, just add the node
        if (node.matches('div')) {
          // Collect .cmp-text, .cmp-image inside, or p directly inside
          const textEls = Array.from(node.querySelectorAll('.cmp-text'));
          const imgEls = Array.from(node.querySelectorAll('.cmp-image'));
          const pEls = Array.from(node.querySelectorAll('p'));
          if (textEls.length > 0 || imgEls.length > 0 || pEls.length > 0) {
            currentContent.push(...textEls, ...imgEls, ...pEls.filter(p => !textEls.includes(p)));
            continue;
          }
        }
        currentContent.push(node);
      }
    }
    // Push the last one
    if (currentTitle && currentContent.length) {
      sections.push({ title: currentTitle, content: currentContent });
    }
    return sections;
  }

  // Extract accordion sections only (by h2)
  const sections = extractAccordionSections(cfElements);
  if (!sections.length) return;

  // Table header as required
  const headerRow = ['Accordion (accordion31)'];
  const cells = [headerRow];
  sections.forEach(section => {
    // Filter out empty nodes (no text and no images)
    const filteredContent = (section.content || []).filter(n => {
      if (!n) return false;
      if (n.nodeType === 3 && !n.textContent.trim()) return false;
      if (n.nodeType === 1 && !n.textContent.trim() && !n.querySelector('img')) return false;
      return true;
    });
    if (!section.title || filteredContent.length === 0) return;
    cells.push([
      section.title,
      filteredContent.length === 1 ? filteredContent[0] : filteredContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
