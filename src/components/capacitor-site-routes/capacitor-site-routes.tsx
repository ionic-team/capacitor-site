import { Component, Host, h } from '@stencil/core';

import { Route, match } from 'stencil-router-v2';

import { InternalRouterState } from 'stencil-router-v2/dist/types';

import state from '../../store';
import Router from '../../router';

@Component({
  tag: 'capacitor-site-routes',
  styleUrl: 'capacitor-site-routes.css',
})
export class CapacitorSiteRoutes {

  componentWillLoad() {
    let oldUrl: URL;

    Router.onChange('url', (newValue: InternalRouterState['url'], _oldValue: InternalRouterState['url']) => {
      (window as any).gtag('config', 'UA-44023830-42', { 'page_path': newValue.pathname + newValue.search });

      if (!oldUrl || oldUrl.pathname !== newValue.pathname) {
        state.isLeftSidebarIn = false;
        state.showTopBar = true;
        state.pageTheme = 'light';
      }

      oldUrl = newValue;

      // Reset scroll position
      requestAnimationFrame(() => window.scrollTo(0, 0));
    });
  }

  render() {
    return (
      <Host>
        <Router.Switch>
          <Route path="/">
            <landing-page />
          </Route>

          <Route path={match('/blog', { exact: true })} render={() => {
            return <blog-page />
          }} />

          <Route path={match('/blog/:slug')} render={({ slug }) => {
            return <blog-post slug={slug} />
          }} />


          <Route path="/enterprise">
            <capacitor-enterprise />
          </Route>

          <Route path="/community">
            <capacitor-community />
          </Route>

          <Route path="/docs">
            <document-component page="/docs" />
          </Route>

          <Route path={match('/docs/:pageName*')} render={({ pageName }) => (
            <document-component page={`/docs/${pageName}`} />
          )} />
        </Router.Switch>
      </Host>
    );
  }

}
