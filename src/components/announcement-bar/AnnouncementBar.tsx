import clsx from "clsx";
import { PrismicRichText } from "../../prismic";
import { slugify } from "../../util/slugify";
import { trackClick } from "../../util/tracking-service";
import ResponsiveContainer from "../ui/ResponsiveContainer";
import AnnouncementBarStyles from "./AnnouncementBar.styles";

const AnnouncementBar = ({ link, button_text, button_arrow, text, theme }) => {
  const url = link.url;

  return (
    <AnnouncementBarStyles
      className={clsx({
        "ui-announcement-bar": true,
        [`ui-announcement-bar--${slugify(theme)}`]: Boolean(theme),
      })}
      style={
        {
          "--asset-path": `url('/assets/announcement-bar/bg-${slugify(
            theme
          )}.png)`,
        } as any
      }
    >
      <a
        href={url}
        target="_blank"
        onClick={(event) =>
          trackClick("Capacitor Announcement Bar CTA", event.nativeEvent)
        }
        rel="noopener"
        className="link-wrapper"
      >
        <ResponsiveContainer>
          <PrismicRichText render={text} />
          <button>
            {button_text}
            {button_arrow && <span className="arrow"> -&gt;</span>}
          </button>
        </ResponsiveContainer>
      </a>
    </AnnouncementBarStyles>
  );
};

export default AnnouncementBar;
