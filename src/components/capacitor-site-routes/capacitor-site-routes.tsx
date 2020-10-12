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

      if (newValue.hash) {
        const id = newValue.hash.slice(1);
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView && el.scrollIntoView();
          }
        }, 50);
      }
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

          <Route path="/cordova">
            <cordova-landing-page />
          </Route>

          <Route path="/enterprise">
            <capacitor-enterprise />
          </Route>

          <Route path="/community">
            <capacitor-community />
          </Route>

          <Route path="/docs">
            <document-component page="/docs" />
          </Route>

          <Route path={match('/docs/:route*')} render={( opts ) => (
            <document-component page={`/docs/${opts.route}`}/>
          )} />

          <Route path={match('/solution/:solutionId*')} render={({solutionId}) => (
            <solution-page solutionId={solutionId} />
          )} />
        </Router.Switch>
      </Host>
    );
  }
}
