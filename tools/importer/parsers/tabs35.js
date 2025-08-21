/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  let tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs, .tabs');
  if (tabsBlock && !tabsBlock.classList.contains('cmp-tabs')) {
    const maybeTabs = tabsBlock.querySelector('.cmp-tabs');
    if (maybeTabs) tabsBlock = maybeTabs;
  }
  if (!tabsBlock) return;

  // Get tab labels from tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.children)
      .filter(li => li.matches('[role="tab"]'))
      .map(li => li.textContent.trim());
  }

  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Compose header row: exactly one cell
  const headerRow = ['Tabs (tabs35)'];
  // Compose tab label row: one cell per tab
  const tabLabelRow = tabLabels;
  // Compose tab rows: each [tab label, tab content]
  const tabRows = tabPanels.map((panel, i) => {
    let content = panel.querySelector('article.cmp-contentfragment') || panel;
    if (
      content.tagName === 'ARTICLE' &&
      content.querySelector('.cmp-contentfragment__elements')
    ) {
      content = content.querySelector('.cmp-contentfragment__elements');
    }
    return [tabLabels[i] || '', content];
  });
  // Compose full cells array
  const cells = [headerRow, tabLabelRow, ...tabRows];
  // Create the table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
