/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container inside this element
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  // Find the tabs component inside tabsContainer
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li'));

  // Prepare the header row: exactly one cell, per requirements
  const headerRow = ['Tabs (tabs11)'];

  // Prepare the tab rows: each row is [Tab Label, Tab Content]
  const tabRows = tabItems.map(tabItem => {
    // Tab label
    const label = tabItem.textContent.trim();
    // Find corresponding tabpanel by aria-controls
    const panelId = tabItem.getAttribute('aria-controls');
    const tabPanel = panelId ? cmpTabs.querySelector(`#${panelId}`) : null;
    let tabContentEl = tabPanel;
    // Defensive: If tabPanel is null or empty, use empty div
    if (!tabPanel) {
      tabContentEl = document.createElement('div');
    }
    return [label, tabContentEl];
  });

  // Compose cells: header row + tab rows
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs container with the block
  tabsContainer.replaceWith(block);
}
