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
import state from '../../store';
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
    guide: [],
    plugins: [2],
    reference: [],
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
              <app-menu-toggle icon="close" />
              <a {...href('/')} class="menu-header__logo-link">
                {state.pageTheme === 'dark' ? (
                  <img
                    src="/assets/img/heading/logo-white.png"
                    alt="Capacitor Logo"
                  />
                ) : (
                  <img
                    src="/assets/img/heading/logo-black.png"
                    alt="Capacitor Logo"
                  />
                )}
              </a>
              <a
                {...href(docsVersionHref('/docs'))}
                class="menu-header__docs-link"
              >
                Docs
              </a>
              {/* <version-select /> */}
            </div>
            <ul class="section-list">
              <li>
                <a
                  {...href(docsVersionHref('/docs'))}
                  class={{ active: this.template === 'guide' }}
                >
                  Guides
                </a>
              </li>
              <li>
                <a
                  {...href(docsVersionHref('/docs/plugins'))}
                  class={{ active: this.template === 'plugins' }}
                >
                  Plugins
                </a>
              </li>
              <li>
                <a
                  {...href(docsVersionHref('/docs/reference/cli'))}
                  class={{ active: this.template === 'reference' }}
                >
                  CLI
                </a>
              </li>
            </ul>
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
                                  {childItem.text}
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
