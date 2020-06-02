import '@stencil/router';
import { Component, Prop, Element, Listen, State, h } from '@stencil/core';
import { LocationSegments, RouterHistory } from '@stencil/router';
import SiteProviderConsumer, { SiteState } from '../../global/site-provider-consumer';

@Component({
  tag: 'capacitor-site',
  styleUrl: 'capacitor-site.scss'
})
export class App {
  history: RouterHistory = null;
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

  setHistory = ({ history }: { history: RouterHistory }) => {
    if (!this.history) {
      this.history = history;
      this.history.listen((location: LocationSegments) => {
        (window as any).gtag('config', 'UA-44023830-42', { 'page_path': location.pathname + location.search });
      });
    }
  }

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
    const siteState: SiteState = {
      isLeftSidebarIn: this.isLeftSidebarIn,
      toggleLeftSidebar: this.toggleLeftSidebar
    }

    return (
      <SiteProviderConsumer.Provider state={siteState}>
        <site-root>
          <div id="main-div">
            <site-platform-bar productName="Capacitor" />
            <capacitor-site-header />
            <div class="app root">
              <stencil-router scrollTopOffset={0}>
                <stencil-route style={{ display: 'none' }} routeRender={this.setHistory}/>
                <stencil-route-switch scrollTopOffset={0}>

                  <stencil-route
                    url="/"
                    component="landing-page"
                    exact={true}
                  />

                  <stencil-route
                    url="/blog"
                    component="blog-page"
                    exact={true}
                  />

                  <stencil-route
                    url="/blog/:slug"
                    component="blog-page"
                  />

                  <stencil-route url="/docs/" exact={true} routeRender={() => (
                    <document-component page='/docs/'></document-component>
                  )}/>

                  <stencil-route url="/enterprise/" exact={true} routeRender={() => (
                    <capacitor-enterprise />
                  )}/>

                  <stencil-route url="/docs/:pageName*" routeRender={({ match }) => (
                    <document-component page={match.url}></document-component>
                  )}/>
                </stencil-route-switch>
              </stencil-router>
            </div>
          </div>
        </site-root>
      </SiteProviderConsumer.Provider>
    );
  }
}
