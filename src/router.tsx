import { Fragment, h } from '@stencil/core';
import {
  Route,
  createStaticRouter,
  staticState,
  match,
  matchAny,
} from '@stencil/router';
import { getPage } from './data.server/prismic';
import { getDocsData } from './data.server/docs';
import { getBlogData, getAllBlogData } from './data.server/blog';
import { getDocsDataV2 } from './data.server/docs-v2';

export const Router = createStaticRouter();

export default Router;

export const Routes = () => (
  <Router.Switch>
    <Route
      path="/"
      mapParams={staticState(getPage)}
      render={(_, data) => (
        <Fragment>
          <SiteHeader />
          <landing-page data={data} />
        </Fragment>
      )}
    />

    <Route
      path={match('/blog', { exact: true })}
      mapParams={staticState(getAllBlogData)}
      render={(_, data) => (
        <Fragment>
          <SiteHeader />
          <blog-page data={data} />
        </Fragment>
      )}
    ></Route>

    <Route
      path={match('/blog/:slug*')}
      mapParams={staticState(getBlogData)}
      render={(_, data) => (
        <Fragment>
          <SiteHeader />
          <blog-post data={data} />
        </Fragment>
      )}
    />

    <Route
      path="/community"
      mapParams={staticState(getPage)}
      render={(_, data) => (
        <Fragment>
          <SiteHeader />
          <community-page data={data} />
        </Fragment>
      )}
    />

    <Route path="/cordova">
      <SiteHeader />
      <cordova-page />
    </Route>

    <Route path="/enterprise">
      <SiteHeader />
      <capacitor-enterprise />
    </Route>    

    <Route
      path={matchAny(['/docs/v3/:id*', '/docs/v3'])}
      mapParams={staticState(getDocsData)}
      render={(_, data) => <docs-component data={data} />}
    />

    <Route
      path={matchAny(['/docs/:id*', '/docs'])}
      mapParams={staticState(getDocsDataV2)}
      render={(_, data) => <docs-component data={data} />}
    />

    <Route
      path={match('/solution/:solutionId*')}
      render={({ solutionId }) => (
        <Fragment>
          <SiteHeader />
          <solution-page solutionId={solutionId} />
        </Fragment>
      )}
    />
  </Router.Switch>
);

Router.on('change', (newUrl, _oldUrl) => {
  (window as any).gtag('config', 'UA-44023830-42', {
    page_path: newUrl.pathname + newUrl.search,
  });

  // if (!oldUrl || oldUrl.pathname !== newUrl.pathname) {
  //   state.isLeftSidebarIn = false;
  //   state.showTopBar = true;
  //   state.pageTheme = 'light';
  // }

  // Reset scroll position
  // requestAnimationFrame(() => window.scrollTo(0, 0));

  // if (newUrl.hash) {
  //   const id = newUrl.hash.slice(1);
  //   setTimeout(() => {
  //     const el = document.getElementById(id);
  //     if (el) {
  //       el.scrollIntoView && el.scrollIntoView();
  //     }
  //   }, 50);
  // }
});

const SiteHeader = () => (
  <Fragment>
    <platform-bar
      containerClass="heading-container"
      productName="Capacitor"
    />
    <site-header class="heading-container" />
  </Fragment>
);

const docsPath = '/docs';
const versionedDocsPath = '/docs/v3';

export const docsVersionHref = (path: string) => {
  if (
    Router.path.startsWith(versionedDocsPath) &&
    !path.startsWith(versionedDocsPath)
  ) {
    return path.replace(docsPath, versionedDocsPath);
  }
  return path;
};
