import { NextRouter, useRouter } from 'next/router';
import { useRef, useState } from 'react';
import Config from '../../../config';
import { docsVersionHref } from '../../../routing';
import AnnouncementBar from '../../components/announcement-bar/AnnouncementBar';
import ContributorList from '../../components/docs/ContributorList';
import DocsMenu from '../../components/docs/DocsMenu';
import InPageNavigtion from '../../components/docs/InPageNavigation';
import LowerContentNav from '../../components/docs/LowerContentNav';
import SiteBackdrop from '../../components/site/SiteBackdrop';
import SiteHeader from '../../components/site/SiteHeader';
import SiteMeta from '../../components/site/SiteMeta';
import { RenderJsxAst } from '../../markdown/render-ast';
import { DocsData } from './data';
import DocsStyles from './Docs.styles';

interface Props {
  data: DocsData;
  announcement_bar: any;
}
const Docs: React.FC<Props> = ({ data, announcement_bar }) => {
  const menuEl = useRef<HTMLElement | null>(null);
  const el = useRef<HTMLElement | null>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const router = useRouter();

  /*
  @Listen('menuToggleClick')
  toggleMenu() {
    this.menuEl.toggleOverlayMenu();
  }

  @Listen('menuToggled')
  menuToggled(ev: CustomEvent) {
    const isOpen = ev.detail;
    this.showBackdrop = isOpen;
  }
  */

  const backdropClicked = () => {
    // this.menuEl.toggleOverlayMenu();
  };

  if (!data) {
    // TODO: Handle 404's
    return (
      <div className="container">
        <strong>Page Not Found</strong>
      </div>
    );
  }

  const DocsAst = data.ast as any;

  return (
    <>
      <AnnouncementBar {...announcement_bar} />
      <SiteMeta canonicalUrl={data.canonicalUrl} title={data.title} description={makeDescription(data)} />
      <DocsStyles>
        <div className="row">
          <SiteBackdrop visible={showBackdrop} onClick={backdropClicked} />

          <DocsMenu template={data.template} toc={data.tableOfContents} activePath={router.asPath} />

          <div className="content-wrapper">
            <SiteHeader className="docs-container" template={data.template} includeLogo={false} includeBurger />
            <div className="app-marked  docs-container">
              <div className="doc-content">
                <div className="measure-lg">
                  <RenderJsxAst
                    ast={data.ast}
                    elementProps={(tagName: string, props: any) => {
                      return elementRouterHref(router, tagName, props);
                    }}
                  />
                  <LowerContentNav navigation={data.navigation} />
                  <ContributorList
                    contributors={data.contributors}
                    editUrl={data.editUrl}
                    editApiUrl={data.editApiUrl}
                  />
                </div>
              </div>

              <InPageNavigtion
                headings={data.headings}
                editUrl={data.editUrl}
                editApiUrl={data.editApiUrl}
                url={data.navigation.current.url}
              />
            </div>
          </div>
        </div>
      </DocsStyles>
    </>
  );
};

const elementRouterHref = (router: NextRouter, tagName: string, props: any) => {
  if (tagName === 'a' && typeof props.href === 'string') {
    // const currentHost = new URL(document.baseURI).host;
    // const gotoHost = new URL(props.href, document.baseURI).host;
    //if (currentHost !== gotoHost) {

    const baseHost = new URL(Config.BaseUrl).host;
    const gotoHost = new URL(props.href, Config.BaseUrl).host;
    if (gotoHost != baseHost) {
      return {
        ...props,
        target: '_blank',
        class: props.class ? `${props.class} external-link` : 'external-link',
        rel: 'noopener',
      };
    }

    return {
      ...props,
      href: docsVersionHref(router.asPath, props.href),
    };
  }
  return props;
};

const makeDescription = (data: DocsData) => `${data.description} - Capacitor Documentation`;

export default Docs;
