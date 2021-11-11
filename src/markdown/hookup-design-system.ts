export const hookUpDesignSystem = (frag: DocumentFragment) => {
  const headings = frag.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const paragraphs = frag.querySelectorAll(
    'p:not([class*="ui-paragraph"]):not([class*="ui-heading"])',
  );
  const listsItems = frag.querySelectorAll('ul li, ol li');

  headings.forEach(heading => {
    const level = heading.nodeName?.split('')[1];

    heading.classList.add(`ui-heading`);
    heading.classList.add(`ui-heading-${level}`);
    heading.classList.add(`ui-theme--editorial`);
  });

  paragraphs.forEach(paragraph => {
    paragraph.classList.add(`ui-paragraph`);
    paragraph.classList.add(`ui-paragraph--prose`);
    paragraph.classList.add(`ui-paragraph-3`);
  });

  listsItems.forEach(paragraph => {
    paragraph.classList.add(`ui-paragraph`);
    paragraph.classList.add(`ui-paragraph--prose`);
    paragraph.classList.add(`ui-paragraph-3`);
  });

  return frag;
};