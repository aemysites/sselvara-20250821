/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs block inside the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 1. Get all tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabElements = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabOrder = [];
  const tabIdToLabel = {};

  tabElements.forEach(tab => {
    const label = tab.textContent.trim();
    const controls = tab.getAttribute('aria-controls');
    if (controls) {
      tabIdToLabel[controls] = label;
      tabOrder.push(controls);
    }
  });

  // 2. Get all tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));
  // Use tabOrder to preserve the label order from the UI
  const tabPanelMap = {};
  tabPanels.forEach(panel => {
    tabPanelMap[panel.getAttribute('id')] = panel;
  });

  // 3. Build the rows: header, then one row per tab (label, content)
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  tabOrder.forEach(tabPanelId => {
    const label = tabIdToLabel[tabPanelId] || '';
    const panel = tabPanelMap[tabPanelId];
    if (!panel) return;

    // Find the main content for this tab
    // Try to find .cmp-contentfragment, else take panel's children
    let contentElem = null;
    const cf = panel.querySelector('article.cmp-contentfragment, .cmp-contentfragment');
    if (cf) {
      contentElem = cf;
    } else {
      // fallback: wrap all children in a <div> for one cell
      const wrapper = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => wrapper.appendChild(node));
      contentElem = wrapper;
    }
    rows.push([label, contentElem]);
  });

  // 4. Create the table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
