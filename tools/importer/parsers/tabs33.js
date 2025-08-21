/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block. We expect a .cmp-tabs inside the given element.
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row exactly matching the example
  const headerRow = ['Tabs (tabs33)'];

  // Get tab labels from the tablist (in order)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());

  // Get all tab panels in order
  // Only direct children of tabsBlock with role="tabpanel" and class .cmp-tabs__tabpanel
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: handle missing/mismatched panels
  const rows = tabLabels.map((label, idx) => {
    const panel = tabPanels[idx];
    let content;
    if (panel) {
      // Reference the direct article.cmp-contentfragment element if present
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // Reference all children of panel (if any)
        const children = Array.from(panel.children);
        if (children.length === 1) {
          content = children[0];
        } else if (children.length > 1) {
          content = children;
        } else {
          content = '';
        }
      }
    } else {
      content = '';
    }
    return [label, content];
  });

  // Final table: first row is header, then each tab label and content
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block in the DOM with the block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
