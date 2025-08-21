/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the header columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the three logical columns by classname
  const children = Array.from(grid.children);
  const logoCol = children.find(d => d.className.includes('image'));
  const navCol = children.find(d => d.className.includes('navigation'));
  const searchCol = children.find(d => d.className.includes('search'));

  // For each column, get the main content block or fallback to col itself
  let logoContent = logoCol ? (logoCol.querySelector('[data-cmp-is="image"]') || logoCol) : '';
  let navContent = navCol ? (navCol.querySelector('nav') || navCol) : '';
  let searchContent = searchCol ? (searchCol.querySelector('section') || searchCol) : '';

  // The header row must be a single cell: ['Columns (columns2)']
  const headerRow = ['Columns (columns2)'];
  const contentRow = [logoContent, navContent, searchContent];

  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
