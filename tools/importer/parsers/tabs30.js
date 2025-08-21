/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Table header as specified in the example
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // Extract tab labels
  const tabLabelEls = tabsEl.querySelectorAll('.cmp-tabs__tablist > li');
  // Extract corresponding tab panels
  const tabPanelEls = tabsEl.querySelectorAll('.cmp-tabs__tabpanel');

  // Defensive: If there is a mismatch, continue only up to min length
  const minLen = Math.min(tabLabelEls.length, tabPanelEls.length);
  for (let i = 0; i < minLen; i++) {
    const label = tabLabelEls[i].textContent.trim();
    const panel = tabPanelEls[i];
    let tabContent;
    if (panel) {
      // Reference the main content fragment/article inside each tab panel
      const frag = panel.querySelector('article.cmp-contentfragment');
      if (frag) {
        tabContent = frag;
      } else {
        // Fallback: aggregate all panel children into a wrapper div
        const wrapper = document.createElement('div');
        while (panel.firstChild) {
          wrapper.appendChild(panel.firstChild);
        }
        tabContent = wrapper;
      }
    } else {
      // If missing, use an empty string
      tabContent = '';
    }
    rows.push([label, tabContent]);
  }

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(block, element);
}
