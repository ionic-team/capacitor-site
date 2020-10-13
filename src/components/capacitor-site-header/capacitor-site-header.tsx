import { Component, Element, State, h, VNode, Host } from '@stencil/core';
import { ResponsiveContainer, AnchorButton, IntersectionHelper } from '@ionic-internal/ionic-ds';
import { href } from 'stencil-router-v2';

import Router from '../../router';
import state from '../../store';

const formatNumber = (n) => {
  if (n > 1000) {
    return (n / 1000).toFixed(1) + 'K';
  }

  return n;
}

@Component({
  tag: 'capacitor-site-header',
  styleUrl: 'capacitor-site-header.scss',
  scoped: true
})
export class SiteHeader {
  @Element() el: HTMLElement;

  @State() expanded = false;

  @State() sticky = false;

  // Hovered nav items
  @State() forceHovered: string | null = null;
  @State() hovered: string | null = null;

  @State() starCount?: number;

  async componentWillLoad() {
    // TODO pull this in from GitHub at build
    this.starCount = formatNumber('4.4K');

    // Figure out if we should force hover a nav item
    this.forceHovered = Router.activePath.replace('/', '').replace('#', '');

    Router.onChange('activePath', (v: any) => {
      // TODO: Make this an object and share it w/ render
      if (['/#features', '/docs', '/blog', '/enterprise', '/community'].findIndex(x => x === v) >= 0) {
        this.forceHovered = v.replace('/', '').replace('#', '');
      }
    });

    IntersectionHelper.addListener(({ entries }) => {
      const e = entries.find((e) => (e.target as HTMLElement) === this.el);
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

  setHovered = (h: string) => () => this.hovered = h;

  clearHover = () => this.hovered = null;

  toggleExpanded = () => this.expanded = !this.expanded;

  render() {
    const { clearHover, expanded, forceHovered, hovered, starCount, sticky } = this;

    return (
      <Host class={{
        'site-header--sticky': sticky,
        'site-header--expanded': expanded
      }}>
        <site-backdrop visible={expanded} onClick={() => this.toggleExpanded()} />

        <ResponsiveContainer class="site-header">
          <a {...href('/')} class="site-header__logo-link">
            {state.pageTheme === 'dark' ? (
              <img src="/assets/img/heading/logo-white.png" alt="Capacitor Logo" />
            ) : (
              <img src="/assets/img/heading/logo-black.png" alt="Capacitor Logo" />
            )}
          </a>

          <more-button onClick={() => this.toggleExpanded()} />

          <div class="site-header-links">
            <div class={{
              'site-header-links__menu': true,
              'site-header-links__menu--hovered': !!hovered || !!forceHovered
            }}>
              <nav>
                <NavLink
                  path="/#features"
                  hovered={(hovered || forceHovered) === 'features'}
                  onHover={this.setHovered('features')}
                  onExit={clearHover}>
                  Features
                </NavLink>
                <NavLink
                  path="/docs"
                  hovered={hovered === 'docs'}
                  onHover={this.setHovered('docs')}
                  onExit={clearHover}>
                  Docs
                </NavLink>
                <NavLink
                  path="/community"
                  hovered={hovered === 'community' || forceHovered === 'community'}
                  onHover={this.setHovered('community')}
                  onExit={clearHover}>
                  Community
                </NavLink>
                <NavLink
                  path="/blog"
                  hovered={hovered === 'blog'}
                  onHover={this.setHovered('blog')}
                  onExit={clearHover}>
                  Blog
                </NavLink>
                <a
                  href="https://ionicframework.com/native"
                  target="_blank"
                  onMouseOver={this.setHovered('enterprise')}
                  onMouseOut={clearHover}
                  class={{
                    'link--hovered': hovered === 'enterprise'
                  }}>
                  Enterprise
                </a>
              </nav>
            </div>

            <div class="site-header-links__buttons">
              <AnchorButton href="https://github.com/ionic-team/capacitor" class="site-header-links__buttons__github">
                <ion-icon name="logo-github" />
                <span>{starCount ? starCount : 'GitHub'}</span>
              </AnchorButton>
              <AnchorButton class="site-header-links__buttons__install" href="/docs/getting-started">
                <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 12H10M8.75 5.99986L5 9.59995M5 9.59995L1.25 5.99986M5 9.59995L4.99998 0" stroke="white"/>
                </svg>

                Install
              </AnchorButton>
            </div>
          </div>
        </ResponsiveContainer>
      </Host>
    );
  }
}

interface NavLinkProps {
  hovered: boolean;
  path: string;
  onHover: () => void;
  onExit: () => void;
}

const NavLink = ({ path, hovered, onHover, onExit }: NavLinkProps, children: VNode) => {
  // Detect active if path equals the route path or the current active path plus
  // the route hash equals the path, to support links like /#features
  const active = Router.activePath === path ||
                 Router.activePath + Router.url.hash === path;

  return (
    <a
      {...href(path)}
      onMouseOver={onHover}
      onMouseOut={onExit}
      class={{
      'link--active': active,
      'link--hovered': hovered
    }}>
      {children}
    </a>
  )
}
