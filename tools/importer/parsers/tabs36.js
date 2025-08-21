/* global WebImporter */
export default function parse(element, { document }) {
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Gather the tab labels and associated tab panels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare header row
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, add a row with [label text, content]
  tabLabelEls.forEach(labelEl => {
    const labelText = labelEl.textContent.trim();
    const panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === labelEl.id);
    let tabContent;
    if (panel) {
      // Prefer the article if it exists, otherwise panel
      const cf = panel.querySelector('article.cmp-contentfragment');
      tabContent = cf ? cf : panel;
    } else {
      tabContent = document.createTextNode('');
    }
    rows.push([labelText, tabContent]);
  });

  // Build the table and replace the tabs block
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(blockTable);
}
