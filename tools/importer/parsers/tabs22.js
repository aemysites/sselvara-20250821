/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container - look for .tabs as a direct child (not nested)
  const tabsContainers = Array.from(element.querySelectorAll(':scope > div.tabs'));
  if (!tabsContainers.length) return;

  tabsContainers.forEach((tabsContainer) => {
    // Find the cmp-tabs element inside this container
    const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
    if (!cmpTabs) return;

    // Get tab labels from the tablist
    const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
    // Defensive: check for existence and children
    const tabLabels = tabList
      ? Array.from(tabList.children).map((li) => li.textContent.trim())
      : [];

    // Get all tabpanel elements in appearance order
    // Only direct children of cmp-tabs, not nested or unrelated panels
    const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
    
    // Prepare table structure: header row, then one row per tab
    const headerRow = ['Tabs (tabs22)'];
    const rows = tabLabels.map((label, idx) => {
      // Defensive for mismatches in tabs and panels
      // Get the panel if it exists
      let panel = tabPanels[idx];
      // Fallback if the panel is missing
      if (!panel) {
        panel = document.createElement('div');
      }
      // Use the referenced panel element directly (do not clone)
      return [label, panel];
    });

    // Build the table array
    const cells = [headerRow, ...rows];

    // Create the table block
    const block = WebImporter.DOMUtils.createTable(cells, document);

    // Replace the tabsContainer with the new block table
    tabsContainer.replaceWith(block);
  });
}
