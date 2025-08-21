/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: look for the first .cmp-tabs within element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab headers (li inside .cmp-tabs__tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabHeaders = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get all tab panels (div.cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build rows: header, then [tab name, tab content] pairs
  const rows = [];
  // Header row as in the example, exactly:
  rows.push(['Tabs (tabs8)']);

  // For each tab, get its label and content
  tabHeaders.forEach((header, idx) => {
    // Label
    const tabLabel = header.textContent.trim();
    // Try to find the associated tabpanel
    const tabPanelId = header.getAttribute('aria-controls');
    let contentElem = null;
    for (let panel of tabPanels) {
      if (panel.id === tabPanelId) {
        contentElem = panel;
        break;
      }
    }
    // Fallback: by order if matching id fails
    if (!contentElem && tabPanels[idx]) {
      contentElem = tabPanels[idx];
    }
    // Defensive: if still none, use an empty div
    if (!contentElem) {
      contentElem = document.createElement('div');
    }
    // Reference the real element (do not clone)
    rows.push([tabLabel, contentElem]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
