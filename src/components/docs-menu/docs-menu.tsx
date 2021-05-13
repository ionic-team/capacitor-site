import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { href } from '@stencil/router';
import type { TableOfContents } from '@stencil/ssg';
import { docsVersionHref } from '../../router';
import type { DocsTemplate } from '../../data.server/docs';

@Component({
  tag: 'docs-menu',
  styleUrl: 'docs-menu.scss',
  scoped: true,
})
export class SiteMenu implements ComponentInterface {
  @Prop() template: DocsTemplate;
  @Prop() toc: TableOfContents;
  @Prop() activePath: string;

  @State() expands: { [key: string]: number[] } = {
    docs: [],
    plugins: [2],
    cli: [1],
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
                {...href(docsVersionHref('/docs'))}
                class="menu-header__docs-link"
              >
                Docs
              </a>
              <version-select />
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
  <svg width="130" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M55.36 6.03v12.84h-3.22V17.3c-.8 1.17-2.26 1.86-4.08 1.86-3.73 0-5.92-2.99-5.92-6.7 0-3.73 2.19-6.72 5.92-6.72 1.82 0 3.26.69 4.08 1.87V6.04h3.22zM48.8 8.81c-1.94 0-3.17 1.56-3.17 3.64 0 2.09 1.23 3.65 3.17 3.65s3.16-1.56 3.16-3.65c.01-2.08-1.21-3.64-3.16-3.64zM60.1 23.2h-3.49V6.05h3.22v1.57c.8-1.17 2.26-1.87 4.08-1.87 3.73 0 5.92 3 5.92 6.71 0 3.73-2.19 6.71-5.92 6.71a4.73 4.73 0 01-3.8-1.66v5.7zm3.07-7.1c1.94 0 3.17-1.56 3.17-3.65 0-2.08-1.23-3.64-3.17-3.64S60 10.37 60 12.45c0 2.09 1.22 3.65 3.17 3.65zM83.76 6.03v12.84h-3.22V17.3c-.8 1.17-2.26 1.86-4.08 1.86-3.73 0-5.92-2.99-5.92-6.7 0-3.73 2.18-6.72 5.92-6.72 1.82 0 3.26.69 4.08 1.87V6.04h3.22zM77.2 8.81c-1.94 0-3.17 1.56-3.17 3.64 0 2.09 1.23 3.65 3.17 3.65s3.16-1.56 3.16-3.65c.01-2.08-1.21-3.64-3.16-3.64zM37.92 14.16c-.41 1.11-1.45 1.73-2.73 1.73a3.4 3.4 0 01-3.39-3.44 3.4 3.4 0 013.4-3.43c1.27 0 2.27.54 2.72 1.73h3.5a6.12 6.12 0 00-6.23-5c-3.7 0-6.66 3-6.66 6.7 0 3.71 2.95 6.71 6.66 6.71 3.12 0 5.82-2.19 6.24-5h-3.5zM93.86 14.16c-.41 1.11-1.45 1.73-2.73 1.73a3.4 3.4 0 01-3.38-3.44 3.4 3.4 0 013.38-3.43c1.28 0 2.29.54 2.74 1.73h3.5a6.12 6.12 0 00-6.24-5c-3.7 0-6.66 3-6.66 6.7 0 3.71 2.96 6.71 6.66 6.71 3.12 0 5.82-2.19 6.24-5h-3.5zM97.78 2.9c0-1.22.89-2.1 2.11-2.1 1.23 0 2.12.88 2.12 2.1 0 1.23-.89 2.08-2.12 2.08a2.02 2.02 0 01-2.1-2.08zm.37 3.13h3.49v12.84h-3.5V6.03zM102.95 6.03V2.85h3.49v3.18h2.68v2.84h-2.68v10h-3.5V8.79"
      fill="#000"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M115.34 15.9a3.44 3.44 0 100-6.89 3.44 3.44 0 000 6.88zm0 3.26a6.71 6.71 0 100-13.42 6.71 6.71 0 000 13.42z"
      fill="#000"
    />
    <path
      d="M129.96 9.2s-.36-.07-.67-.07c-2.02 0-3.06 1-3.06 3.36v6.4h-3.46V6.02h3.19V7.7c.46-.76 1.43-1.78 3.59-1.78l.41.03V9.2z"
      fill="#000"
    />
    <path
      d="M3.74 5.07L.03 8.8l5.72 5.73L0 20.3 3.7 24l5.76-5.77 5.72 5.73 3.71-3.71L3.74 5.07z"
      fill="#53B9FF"
    />
    <path
      d="M13.17 14.52l-3.71 3.71 5.72 5.73 3.71-3.71-5.72-5.73z"
      fill="#119EFF"
    />
    <path
      d="M13.17 14.52l-3.71 3.71 1.43 1.43 2.28-5.14z"
      fill="#000"
      fill-opacity=".2"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.24 9.47L24 3.7 20.29 0l-5.76 5.75L8.8.03 5.1 3.74l15.15 15.18 3.7-3.72-5.7-5.73z"
      fill="#53B9FF"
    />
    <path d="M10.81 9.47l3.72-3.72L8.8.03 5.1 3.74l5.71 5.73z" fill="#119EFF" />
    <path
      d="M10.81 9.47l3.72-3.72-1.43-1.42-2.29 5.14z"
      fill="#000"
      fill-opacity=".2"
    />
  </svg>
);
