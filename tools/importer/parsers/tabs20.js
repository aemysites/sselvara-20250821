/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  // Get tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Only proceed if tab count matches panel count
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Header row: Table name as in the spec
  const headerRow = ['Tabs (tabs20)'];

  // First row: Tab labels as <strong> elements
  const labelRow = tabLabels.map(tab => {
    // Use the label content, keep formatting
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // Second row: Tab panel content, each as a referenced existing element (not cloned)
  const contentRow = tabPanels.map(panel => {
    // Let's reference only the main content for each tab. Usually, a .contentfragment or a single main child.
    // Find the .contentfragment inside the panel
    const frag = panel.querySelector('.contentfragment, article.cmp-contentfragment, .cmp-contentfragment');
    if (frag) return frag;
    // Else if there is only one child, use it; else, use all children
    const kids = Array.from(panel.children).filter(n => n.nodeType === 1);
    if (kids.length === 1) return kids[0];
    if (kids.length > 1) return kids;
    // Else fallback to the panel itself
    return panel;
  });

  // Compose cells for the table
  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block in the DOM with the table
  tabs.replaceWith(block);
}
