/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract all tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  if (tabLabels.length === 0) return;

  // Extract all tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabPanels.length === 0) return;

  // Prepare header row (block name as per example, single cell)
  const headerRow = ['Tabs (tabs17)'];

  // Second row: all tab names (bold)
  const tabNamesRow = tabLabels.map(label => {
    // Use a <strong> element for the tab label, referencing the existing node if possible
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    return strong;
  });

  // Third row: all tab contents (reference DOM nodes, not cloning)
  const tabContentsRow = tabPanels.map(panel => {
    // Try to find the main content (usually a .contentfragment > article or just article)
    // If not, fallback to panel's children
    let mainContent = null;
    // Prefer the first article within the panel
    const article = panel.querySelector('article');
    if (article) {
      mainContent = article;
    } else {
      // If there's no article, find main block (contentfragment or just all children)
      const cf = panel.querySelector('.contentfragment');
      if (cf) {
        mainContent = cf;
      } else {
        // As a fallback, return all children of the panel
        mainContent = document.createElement('div');
        Array.from(panel.childNodes).forEach(node => {
          mainContent.appendChild(node);
        });
      }
    }
    return mainContent;
  });

  // Compose the table: header, tab names, then a single row with all tab contents in matching order
  const cells = [
    headerRow,
    tabNamesRow,
    tabContentsRow
  ];

  // Create the block table and replace the tabs block with the table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
