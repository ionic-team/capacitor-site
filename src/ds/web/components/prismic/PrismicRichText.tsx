import React from 'react';

import PrismicRichTextLib from 'prismic-richtext';
import PrismicHelpers from 'prismic-helpers';

import { createScript, embeds } from './embeds';

import { Heading, Paragraph } from '../../../core';
import { slugify } from '../../utils/slugify';
import { applyProps } from '../../../core/components/common';
import { Components } from '../../../components';

let Poster: Components.UiHeading['poster'];
let Leading: Components.UiParagraph['leading'];
let ParagraphLevel: Components.UiParagraph['level'];


export function htmlSerializer(type: string, element: any, _content: string | null, children: any) {
  // give headings an ID
  switch (type) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
    case 'heading4':
    case 'heading5':
    case 'heading6':
      const level = parseInt(type[type.length - 1], 10);
      const id = `h-${slugify(element.text)}`;
      return (
        <Heading {...{id, level, poster: Poster}}>
          {children}
        </Heading>
      );
    case 'paragraph':
      return <Paragraph {...{level: ParagraphLevel, leading: Leading}}>{children}</Paragraph>;

    case 'preformatted':
      return (
        <pre>
          <code>{children}</code>
        </pre>
      );

    // Return null to stick with the default behavior for all other elements
    default:
      return null;
  }
}

function slugifyHeading(children) {
  return children.reduce((id, c) => {
    return id + slugify(c[0]);
  }, '');
}

function serialize(linkResolver: any, elements: any, type: any, element: any, content: any, children: any, index: any, routerLink: boolean = false, router: Router = null) {
  if (elements[type]) {
    return serializeElement(elements[type], type, element, content, children, index);
  }
  const Elements = PrismicRichTextLib.Elements;

  switch (type) {
    case Elements.heading1:
      return serializeStandardTag('h1', element, children, index, { id: slugifyHeading(children) });
    case Elements.heading2:
      return serializeStandardTag('h2', element, children, index, { id: slugifyHeading(children) });
    case Elements.heading3:
      return serializeStandardTag('h3', element, children, index, { id: slugifyHeading(children) });
    case Elements.heading4:
      return serializeStandardTag('h4', element, children, index, { id: slugifyHeading(children) });
    case Elements.heading5:
      return serializeStandardTag('h5', element, children, index, { id: slugifyHeading(children) });
    case Elements.heading6:
      return serializeStandardTag('h6', element, children, index, { id: slugifyHeading(children) });
    case Elements.paragraph:
      return serializeStandardTag('p', element, children, index);
    case Elements.preformatted:
      return serializeStandardTag('pre', element, children, index);
    case Elements.strong:
      return serializeStandardTag('strong', element, children, index);
    case Elements.em:
      return serializeStandardTag('em', element, children, index);
    case Elements.listItem:
      return serializeStandardTag('li', element, children, index);
    case Elements.oListItem:
      return serializeStandardTag('li', element, children, index);
    case Elements.list:
      return serializeStandardTag('ul', element, children, index);
    case Elements.oList:
      return serializeStandardTag('ol', element, children, index);
    case Elements.image:
      return serializeImage(linkResolver, element, index);
    case Elements.embed:
      return serializeEmbed(element, index);
    case Elements.hyperlink:
      return serializeHyperlink(linkResolver, element, children, index, routerLink, router);
    case Elements.label:
      return serializeLabel(element, children, index);
    case Elements.span:
      return serializeSpan(content);
    default:
      return null;
  }
}

function propsWithUniqueKey(props = {}, key: any) {
  return Object.assign(props, { key });
}

function serializeElement(Element: any, type: any, props: any, _content: any, children: any, index: any) {
  return (
    <Element
      key={`element-${type}-${index + 1}`}
      {...props}
      {...(type === 'image' ? { src: props.url, url: undefined } : null)}>
      {children && children.length ? children : undefined}
    </Element>
  );
}

function serializeStandardTag(Tag: any, element: any, children: any, key: any, extra: any = {}) {
  const props = element.label ? Object.assign(extra, { className: element.label }) : extra;
  return <Tag {...propsWithUniqueKey(props, key)}>{children}</Tag>;
}

function serializeHyperlink(linkResolver: any, element: any, children: any, key: any, routerLink: boolean = false, router: Router = null) {
  const targetAttr = element.data.target ? { target: element.data.target } : {};
  const relAttr = element.data.target ? { rel: 'noopener' } : {};

  let href = PrismicHelpers.Link.url(element.data, linkResolver);

  if (element.data.url) {
    const parsed = new URL(element.data.url);
    if (parsed.hostname.indexOf('.') < 0) {
      // Allow relative links
      href = `/${parsed.hostname}${parsed.pathname + parsed.search + parsed.hash}`;
    }
  }

  const props = Object.assign({ href }, targetAttr, relAttr);

  if (routerLink) {
    return <a {...propsWithUniqueKey(props, key)} {...routerHref(props.href, router)}>{children}</a>;
  } else {
    return <a {...propsWithUniqueKey(props, key)}>{children}</a>;
  }
}

function serializeLabel(element: any, children: any, key: any) {
  const props = element.data ? Object.assign({}, { className: element.data.label }) : {};
  return <span {...propsWithUniqueKey(props, key)}>{children}</span>;
}

function serializeSpan(content: any) {
  if (content) {
    return content.split('\n').reduce((acc: any, p: any) => {
      if (acc.length === 0) {
        return [p];
      } else {
        const brIndex = (acc.length + 1) / 2 - 1;
        const br = <br {...propsWithUniqueKey({}, brIndex)} />;
        return acc.concat([br, p]);
      }
    }, []);
  } else {
    return null;
  }
}

function serializeImage(linkResolver: any, element: any, key: any) {
  const linkUrl = element.linkTo ? PrismicHelpers.Link.url(element.linkTo, linkResolver) : null;
  const linkTarget = element.linkTo && element.linkTo.target ? { target: element.linkTo.target } : {};
  const relAttr = linkTarget.target ? { rel: 'noopener' } : {};
  const img = <img loading={'lazy'} src={element.url} alt={element.alt || ''} />;

  return (
    <p {...propsWithUniqueKey({ className: [element.label || '', 'block-img'].join(' ') }, key)}>
      {linkUrl ? <a {...Object.assign({ href: linkUrl }, linkTarget, relAttr)}>{img}</a> : img}
    </p>
  );
}

function serializeEmbed(element: any, key: any) {
  if (embeds[element.oembed.provider_name]) {
    createScript(embeds[element.oembed.provider_name]);
  }

  const className = `embed embed-${element.oembed.provider_name.toLowerCase()}`;
  const props = Object.assign(
    {
      'data-oembed': element.oembed.embed_url,
      'data-oembed-type': element.oembed.type,
      'data-oembed-provider': element.oembed.provider_name,
      ref: (ref: any) => {
        if (embeds[element.oembed.provider_name]) {
          embeds[element.oembed.provider_name].load(ref);
        }
      },
    },
    element.label ? { className: `${className} ${element.label}` } : { className },
  );

  const embedHtml = <div innerHTML={element.oembed.html} />;

  return <div {...propsWithUniqueKey(props, key)}>{embedHtml}</div>;
}

export const asText = (structuredText: any) => PrismicRichTextLib.asText(structuredText, null);

interface Props {
  richText: any;
  linkResolver?: any;
  htmlSerializer?: any;
  routerLink?: boolean;
  router?: Router;
  paragraphLevel?: Components.UiParagraph['level'];
  leading?: Components.UiParagraph['leading'];
  poster?: Components.UiHeading['poster'];
  [key: string]: any;
}

const PrismicRichText = ({ richText, linkResolver, htmlSerializerProp = htmlSerializer,
                           routerLink, router, paragraphLevel, poster, leading, ...props }: Props) => {
  // I hate doing this with closure shenanigans, but there aren't many good ways
  // to pass data through the Prismic library's serialize function to the custom
  // serializer ~pg
  ParagraphLevel = paragraphLevel > 0 && paragraphLevel < 7 ? paragraphLevel : undefined;
  Poster = poster;
  Leading= leading;

  const serializedChildren = PrismicRichTextLib.serialize(
    richText,
    (...args) => serialize.apply(null, [linkResolver, {}, ...args, routerLink, router]),
    // serialize.bind(null, linkResolver, {}), 
    htmlSerializerProp,
  );

  return serializedChildren;
  /* TODO(docusaurus):
  return serializedChildren.map(Child => {
    Child.props = applyProps(props, Child.props);
    return Child;
  });
  */
};

export default PrismicRichText;
