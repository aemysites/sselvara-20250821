/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (as in the provided HTML)
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());
  if (!tabLabels.length) return;

  // Get tab panels, preserving order with tab labels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));
  // Defensive: Only process as many panels as there are labels
  const panelCount = Math.min(tabLabels.length, tabPanels.length);

  // Prepare content cells for each tab
  const tabContentCells = [];
  for (let i = 0; i < panelCount; i++) {
    const panel = tabPanels[i];
    // The main content is usually a .contentfragment > article
    let mainContent = null;
    // Look for contentfragment's article
    const article = panel.querySelector('article');
    if (article) {
      mainContent = article;
    } else if (panel.children.length === 1) {
      // Use the only child if present
      mainContent = panel.children[0];
    } else {
      mainContent = panel;
    }
    tabContentCells.push(mainContent);
  }

  // If there are fewer panels than labels, fill with empty string
  for (let i = tabContentCells.length; i < tabLabels.length; i++) {
    tabContentCells.push('');
  }

  // Table header row (block name as in example)
  const headerRow = ['Tabs (tabs7)'];

  // Tab labels row (one cell per label)
  const labelsRow = tabLabels;

  // Tab content row (one cell per tab)
  const contentsRow = tabContentCells;

  const cells = [
    headerRow,
    labelsRow,
    contentsRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsWrapper with the new block table
  tabsWrapper.replaceWith(block);
}
