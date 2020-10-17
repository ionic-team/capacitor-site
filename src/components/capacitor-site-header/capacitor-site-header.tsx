import { Component, Element, State, h, Host } from '@stencil/core';
import {
  ResponsiveContainer,
  IntersectionHelper,
  Button,
} from '@ionic-internal/ionic-ds';
import { href } from '../../stencil-router-v2';

import state from '../../store';
import Router from '../../router';


@Component({
  tag: 'capacitor-site-header',
  styleUrl: 'capacitor-site-header.scss',
  scoped: true,
})
export class SiteHeader {
  @Element() el: HTMLElement;

  @State() expanded = false;
  @State() sticky = false;
  @State() starCount?: string;

  private links: { [key: string]: HTMLElement } = {};

  componentWillLoad() {
    // if (Build.isServer) {     
    //   staticServerState({}, new URL(globalThis.location.href), this.getStars);
    // } else {
    //   staticClientState({}, new URL(window.location.href));
    // }

    Router.on('change', (newRoute) => {
      this.handleActive(newRoute.pathname);
    })

    IntersectionHelper.addListener(({ entries }) => {
      const e = entries.find(e => (e.target as HTMLElement) === this.el);
      if (!e) {
        return;
      }

      if (e.intersectionRatio < 1) {
        this.sticky = true;
      } else {
        this.sticky = false;
      }
    });
    IntersectionHelper.observe(this.el!);
  }

  // async getStars() {
  //   global.console.log('debug', globalThis.location.href);
  //   const url = 'https://github.com/ionic-team/capacitor'
  //   const res = await fetch(url, {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'text/html' },
  //   });
  //   const html = await res.text();
  //   let data: { stars?: string };

  //   const opts = {
  //     beforeHtmlSerialize: async (frag: DocumentFragment) => {
  //       const starsLink = frag.querySelector('a[href="/ionic-team/capacitor/stargazers"].social-count');

  //       data.stars = starsLink?.textContent.trim();
  //     },
  //   };

  //   await parseHtmlContent(html, opts);

  //   return data;
  // }

  componentDidLoad() {    
    this.handleActive(window.location.pathname);
  }

  handleActive = (path: string) => {
    const activeRoute = path.split('/')[1];

    if (this.links.hasOwnProperty(activeRoute)) {
      for (const [key, value] of Object.entries(this.links)) {
        if (key === activeRoute) {
          value.classList.add('active');
        } else {
          value.classList.remove('active');
        }
      }      
    }
  }

  toggleExpanded = () => (this.expanded = !this.expanded);

  render() {
    const {
      expanded,
      starCount,
      sticky,
    } = this;

    return (
      <Host
        class={{
          'site-header--sticky': sticky,
          'site-header--expanded': expanded,
        }}
      >
        <site-backdrop
          mobileOnly
          visible={expanded}
          onClick={() => this.toggleExpanded()}
        />

        <ResponsiveContainer class="site-header">
          <a
            {...href('/')}
            onClick={() => this.expanded = false}
            class="site-header__logo-link"
          >
            {state.pageTheme === 'dark' ? (
              <img
                src="/assets/img/heading/logo-white.png"
                alt="Capacitor Logo"
                width="252"
                height="48"
              />
            ) : (
              <img
                src="/assets/img/heading/logo-black.png"
                alt="Capacitor Logo"
                width="252"
                height="48"
              />
            )}
          </a>

          <more-button onClick={() => this.toggleExpanded()} />

          <div class="site-header-links">
            <div
              class={{
                'site-header-links__menu': true,
              }}
            >
              <nav onClick={() => this.expanded = false}>
                <a
                  {...href('/docs')}
                >
                  Docs
                </a>
                <a
                  ref={el => this.links.community = el}
                  {...href('/community')}
                >
                  Community</a>
                <a
                  ref={el => this.links.blog = el}
                  {...href('/blog')}
                >
                  Blog
                </a>
                <a
                  href="https://ionicframework.com/native"
                  target="_blank"
                >
                  Enterprise
                </a>
              </nav>
            </div>

            <div class="site-header-links__buttons">
              <Button
                anchor
                size="md"
                kind="regular"
                href="https://github.com/ionic-team/capacitor"
                class="site-header-links__buttons__github"
              >
                <ion-icon name="logo-github" />
                <span>{starCount ? starCount : '4.6K'}</span>
              </Button>
              <Button
                anchor
                size="md"
                kind="regular"
                class="site-header-links__buttons__install"
                href="/docs/getting-started"
              >
                <svg
                  width="10"
                  height="13"
                  viewBox="0 0 10 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 12H10M8.75 5.99986L5 9.59995M5 9.59995L1.25 5.99986M5 9.59995L4.99998 0"
                    stroke="white"
                  />
                </svg>
                Install
              </Button>
            </div>
          </div>
        </ResponsiveContainer>
      </Host>
    );
  }
}
