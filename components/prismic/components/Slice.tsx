import { trackClick } from "../../../util/tracking-service";
import Blockquote from "../../ui/Blockquote";
import PrismicRichText, { htmlSerializer } from "./RichText";

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
}

const SliceNormalText = ({ slice }: Props) => (
  <PrismicRichText
    render={slice.primary.content}
    htmlSerializer={htmlSerializer}
  />
);

const SliceRawHtml = ({ slice }: Props) => (
  <div
    className="prismic-raw-html"
    dangerouslySetInnerHTML={{
      __html: slice.primary.html_content.map((c: any) => c.text).join(""),
    }}
  />
);

const SliceQuote = ({ slice }: Props) => (
  <Blockquote>
    <div>
      <PrismicRichText render={slice.primary.quote} />
    </div>
    {slice.primary.name ? (
      <cite>
        {slice.primary.name}
        <span>{slice.primary.description}</span>
      </cite>
    ) : null}
  </Blockquote>
);

const SliceFloatingImage = ({ slice }: Props) => {
  return (
    <>
      <aside
        className={`prismic-floating-image ${slice.primary.side.toLowerCase()}`}
      >
        <img
          loading={"lazy"}
          src={slice.primary.illustration.url}
          alt={slice.primary.illustration.alt}
        />
        {slice.primary.caption.length != 0 ? (
          <caption>{slice.primary.caption[0].text}</caption>
        ) : (
          ""
        )}
      </aside>
    </>
  );
};

const SliceAd = ({ slice }: Props) => {
  return (
    <aside className="prismic-ad">
      <a
        href={slice.primary.link.url}
        target={slice.primary.link.target}
        onClick={(e) =>
          trackClick(
            `${location.host}${location.pathname}`,
            e.nativeEvent,
            "Resource Center"
          )
        }
      >
        <PrismicRichText render={slice.primary.text} />
        <img
          className="prismic-ad__image"
          loading={"lazy"}
          alt={slice.primary.image.alt}
          height={parseInt(slice.primary.image.dimensions.height, 10) / 2}
          width={parseInt(slice.primary.image.dimensions.width, 10) / 2}
          src={slice.primary.image.url}
          srcSet={`${slice.primary.image["1x"].url} 1x, ${slice.primary.image.url} 2x`}
        />
      </a>
    </aside>
  );
};

const SliceYoutube = ({ slice }: Props) => {
  return (
    <div className="prismic-youtube-container">
      <iframe
        src={`https://www.youtube.com/embed/${slice.primary.vid}`}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const PrismicBodySlice = ({ slice }: Props) => {
  switch (slice.slice_type) {
    case "normal_text":
      return <SliceNormalText slice={slice} />;
    case "raw_html":
      return <SliceRawHtml slice={slice} />;
    case "quote":
      return <SliceQuote slice={slice} />;
    case "floating_image":
      return <SliceFloatingImage slice={slice} />;
    case "ad":
      return <SliceAd slice={slice} />;
    case "youtube":
      return <SliceYoutube slice={slice} />;
  }
  return null;
};

export { PrismicBodySlice };
