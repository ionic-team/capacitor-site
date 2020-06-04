import { Component, Element, State, h } from '@stencil/core';

import { Route, match } from 'stencil-router-v2';
import { InternalRouterState } from 'stencil-router-v2/dist/types';

// import state from '../../store';
import Router from '../../router';

@Component({
  tag: 'capacitor-site',
  styleUrl: 'capacitor-site.scss'
})
export class App {
  @Element() el: HTMLElement;

  @State() isLeftSidebarIn: boolean;

  componentWillLoad() {
    Router.onChange('url', (newValue: InternalRouterState['url'], _oldValue: InternalRouterState['url']) => {
      (window as any).gtag('config', 'UA-44023830-42', { 'page_path': newValue.pathname + newValue.search });
      // state.isLeftSidebarIn = false;
    });
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
