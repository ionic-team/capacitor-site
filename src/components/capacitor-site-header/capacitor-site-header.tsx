import { Component, Element, State, h } from '@stencil/core';
import { ResponsiveContainer, Button, AnchorButton } from '@ionic-internal/sites-shared';

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

  @State() starCount?: number;

  async componentWillLoad() {
    const ret = await fetch("https://api.github.com/repos/ionic-team/capacitor")

    const json = await ret.json();

    this.starCount = formatNumber(json.stargazers_count);
  }

  handleDropdownEnter () {
    this.isDropdownShown = true;
  }

  handleDropdownLeave () {
    this.isDropdownShown = false;
  }

  render() {
    return (
      <ResponsiveContainer class="site-header">
        <a href="/" class="site-header__logo-link">
          <img src="/assets/img/logo-light.png" alt="Capacitor Logo" />
        </a>

        <div class="site-header__menu">
          <a href="#features">Features</a>
          <a href="/docs">Docs</a>
          <a href="/community">Community</a>
          <a href="/blog">Blog</a>
          <a href="/enterprise">Enterprise</a>
        </div>

        <div class="site-header__buttons">
          <AnchorButton href="https://github.com/ionic-team/capacitor" class="site-header__buttons__github">
            <ion-icon name="logo-github" />
            {this.starCount ? this.starCount : 'GitHub'}
          </AnchorButton>
          <Button class="site-header__buttons__install">
            Install
          </Button>
        </div>
      </ResponsiveContainer>
    );
  }
}
