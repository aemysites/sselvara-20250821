/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from the tablist in order
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(tabsEl.querySelectorAll('[role="tabpanel"]'));

  // Prepare header row: block name exactly as required
  const headerRow = ['Tabs (tabs28)'];

  // Prepare tab label row (2nd row): each label in its own cell (column)
  const tabLabelRow = tabLabels;

  // Prepare tab content row(s) - one row, each cell is the content of the corresponding tab's panel
  // If no content found, use empty string
  const contentRow = tabPanels.map(panel => {
    // Find the main content element inside each tab, usually <article> or direct children
    // Reference existing elements, do not clone
    // In this implementation, we will reference the first child inside contentfragment > article, if present
    const contentFragment = panel.querySelector('article');
    if (contentFragment) {
      // Usually the article contains the content we want
      return contentFragment;
    } else {
      // If no article, use panel contents itself
      // If panel is empty, use empty string
      // Try to find any direct content child
      if (panel.children.length > 0) {
        return panel.children[0];
      } else {
        return '';
      }
    }
  });

  // Build the cells array: header, tab labels, tab content
  // Each row must be an array of columns, so contentRow is already array of cells
  const cells = [
    headerRow,
    tabLabelRow,
    contentRow
  ];

  // Create the block table using WebImporter.DOMUtils.createTable
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element's tabs block with the new table
  tabsEl.replaceWith(block);
}
