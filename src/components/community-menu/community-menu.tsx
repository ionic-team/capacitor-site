import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { href } from '@stencil/router';
import type { TableOfContents, TableOfContentsNode } from '@stencil/ssg';
import type { DocsTemplate } from '../../data.server/docs';
import { docsVersionHref } from '../../router';


export interface PluginInfo {
  name: string;
  slug: string;
  platforms?: string[];
  category: string;
  tags?: string[];
}

@Component({
  tag: 'community-menu',
  styleUrl: 'community-menu.scss',
  scoped: true,
})
export class SiteMenu implements ComponentInterface {
  @Prop() template: DocsTemplate;
  @Prop() activePath: string;

  @Prop() plugins: PluginInfo[] = [
    {
      name: 'Stripe',
      slug: 'stripe',
      category: 'Payments',
      tags: ['payment processing', 'apple pay', 'google pay', 'stripe'],
      platforms: ['ios', 'android'],
    },
  ];
  @State() toc: TableOfContents;
  @State() categories: string[] = [];
  @State() tagIndex: { [tag: string]: PluginInfo[] } = {};

  @State() expands: { [key: string]: number[] } = {
    community: [],
  };

  @State() showOverlay = false;

  @Event() menuToggled: EventEmitter;

  @Method()
  async toggleOverlayMenu() {
    this.showOverlay = !this.showOverlay;
  }

  @Watch('showOverlay')
  showOverlayChange() {
    this.menuToggled.emit(this.showOverlay);
  }

  componentWillLoad() {
    this.expandActive();
    this.processPlugins();
  }

  @Watch('plugins')
  processPlugins() {
    const { plugins } = this;
    const categories: string[] = [];
    const tagIndex: { [tag: string]: PluginInfo[] } = {};
    const toc: TableOfContents = {
      root: [],
      rootPagesDir: '',
      tocDirPath: '',
      tocFilePath: '',
    };
    const catTocIndex: { [cat: string]: TableOfContentsNode } = {};
    for (const p of plugins) {
      const c = p.category;

      if (!categories.includes(c)) {
        categories.push(c);

        const tocNode: TableOfContentsNode = {
          children: [],
          depth: 1,
          text: c,
        };
        catTocIndex[c] = tocNode;
        toc.root.push(tocNode);
      }

      catTocIndex[c].children.push({
        text: p.name,
        url: p.slug,
        hasParent: true,
        depth: 2,
        file: 'stripe.md',
      });

      if (Array.isArray(p.tags)) {
        for (const t of p.tags) {
          if (!Array.isArray(tagIndex[t])) {
            tagIndex[t] = [];
          }
          tagIndex[t].push(p);
        }
      }
    }

    this.categories = categories;
    this.tagIndex = tagIndex;
    this.toc = toc;
  }

  @Watch('template')
  @Watch('activePath')
  expandActive() {
    if (this.toc?.root) {
      const activeIndex = this.toc.root.findIndex(
        t => t.children && t.children.some(c => c.url === this.activePath),
      );
      if (
        activeIndex > -1 &&
        !this.expands[this.template].includes(activeIndex)
      ) {
        this.expands = {
          ...this.expands,
          [this.template]: [...this.expands[this.template], activeIndex],
        };
      }
    }
  }

  toggleParent = (itemNumber: number) => {
    return (e: MouseEvent) => {
      e.preventDefault();

      if (this.expands[this.template].includes(itemNumber)) {
        this.expands[this.template].splice(
          this.expands[this.template].indexOf(itemNumber),
          1,
        );
      } else {
        this.expands[this.template] = [
          ...this.expands[this.template],
          itemNumber,
        ];
      }
      this.expands = { ...this.expands };
    };
  };

  render() {

    return (
      <Host
        class={{
          'menu-overlay-visible': this.showOverlay,
        }}
      >
        <aside class="sticky">
          <div>
            <div class="menu-header">
              <a {...href('/')} class="menu-header__logo-link">
                {capacitorLogo()}
              </a>
              <a
                {...href(docsVersionHref('/community'))}
                class="menu-header__docs-link"
              >
                Community
              </a>
              {/* <version-select /> */}
            </div>
            <div class="menu-filters">
              <h6 class="menu-filters__section-title title ui-heading ui-heading-6">Tags</h6>
              <div class="menu-filters__tags">
                <div class="menu-filters__tags__input">
                  <ion-icon name="filter-outline"></ion-icon>
                  <span class="placeholder">Search tags</span>
                </div>
              </div>
              <h6 class="menu-filters__section-title title ui-heading ui-heading-6">Platforms</h6>
              <div class="menu-filters__platforms">
                <div class="menu-filters__platforms__option">
                  <ion-icon name="logo-android"></ion-icon>
                </div>
                <div class="menu-filters__platforms__option">
                  <ion-icon name="logo-apple"></ion-icon>
                </div>
                <div class="menu-filters__platforms__option">
                  <ion-icon name="logo-pwa"></ion-icon>
                </div>
              </div>
            </div>
            <ul class="menu-list">
              {this.toc?.root.map((item, i) => {
                const isActive = item.url === this.activePath;
                const expanded = this.expands[this.template].includes(i);

                if (item.children && item.children.length > 0) {
                  return (
                    <li class={{ collapsed: !expanded }}>
                      <a
                        href={
                          /* href only for no-js, otherwise it'll toggle w/out navigating */
                          item.children[0].url
                        }
                        onClick={this.toggleParent(i)}
                      >
                        <ion-icon
                          name={expanded ? 'chevron-down' : 'chevron-forward'}
                        />
                        <span class="section-label">{item.text}</span>
                      </a>
                      <ul>
                        {item.children.map(childItem => {
                          return (
                            <li>
                              {childItem.url ? (
                                <a
                                  {...href(childItem.url)}
                                  class={{
                                    'link-active':
                                      childItem.url === this.activePath,
                                  }}
                                >
                                  <span class="bump-up">{childItem.text}</span>
                                </a>
                              ) : (
                                <a
                                  rel="noopener"
                                  class="link--external"
                                  target="_blank"
                                  href="#"
                                >
                                  {childItem.text}
                                </a>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li>
                    {item.url ? (
                      <a
                        {...href(item.url)}
                        class={{
                          'section-active': isActive,
                        }}
                      >
                        <span class="section-active-indicator" />
                        <span class="section-label">{item.text}</span>
                      </a>
                    ) : (
                      <a
                        rel="noopener"
                        class="link--external"
                        target="_blank"
                        href="#"
                      >
                        {item.text}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </Host>
    );
  }
}

const capacitorLogo = () => (
  <svg
    width="126"
    height="24"
    viewBox="0 0 126 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 11.8186C30 16.0223 33.0403 19.4133 37.4287 19.4133C41.8457 19.4133 44.0829 16.4147 44.4844 13.8083H41.0885C40.687 15.3777 39.2356 16.4707 37.4 16.4707C34.962 16.4707 33.2066 14.537 33.2066 11.8186C33.2066 9.07214 34.962 7.13842 37.4 7.13842C39.2356 7.13842 40.687 8.23139 41.0885 9.80078H44.4844C44.0829 7.19447 41.8457 4.1958 37.4287 4.1958C33.0403 4.1958 30 7.58682 30 11.8186Z"
      fill="black"
    />
    <path
      d="M57.1749 7.67557V19.127H54.2309V17.7297C53.4928 18.7757 52.1612 19.3924 50.5007 19.3924C47.0834 19.3924 45.0859 16.7227 45.0859 13.4052C45.0859 10.0798 47.0834 7.41797 50.5007 7.41797C52.1612 7.41797 53.4848 8.02684 54.2309 9.08065V7.68337H57.1749V7.67557ZM51.1745 10.1501C49.4017 10.1501 48.2786 11.5474 48.2786 13.4052C48.2786 15.263 49.4017 16.6603 51.1745 16.6603C52.9474 16.6603 54.0704 15.263 54.0704 13.4052C54.0784 11.5474 52.9554 10.1501 51.1745 10.1501Z"
      fill="black"
    />
    <path
      d="M61.7701 23H58.5774V7.68337H61.5214V9.08065C62.2594 8.03464 63.591 7.41797 65.2516 7.41797C68.6689 7.41797 70.6663 10.0876 70.6663 13.4052C70.6663 16.7305 68.6689 19.3924 65.2516 19.3924C63.591 19.3924 62.3798 18.6899 61.7701 17.9093V23ZM64.5777 16.6603C66.3506 16.6603 67.4736 15.263 67.4736 13.4052C67.4736 11.5474 66.3506 10.1501 64.5777 10.1501C62.8049 10.1501 61.6818 11.5474 61.6818 13.4052C61.6738 15.263 62.7969 16.6603 64.5777 16.6603Z"
      fill="black"
    />
    <path
      d="M83.5107 7.67557V19.127H80.5667V17.7297C79.8287 18.7757 78.4971 19.3924 76.8366 19.3924C73.4193 19.3924 71.4219 16.7227 71.4219 13.4052C71.4219 10.0798 73.4193 7.41797 76.8366 7.41797C78.4971 7.41797 79.8207 8.02684 80.5667 9.08065V7.68337H83.5107V7.67557ZM77.5104 10.1501C75.7376 10.1501 74.6146 11.5474 74.6146 13.4052C74.6146 15.263 75.7376 16.6603 77.5104 16.6603C79.2833 16.6603 80.4063 15.263 80.4063 13.4052C80.4143 11.5474 79.2913 10.1501 77.5104 10.1501Z"
      fill="black"
    />
    <path
      d="M90.3201 7.41797C93.978 7.41797 95.7107 9.93151 95.9353 11.8752H92.6544C92.4057 10.8916 91.4672 10.1735 90.296 10.1735C88.5874 10.1735 87.6007 11.4849 87.6007 13.4052C87.6007 15.3255 88.5874 16.6369 90.296 16.6369C91.4672 16.6369 92.4057 15.9187 92.6544 14.9352H95.9353C95.7107 16.8789 93.978 19.3924 90.3201 19.3924C86.9028 19.3924 84.416 16.8164 84.416 13.4052C84.416 9.99395 86.9028 7.41797 90.3201 7.41797Z"
      fill="black"
    />
    <path
      d="M96.1829 4.88125C96.1829 3.78841 96.9931 3 98.1161 3C99.2392 3 100.049 3.78841 100.049 4.88125C100.049 5.97409 99.2392 6.73908 98.1161 6.73908C96.9931 6.73908 96.1829 5.97409 96.1829 4.88125ZM96.5198 7.6758H99.7125V19.1272H96.5198V7.6758Z"
      fill="black"
    />
    <path
      d="M101.14 7.67635V4.83496H104.332V7.67635H106.787V10.2055H104.332V19.1356H101.14V10.1274"
      fill="black"
    />
    <path
      d="M106.256 13.4052C106.256 10.1501 108.663 7.41797 112.433 7.41797C116.203 7.41797 118.61 10.1501 118.61 13.4052C118.61 16.6603 116.203 19.3924 112.433 19.3924C108.663 19.3924 106.256 16.6603 106.256 13.4052ZM112.433 16.6603C114.118 16.6603 115.417 15.4582 115.417 13.4052C115.417 11.3522 114.118 10.1501 112.433 10.1501C110.748 10.1501 109.449 11.3522 109.449 13.4052C109.449 15.4582 110.748 16.6603 112.433 16.6603Z"
      fill="black"
    />
    <path
      d="M126 10.5015C126 10.5015 125.667 10.439 125.381 10.439C123.542 10.439 122.582 11.3367 122.582 13.4365V19.1427H119.426V7.67569H122.336V9.15883C122.756 8.47971 123.645 7.56641 125.619 7.56641C125.73 7.56641 126 7.58982 126 7.58982V10.5015Z"
      fill="black"
    />
    <path
      d="M3.73712 5.07324L0.0291182 8.78592L5.74746 14.5214L0 20.2861L3.6964 24.0004L9.45544 18.2341L15.1833 23.9592L18.8913 20.2465L3.73712 5.07324Z"
      fill="#53B9FF"
    />
    <path
      d="M13.1735 14.5215L9.45557 18.2341L15.1834 23.9593L18.8914 20.2466L13.1735 14.5215Z"
      fill="#119EFF"
    />
    <path
      d="M13.1735 14.5215L9.45557 18.2341L10.8868 19.6574L13.1735 14.5215Z"
      fill="black"
      fill-opacity="0.2"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.2409 9.46736L24 3.70106L20.2904 0L14.533 5.75471L8.80468 0.0291556L5.09668 3.74184L20.2509 18.9151L23.9589 15.2024L18.2409 9.46736Z"
      fill="#53B9FF"
    />
    <path
      d="M10.815 9.46751L14.533 5.75485L8.80468 0.0292969L5.09668 3.74198L10.815 9.46751Z"
      fill="#119EFF"
    />
    <path
      d="M10.8149 9.46738L14.5329 5.75473L13.1013 4.33105L10.8149 9.46738Z"
      fill="black"
      fill-opacity="0.2"
    />
  </svg>
);
