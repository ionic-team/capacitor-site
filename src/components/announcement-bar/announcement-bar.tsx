import {
  Button,
  PrismicRichText,
  ResponsiveContainer,
} from '@ionic-internal/ionic-ds';
import { h, Prop, Component, Host, getAssetPath } from '@stencil/core';

import { track as trackEvent } from '../../utils/analytics';

// interface AnnouncementBarProps {
//   prismicData: {
//     button_text: string;
//     text: any;
//     link: {
//       url: string;
//     };
//     theme: string;
//   };
// }

@Component({
  tag: 'announcement-bar',
  styleUrl: 'announcement-bar.scss',
  assetsDirs: ['assets-announcement-bar'],
  scoped: true,
})
export class AnnouncementBar {
  @Prop() prismicData;

  handleCtaClick = e => {
    e.preventDefault();
    trackEvent({
      action: 'click',
      category: 'MarketingCTAs',
      label: 'btn-header-announcement',
    });
    // open popup
    const newWin = window.open(this.prismicData.url);
    setTimeout(() => {
      if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
        // popup blocked
        window.location = this.prismicData.url;
      }
    }, 500);
  };

  render() {
    const {
      link: { url },
      button_text,
      text,
      theme,
    } = this.prismicData;

    return (
      <Host
        class={{
          'ui-announcement-bar': true,
          'ui-announcement-bar--q1-event': true,
          [`ui-announcement-bar--${theme}`]: true,
        }}
        style={{
          '--asset-path': `url('${getAssetPath(
            './assets-announcement-bar/bg-q1-event.png',
          )}')`,
        }}
      >
        <a
          href={url}
          target="_blank"
          onClick={this.handleCtaClick}
          rel="noopener"
          class="link-wrapper"
        >
          <ResponsiveContainer>
            <PrismicRichText richText={text} />
            <Button size="sm" kind="round">
              {button_text}
              <span class="arrow"> -&gt;</span>
            </Button>
          </ResponsiveContainer>
        </a>
      </Host>
    );
  }
}
