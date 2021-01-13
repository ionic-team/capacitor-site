import { Component, h, Host, Prop, State } from '@stencil/core';
import Router from '../../../../../../router';
import { BlogData } from 'src/data.server/blog';
import { JSXBase } from '@stencil/core/internal';

@Component({
  tag: 'blog-social-actions',
  styleUrl: 'blog-social-actions.scss',
  scoped: true,
})
export class BlogSocialActions {
  private twitterUrl = [
    'http://twitter.com/intent/tweet?',
    `url=${encodeURIComponent(Router.path.toString())}`,
  ];
  private facebookUrl = [
    'https://www.facebook.com/sharer/sharer.php?',
    `u=${encodeURIComponent(Router.path.toString())}`,
  ];
  private linkedInUrl = [
    'https://www.linkedin.com/sharing/share-offsite',
    `?url=${encodeURIComponent(Router.path.toString())}`,
  ];

  @Prop() post?: BlogData;
  @Prop() column: boolean = false;
  @State() loaded: boolean = false;

  componentDidLoad() {
    requestAnimationFrame(() => {
      this.loaded = true;
    });
  }

  render = () => (
    <Host
      class={{
        'social-links': true,
        'column': this.column,
        'loaded': this.loaded,
      }}
    >
      <a href={this.twitterUrl.join('')} target="_blank" rel="noopener">
        {twitterLogo(
          { main: '#CED6E0' },
          { width: 20, height: 16, class: 'twitter' },
        )}
      </a>
      <a href={this.facebookUrl.join('')} target="_blank" rel="noopener">
        {facebookRoundedLogo(
          { main: '#CED6E0' },
          { width: 20, height: 20, class: 'facebook' },
        )}
      </a>
      <a href={this.linkedInUrl.join('')} target="_blank" rel="noopener">
        {linkedInLogo(
          { main: '#CED6E0' },
          { width: 20, height: 20, class: 'linked-in' },
        )}
      </a>
    </Host>
  );
}

const twitterLogo = (
  { main = '#1DA1F2' } = {},
  props?: JSXBase.SVGAttributes,
) => (
  <svg
    viewBox="0.630000114440918 -0.003784056520089507 14.744999885559082 12.00379753112793"
    {...props}
  >
    <path
      fill={main}
      d="M15.375 1.422a6.116 6.116 0 01-1.738.478A3.036 3.036 0 0014.97.225c-.585.347-1.232.6-1.922.734A3.026 3.026 0 007.89 3.72 8.574 8.574 0 011.653.553a3.029 3.029 0 00.94 4.044c-.5-.013-.968-.15-1.374-.378v.037a3.028 3.028 0 002.428 2.969 3.045 3.045 0 01-.797.106c-.194 0-.384-.019-.569-.056A3.03 3.03 0 005.11 9.378a6.066 6.066 0 01-4.48 1.253A8.457 8.457 0 005.258 12c5.572 0 8.616-4.616 8.616-8.619 0-.131-.003-.262-.01-.39a6.158 6.158 0 001.51-1.57z"
    ></path>
  </svg>
);

const facebookRoundedLogo = (
  { main = 'gray' } = {},
  props?: JSXBase.SVGAttributes,
) => (
  <svg viewBox="0 0 20 20" {...props}>
    <path
      fill={main}
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M20 10.06C20 4.5 15.52 0 10 0S0 4.5 0 10.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H5.9v-2.91h2.54V7.84c0-2.52 1.5-3.91 3.77-3.91 1.1 0 2.24.2 2.24.2V6.6H13.2c-1.24 0-1.63.78-1.63 1.57v1.9h2.78l-.45 2.9h-2.33V20A10.04 10.04 0 0020 10.06z"
    />
  </svg>
);

const linkedInLogo = (
  { main = '#0072b1' } = {},
  props?: JSXBase.SVGAttributes,
) => (
  <svg viewBox="0 0 12 12" {...props}>
    <path
      fill={main}
      d="M11.04 0H1.03C.48 0 0 .4 0 .93v10.04C0 11.52.48 12 1.03 12h10c.56 0 .97-.49.97-1.03V.93c0-.54-.41-.93-.96-.93zM3.72 10H2V4.66h1.72V10zm-.8-6.16h-.01c-.55 0-.9-.4-.9-.92S2.36 2 2.92 2s.9.4.92.92c0 .52-.36.92-.93.92zM10 10H8.28V7.08c0-.7-.25-1.18-.87-1.18-.47 0-.76.32-.88.64-.05.1-.06.26-.06.42V10H4.75V4.66h1.72v.74c.25-.35.64-.87 1.55-.87 1.13 0 1.98.75 1.98 2.35V10z"
    />
  </svg>
);
