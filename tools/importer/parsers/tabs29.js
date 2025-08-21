/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: tolerate wrapping structure
  let cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) {
    // fallback: if the .cmp-tabs is the element itself
    cmpTabs = element.classList.contains('cmp-tabs') ? element : null;
  }
  if (!cmpTabs) return;

  // Get tab labels in order
  const tabList = cmpTabs.querySelector('[role="tablist"], .cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"], .cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels in document order
  const tabPanels = [];
  cmpTabs.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel').forEach(panel => {
    tabPanels.push(panel);
  });

  // Build rows
  const headerRow = ['Tabs (tabs29)']; // exact header
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive check for missing panel
    let tabContent;
    if (panel) {
      // Find primary contentfragment/article inside
      const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
      tabContent = cf ? cf : panel;
    } else {
      tabContent = document.createElement('div'); // empty div if missing
    }
    rows.push([label, tabContent]);
  }

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  cmpTabs.replaceWith(table);
}
