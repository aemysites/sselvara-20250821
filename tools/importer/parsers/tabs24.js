/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the supplied element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim());
  }

  // Extract tab panels
  const tabPanels = Array.from(
    tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Fallback to generic tab names if mismatch
  if (tabLabels.length !== tabPanels.length) {
    tabLabels = tabPanels.map((panel, idx) => `Tab ${idx + 1}`);
  }

  // Compose exactly as: [header], [label1, content1], [label2, content2], ...
  const cells = [ ['Tabs (tabs24)'] ];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Take all child nodes that have meaningful content
      const nodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        return true;
      });
      if (nodes.length === 1) {
        content = nodes[0];
      } else if (nodes.length > 1) {
        content = nodes;
      } else {
        content = '';
      }
    } else {
      content = '';
    }
    cells.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
