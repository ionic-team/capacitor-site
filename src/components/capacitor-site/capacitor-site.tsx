import { Component, Prop, Element, Listen, State, h } from '@stencil/core';

import { createRouter, Route, match } from 'stencil-router-v2';

const Router = createRouter();

@Component({
  tag: 'capacitor-site',
  styleUrl: 'capacitor-site.scss'
})
export class App {
  elements = [
    'site-header',
    'site-menu',
    'app-burger',
    '.root'
  ];

  @Element() el: HTMLElement;

  @Prop() isLandingPage = false;

  @State() isLeftSidebarIn: boolean;

  @Listen('resize', { target: 'window' })
  handleResize() {
    requestAnimationFrame(() => {
      if (window.innerWidth > 768 && this.isLeftSidebarIn) {
        this.isLeftSidebarIn = false;
        document.body.classList.remove('no-scroll');
        this.elements.forEach((el) => {
          this.el.querySelector(el).classList.remove('left-sidebar-in');
        });
      }
    });
  }

  @Listen('burgerClick')
  @Listen('leftSidebarClick')
  handleToggle() {
    if (window.innerWidth <= 768) this.toggleLeftSidebar();
  }

  /*
  setHistory = ({ history }: { history: RouterHistory }) => {
    if (!this.history) {
      this.history = history;
      this.history.listen((location: LocationSegments) => {
        (window as any).gtag('config', 'UA-44023830-42', { 'page_path': location.pathname + location.search });
      });
    }
  }
  */

  componentWillLoad() {
    this.isLeftSidebarIn = false;

  }

  toggleLeftSidebar() {
    if (this.isLeftSidebarIn) {
      this.isLeftSidebarIn = false;
      document.body.classList.remove('no-scroll');
      this.elements.forEach((el) => {
        this.el.querySelector(el).classList.remove('left-sidebar-in');
        this.el.querySelector(el).classList.add('left-sidebar-out');
      });
    } else {
      this.isLeftSidebarIn = true;
      document.body.classList.add('no-scroll');
      this.elements.forEach((el) => {
        this.el.querySelector(el).classList.add('left-sidebar-in');
        this.el.querySelector(el).classList.remove('left-sidebar-out');
      });
    }
  }

  hostData() {
    return {
      class: {
        'landing-page': this.isLandingPage
      }
    }
  }

  render() {
    return (
      <site-root>
        <site-platform-bar productName="Capacitor" />
        <capacitor-site-header />
        <Router.Switch>
          <Route path="/">
            <landing-page />
          </Route>

          <Route path="/blog">
            <blog-page />
          </Route>

          <Route path={match('/blog/:slug')} render={({ slug }) => (
            <blog-page slug={slug} />
          )} />

          <Route path="/enterprise">
            <capacitor-enterprise />
          </Route>

          <Route path="/docs">
            <document-component page="/docs/" />
          </Route>

          <Route path={match('/docs/:pageName*')} render={({ pageName }) => (
            <document-component page={`/docs/${pageName}`} />
          )} />
        </Router.Switch>
      </site-root>
    );
  }
}
