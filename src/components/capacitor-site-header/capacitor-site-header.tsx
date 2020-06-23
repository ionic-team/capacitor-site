import { Component, Element, State, h, VNode } from '@stencil/core';
import { ResponsiveContainer, Button, AnchorButton } from '@ionic-internal/sites-shared';
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
  @Element() el: Element;

  @State() isMobileMenuShown: boolean;
  @State() isDropdownShown: boolean;
  @State() isScrolled = false;

  @State() forceHovered: string | null = null;
  @State() hovered: string | null = null;

  @State() starCount?: number;

  async componentWillLoad() {
    // TODO pull this in from GitHub at build
    this.starCount = formatNumber('4.1k');

    this.forceHovered = Router.activePath.replace('/', '').replace('#', '');

    Router.onChange('activePath', (v: any) => {
      if (['/#features', '/docs', '/blog', '/enterprise', '/community'].findIndex(x => x === v) >= 0) {
        this.forceHovered = v.replace('/', '').replace('#', '');
      }
    });
  }

  setHovered = (h: string) => () => this.hovered = h;

  clearHover = () => this.hovered = null;


  render() {
    return (
      <ResponsiveContainer class="site-header">
        <a {...href('/')} class="site-header__logo-link">
          {state.pageTheme === 'dark' ? (
            <img src="/assets/img/heading/logo-white.png" alt="Capacitor Logo" />
          ) : (
            <img src="/assets/img/heading/logo-black.png" alt="Capacitor Logo" />
          )}
        </a>

        <div class={{
          'site-header__menu': true,
          'site-header__menu--hovered': !!this.hovered || !!this.forceHovered
        }}>
          <nav>
            <NavLink
              path="/#features"
              hovered={(this.hovered || this.forceHovered) === 'features'}
              onHover={this.setHovered('features')}
              onExit={this.clearHover}>
              Features
            </NavLink>
            <NavLink
              path="/docs"
              hovered={this.hovered === 'docs'}
              onHover={this.setHovered('docs')}
              onExit={this.clearHover}>
              Docs
            </NavLink>
            <NavLink
              path="/community"
              hovered={this.hovered === 'community' || this.forceHovered === 'community'}
              onHover={this.setHovered('community')}
              onExit={this.clearHover}>
              Community
            </NavLink>
            <NavLink
              path="/blog"
              hovered={this.hovered === 'blog'}
              onHover={this.setHovered('blog')}
              onExit={this.clearHover}>
              Blog
            </NavLink>
            <a
              href="https://ionicframework.com/native"
              target="_blank"
              onMouseOver={this.setHovered('enterprise')}
              onMouseOut={this.clearHover}
              class={{
                'link--hovered': this.hovered === 'enterprise'
              }}>
              Enterprise
            </a>
          </nav>
        </div>

        <div class="site-header__buttons">
          <AnchorButton href="https://github.com/ionic-team/capacitor" class="site-header__buttons__github">
            <ion-icon name="logo-github" />
            {this.starCount ? this.starCount : 'GitHub'}
          </AnchorButton>
          <Button class="site-header__buttons__install">
            <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12H10M8.75 5.99986L5 9.59995M5 9.59995L1.25 5.99986M5 9.59995L4.99998 0" stroke="white"/>
            </svg>

            Install
          </Button>
        </div>
      </ResponsiveContainer>
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
