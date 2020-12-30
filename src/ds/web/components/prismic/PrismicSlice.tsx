import { h } from '@stencil/core';
import { Blockquote } from '../../../core';
import { PrismicRichText, htmlSerializer } from './PrismicRichText';
import { trackClick } from '../../utils/tracking-service';

interface PrismicSlice {
  slice_type: string;
  slice_label: string;
  items: any[];
  primary: {
    content: any; //RichTextBlock;
    [key: string]: any;
  };
}

interface Props {
  slice: PrismicSlice;
  key: string | number;
}

const SliceNormalText = ({ slice }: Props) => (
  <PrismicRichText richText={slice.primary.content} htmlSerializer={htmlSerializer} />
);

const SliceRawHtml = ({ slice }: Props) => (
  <div class="prismic-raw-html" innerHTML={slice.primary.html_content.map((c: any) => c.text).join('')} />
);

const SliceQuote = ({ slice }: Props) => (
  <Blockquote>
    <div>
      <PrismicRichText richText={slice.primary.quote} />
    </div>
    {slice.primary.name ? (
      <cite>
        {slice.primary.name}
        <span>{slice.primary.description}</span>
      </cite>
    ) : null}
  </Blockquote>
);

const SliceFloatingImage = ({ slice }: Props) => (
  <figure>
    <img loading={'lazy'} src={slice.primary.illustration.url} alt={slice.primary.illustration.alt} />
  </figure>
);

const SliceAd = ({ slice }: Props) => {
  return (
  <aside class="prismic-ad">
    <a href={slice.primary.link.url} 
       target={slice.primary.link.target}
       onClick={e => trackClick(`${location.host}${location.pathname}`, e, 'Resource Center')}>
      <PrismicRichText richText={slice.primary.text} />
      <img class="prismic-ad__image"
           loading={'lazy'}
           alt={slice.primary.image.alt} 
           height={parseInt(slice.primary.image.dimensions.height, 10) / 2}
           width={parseInt(slice.primary.image.dimensions.width, 10) / 2}
           src={slice.primary.image.url} 
           srcset={`${slice.primary.image['1x'].url} 1x, ${slice.primary.image.url} 2x`}
           />
    </a>
  </aside>
)};

const PrismicBodySlice = ({ slice, key }: Props) => {
  switch (slice.slice_type) {
    case 'normal_text':
      return <SliceNormalText slice={slice} key={key} />;
    case 'raw_html':
      return <SliceRawHtml slice={slice} key={key} />;
    case 'quote':
      return <SliceQuote slice={slice} key={key} />;
    case 'floating_image':
      return <SliceFloatingImage slice={slice} key={key} />;
    case 'ad':
      return <SliceAd slice={slice} key={key} />;
  }
  return null;
};

export { PrismicBodySlice };
