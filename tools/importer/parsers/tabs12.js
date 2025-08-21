/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the section
  const tabsEl = Array.from(element.querySelectorAll(':scope > div, :scope > main, :scope > section'))
    .find(el => el.classList && el.classList.contains('tabs'));
  if (!tabsEl) return;

  // Find the .cmp-tabs inside tabs
  const cmpTabs = tabsEl.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.children)
      .filter(li => li.getAttribute('role') === 'tab')
      .map(li => li.textContent.trim());
  }

  // Extract tab panel contents
  // Each tabpanel contains a .cmp-contentfragment (with possibly images, text, lists, etc)
  const tabPanels = Array.from(cmpTabs.querySelectorAll(':scope > div[role="tabpanel"]'));

  // Build the block table rows
  const rows = [];
  // Block header row (as per spec)
  rows.push(['Tabs (tabs12)']);

  // For each tab, add a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // Use the whole contentfragment (not clones)
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        tabContent = cf;
      } else {
        // fallback to all children
        const nodes = Array.from(panel.childNodes).filter(n => {
          // Filter out empty text
          if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
          // Only keep elements
          return n.nodeType === Node.ELEMENT_NODE;
        });
        tabContent = nodes.length === 1 ? nodes[0] : nodes;
      }
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  }

  // Create table block and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
