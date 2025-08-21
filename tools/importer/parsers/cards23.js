/* global WebImporter */
export default function parse(element, { document }) {
  function extractCardRows(sectionNodes) {
    return Array.from(sectionNodes).map((section) => {
      // image
      const img = section.querySelector('.image img');
      // name
      const h3 = section.querySelector('h3.cmp-title__text');
      // subtitle
      const h5 = section.querySelector('h5.cmp-title__text');
      // social buttons
      const btnContainer = section.querySelector('.buildingblock');
      let socialLinks = [];
      if (btnContainer) {
        socialLinks = Array.from(btnContainer.querySelectorAll('a.cmp-button'));
      }
      const textCell = [];
      if (h3) textCell.push(h3);
      if (h5) {
        textCell.push(document.createElement('br'));
        textCell.push(h5);
      }
      if (socialLinks.length) {
        textCell.push(document.createElement('br'));
        const div = document.createElement('div');
        socialLinks.forEach((a) => div.appendChild(a));
        textCell.push(div);
      }
      return [img, textCell];
    });
  }

  // Find card sections
  const allSections = Array.from(element.querySelectorAll('.cmp-experiencefragment--contributor'));
  // Partition into Contributors & Guides
  // Contributors come before the 'WKND Guides' header
  // Guides come after it
  const guideHeader = Array.from(element.querySelectorAll('h2.cmp-title__text')).find(h => h.textContent.trim() === 'WKND Guides');
  let contributorSections = [];
  let guideSections = [];
  if (guideHeader) {
    // Find index of guideHeader's parent section
    const guideHeaderDiv = guideHeader.closest('.title');
    let foundGuide = false;
    for (const sec of allSections) {
      // Use position in DOM: contributors are before guideHeaderDiv, guides are after
      if (!foundGuide && sec.compareDocumentPosition(guideHeaderDiv) & Node.DOCUMENT_POSITION_PRECEDING) {
        contributorSections.push(sec);
      } else {
        foundGuide = true;
        guideSections.push(sec);
      }
    }
  } else {
    contributorSections = allSections;
    guideSections = [];
  }

  // Extract contributor heading & intro
  const contributorHeadingDiv = Array.from(element.querySelectorAll('.title.cmp-title--underline')).find(div => {
    const h2 = div.querySelector('h2.cmp-title__text');
    return h2 && h2.textContent.trim() === 'Our Contributors';
  });
  let contributorHeading = null;
  if (contributorHeadingDiv) {
    contributorHeading = contributorHeadingDiv.querySelector('h2.cmp-title__text');
  }
  const contributorIntroDiv = Array.from(element.querySelectorAll('.text.cmp-text--font-small')).find(div => {
    return div.textContent && div.textContent.toLowerCase().includes('bringing you the most compelling stories');
  });

  // Extract guide heading & intro
  const guideHeadingDiv = Array.from(element.querySelectorAll('.title.cmp-title--underline')).find(div => {
    const h2 = div.querySelector('h2.cmp-title__text');
    return h2 && h2.textContent.trim() === 'WKND Guides';
  });
  let guideHeading = null;
  if (guideHeadingDiv) {
    guideHeading = guideHeadingDiv.querySelector('h2.cmp-title__text');
  }
  const guideIntroDiv = Array.from(element.querySelectorAll('.text.cmp-text--font-small')).find(div => {
    return div.textContent && div.textContent.toLowerCase().includes('extraordinary travel guides');
  });

  // Build block tables for each group
  function buildCardsBlock(headerElem, introElem, cardSections) {
    const blockRows = [['Cards (cards23)']];
    blockRows.push(...extractCardRows(cardSections));
    const blockTable = WebImporter.DOMUtils.createTable(blockRows, document);
    // Compose: heading, intro, table
    // All content is referenced directly
    const output = [];
    if (headerElem) output.push(headerElem);
    if (introElem) output.push(introElem);
    output.push(blockTable);
    return output;
  }

  const finalOutput = [];
  // Contributors section
  if (contributorSections.length) {
    finalOutput.push(...buildCardsBlock(contributorHeading, contributorIntroDiv, contributorSections));
  }
  // Guides section
  if (guideSections.length) {
    finalOutput.push(...buildCardsBlock(guideHeading, guideIntroDiv, guideSections));
  }

  // Replace original element
  if (finalOutput.length) {
    element.replaceWith(...finalOutput);
  }
}
