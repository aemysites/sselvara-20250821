/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels (order matters)
  const tabLabels = [];
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (order must match tab labels)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare cells for the block table (header + 1 row per tab)
  const cells = [];
  // Header row
  cells.push(['Tabs (tabs13)']);
  // One row per tab: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Gather all meaningful direct children of the panel
    // Prefer to use the .contentfragment inside panel if exists, otherwise take all children
    let tabContent = null;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // collect all direct children that are not empty
      const validNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === 1) {
          // element: include if it has visible content
          return node.textContent.trim().length > 0 || node.querySelector('*');
        }
        if (node.nodeType === 3) {
          // text node: include if not blank
          return node.textContent.trim().length > 0;
        }
        return false;
      });
      if (validNodes.length === 1) {
        tabContent = validNodes[0];
      } else if (validNodes.length > 1) {
        tabContent = validNodes;
      } else {
        // fallback: use panel innerHTML as a div
        const div = document.createElement('div');
        div.innerHTML = panel.innerHTML;
        tabContent = div;
      }
    }
    cells.push([label, tabContent]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
