import { Component, Element, State, h } from '@stencil/core';
import { ResponsiveContainer } from '@ionic-internal/sites-shared';

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

  /*
  @Listen('resize', { target: 'window' })
  handleResize() {
    requestAnimationFrame(() => {
      if (window.innerWidth > 768) {
        const menu = (this.el.querySelector('.header-menu') as HTMLElement);
        menu.style.display = "";
        this.el.classList.remove('show-mobile-menu');
        document.body.classList.remove('no-scroll');
        this.isMobileMenuShown = false;
      }
    });
  }

  @Listen('scroll', { target: 'window' })
  handleScroll(event) {
    requestAnimationFrame(() => {
      if (event.target.documentElement.scrollTop !== 0 && !this.isScrolled) {
        this.el.classList.add('scrolled');
        this.isScrolled = true;
      } else if (event.target.documentElement.scrollTop === 0 && this.isScrolled) {
        this.el.classList.remove('scrolled');
        this.isScrolled = false;
      }
    });
  }
  */

  componentWillLoad() {
    this.isMobileMenuShown = false;
  }

  showNav () {
    if (this.isMobileMenuShown) return;
    this.isMobileMenuShown = true;

    const menu = (this.el.querySelector('.header-menu') as HTMLElement);

    menu.style.display = "flex";
    setTimeout(() => {
      this.el.classList.add('show-mobile-menu');
      document.body.classList.add('no-scroll');
    }, 1)
  }

  hideNav () {
    if (!this.isMobileMenuShown) return;
    this.isMobileMenuShown = false;

    const menu = (this.el.querySelector('.header-menu') as HTMLElement);

    this.el.classList.remove('show-mobile-menu');
    setTimeout(() => {
      menu.style.display = "none";
      document.body.classList.remove('no-scroll');
    }, 300)
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
          <a href="/docs/">Docs</a>
          <a href="/community">Community</a>
          <a href="/blog">Community</a>
          <a href="/enterprise">Enterprise</a>
        </div>
      </ResponsiveContainer>
    );
  }
}
