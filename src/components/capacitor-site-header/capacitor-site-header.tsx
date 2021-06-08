import {
  Element,
  Component,
  ComponentInterface,
  Host,
  Prop,
  State,
  h,
} from '@stencil/core';
import { href } from '@stencil/router';
import Router, { docsVersionHref } from '../../router';
import { Button } from '@ionic-internal/ionic-ds';
import { JSXBase } from '@stencil/core/internal';
import { DocsTemplate } from 'src/data.server/models';
import { Translation } from '../../icons';

@Component({
  tag: 'site-header',
  styleUrl: 'capacitor-site-header.scss',
  scoped: true,
})
export class SiteHeader implements ComponentInterface {
  @Element() elm: HTMLElement;
  @Prop() template: DocsTemplate;
  @Prop() includeLogo = true;
  @Prop() includeBurger = false;
  @Prop() theme: 'light' | 'dark' = 'light';
  @Prop() sticky = true;

  @State() collapsed = false;
  @State() expanded = false;
  @State() scrolled = false;

  private routeListener = Symbol();
  private links: { [key: string]: HTMLElement } = {};
  // Could be an announcement banner or platform bar
  private heightAboveBar = 72;

  componentWillLoad() {
    this.createHeaderObserver();
    this.createRouteListener();
  }

  createHeaderObserver() {
    const opts = {
      root: document.body,
      rootMargin: `-${this.heightAboveBar + 1}px 0px 0px 0px`,
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(entries => {
      this.scrolled = !(entries[0].intersectionRatio < 1);
    }, opts);

    observer.observe(this.elm);
  }

  createRouteListener() {
    if (window.hasOwnProperty(this.routeListener)) return;

    window[this.routeListener] = true;
    Router.on('change', this.handleActive);
  }

  handleActive = (url: URL) => {
    const activeRoute = url.pathname.split('/')[1];

    for (const [key, value] of Object.entries(this.links)) {
      if (key === activeRoute) {
        value.classList.add('active');
      } else {
        value.classList.remove('active');
      }
    }
  };

  isActive(path: string): boolean {
    const prefix = new RegExp('^' + path, 'gm');
    const regexRes = prefix.test(Router.path);

    return regexRes;
  }

  toggleExpanded = () => (this.expanded = !this.expanded);

  render() {
    const { expanded, template, includeLogo, includeBurger } = this;

    return (
      <Host
        class={{
          scrolled: this.scrolled,
          [`theme--${this.theme}`]: true,
          sticky: this.sticky,
        }}
      >
        <site-backdrop
          visible={expanded}
          onClick={() => this.toggleExpanded()}
          mobileOnly
        />

        <header>
          {includeBurger ? <app-menu-toggle /> : null}

          {includeLogo ? (
            <a {...href('/')} aria-label="homepage link">
              {capacitorLogo()}
            </a>
          ) : null}

          <div class="docs-search-wrapper desktop-only">
            <docs-search theme={this.theme} />
          </div>

          <a
            {...href(docsVersionHref('/docs'))}
            class={{
              'ui-paragraph-4': true,
              'active': template === 'docs',
            }}
          >
            Docs
          </a>
          <a
            {...href(docsVersionHref('/docs/plugins'))}
            class={{
              'ui-paragraph-4': true,
              'active': template === 'plugins',
            }}
          >
            Plugins
          </a>
          <a
            {...href(docsVersionHref('/docs/cli'))}
            class={{
              'ui-paragraph-4': true,
              'active': template === 'cli',
            }}
          >
            CLI
          </a>

          <div class="separator desktop-only"></div>

          <nav
            class={{
              routes: true,
              expanded: this.expanded,
            }}
          >
            <div class="routes__header">
              <a aria-label="homepage link" class="logo-wrapper" {...href('/')}>
                {capacitorLogo()}
              </a>
              <button class="close" aria-label="close">
                <svg
                  onClick={this.toggleExpanded}
                  width="10"
                  height="10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 9L1 1M9 1L1 9"
                    stroke="#B2BECD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div class="docs-search-wrapper mobile-only">
              <docs-search />
            </div>
            <a
              {...href('/community')}
              class="ui-paragraph-4"
              ref={el => (this.links.community = el)}
            >
              Community
            </a>
            <a
              {...href('/blog')}
              class="ui-paragraph-4"
              ref={el => (this.links.blog = el)}
            >
              Blog
            </a>
            <a
              {...href('/enterprise')}
              class="ui-paragraph-4"
              ref={el => (this.links.enterprise = el)}
            >
              Enterprise
            </a>
          </nav>

          <div class="separator desktop-only"></div>

          <more-button onClick={() => this.toggleExpanded()} />

          <div class="ctas">
            <docs-dropdown
              icon={Translation}
              align="right"
              class="label-sm-only"
            >
              <section>
                <a href="https://capacitorjs.com/" target="_blank">
                  English
                  <svg viewBox="0 0 512 512" width="14">
                    <path d="M186.301 339.893L96 249.461l-32 30.507L186.301 402 448 140.506 416 110z"></path>
                  </svg>
                </a>
                <a href="https://capacitorjs.jp/" class="link-active">
                  日本語
                </a>
              </section>
            </docs-dropdown>

            <a
              href="https://github.com/ionic-team/capacitor"
              target="_blank"
              rel="noopener"
            >
              <svg
                class="social"
                width="14"
                height="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 0a7.1 7.1 0 00-7 7.18c0 3.17 2 5.86 4.79 6.8.04.02.08.02.12.02.26 0 .36-.2.36-.36l-.01-1.22a3.2 3.2 0 01-.71.09c-1.35 0-1.65-1.05-1.65-1.05-.32-.83-.78-1.05-.78-1.05-.61-.43 0-.44.04-.44.7.06 1.08.74 1.08.74.35.61.82.79 1.23.79.28 0 .55-.07.8-.2.07-.45.25-.77.45-.95-1.55-.18-3.19-.8-3.19-3.55 0-.78.27-1.42.72-1.92-.07-.18-.31-.91.07-1.9l.16-.02c.25 0 .82.1 1.76.76a6.5 6.5 0 013.51 0c.94-.66 1.52-.76 1.77-.76.05 0 .1 0 .16.02.38.99.14 1.72.06 1.9.45.5.72 1.14.72 1.92 0 2.76-1.64 3.37-3.2 3.54.26.23.48.66.48 1.33v1.97c0 .17.09.36.35.36a.6.6 0 00.12-.01A7.16 7.16 0 0014 7.18 7.1 7.1 0 007 0z"
                  fill="#B2BECD"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com/capacitorjs"
              target="_blank"
              rel="noopener"
            >
              <svg
                class="social"
                width="17"
                height="14"
                viewBox="0 0 17 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 1.65885C15.91 1.93958 15.2794 2.12917 14.6149 2.21667C15.293 1.77917 15.8151 1.08646 16.0592 0.2625C15.4252 0.667187 14.7234 0.9625 13.974 1.11927C13.3739 0.430208 12.5195 0 11.5769 0C9.76298 0 8.29487 1.58229 8.29487 3.53281C8.29487 3.8099 8.322 4.07969 8.37963 4.33854C5.65024 4.19271 3.22939 2.78542 1.6121 0.645312C1.33068 1.16667 1.16794 1.77552 1.16794 2.42083C1.16794 3.64583 1.75111 4.72865 2.63266 5.36302C2.09017 5.34844 1.58159 5.18802 1.14081 4.92188V4.96562C1.14081 6.67917 2.27326 8.10469 3.77527 8.42917C3.50064 8.50938 3.20905 8.55313 2.91068 8.55313C2.70047 8.55313 2.49364 8.53125 2.2936 8.4875C2.71064 9.89114 3.92445 10.912 5.36205 10.9411C4.23978 11.8891 2.82253 12.4542 1.28322 12.4542C1.01875 12.4542 0.757682 12.4359 0.5 12.4031C1.94776 13.4167 3.67355 14 5.52479 14C11.5701 14 14.8725 8.6151 14.8725 3.94479C14.8725 3.79167 14.8691 3.63854 14.8624 3.48906C15.5032 2.98958 16.0592 2.36979 16.5 1.65885Z"
                  fill="#B2BECD"
                />
              </svg>
            </a>
            <Button
              class="primary | ui-paragraph-4"
              anchor
              {...href('/docs/getting-started')}
              kind="regular"
              color="cyan"
              size="md"
            >
              <svg
                width="10"
                height="12"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 520.31"
              >
                <path
                  fill="#fff"
                  d="M179.5 167.9l-.2 167.9-57.76-55.44-57.76-55.43-1.72 1.8L48.1 241.3c-6.73 7.03-12.13 13.03-12 13.34.41 1 163.29 157.08 163.92 157.08.62 0 163.46-156.09 163.88-157.09.13-.3-5.27-6.3-12-13.33l-13.96-14.58-1.72-1.8-57.76 55.44-57.76 55.44-.2-167.9L220.3 0h-40.6l-.2 167.9M0 479.69V500h400v-40.62H0v20.3"
                  fill-rule="evenodd"
                ></path>
              </svg>
              Install
            </Button>
          </div>
        </header>
      </Host>
    );
  }
}

const capacitorLogo = (props?: JSXBase.SVGAttributes) => (
  <svg
    class="capacitor-logo"
    width="130"
    height="24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
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
