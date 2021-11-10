import { useRef, useState } from 'react';
import ContributorList from '../../components/docs/ContributorList';
import InPageNavigtion from '../../components/docs/InPageNavigation';
import LowerContentNav from '../../components/docs/LowerContentNav';
import SiteBackdrop from '../../components/site/SiteBackdrop';
import SiteHeader from '../../components/site/SiteHeader';
import SiteMeta from '../../components/site/SiteMeta';
import { RenderJsxAst } from '../../markdown/render-ast';
import { DocsData } from './data';

interface Props {
  data: DocsData;
}
const Docs: React.FC<Props> = ({ data }) => {
  // menuEl!: HTMLDocsMenuElement;
  const el = useRef<HTMLElement | null>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);

  console.log('Rendering data', data);

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

  console.log('Rendering docs ast', DocsAst);

  return (
    <>
      <SiteMeta canonicalUrl={data.canonicalUrl} title={data.title} description={makeDescription(data)} />
      <div className="row">
        <SiteBackdrop visible={showBackdrop} onClick={backdropClicked} />

        {/*
        <DocsMenu
          ref={menuEl}
          template={data.template}
          toc={data.tableOfContents}
          activePath={Router.path}
        />
        */}

        <div className="content-wrapper">
          <SiteHeader className="docs-container" template={data.template} includeLogo={false} includeBurger />
          <div className="app-marked  docs-container">
            <div className="doc-content">
              <div className="measure-lg">
                <RenderJsxAst ast={data.ast} elementProps={elementRouterHref} />
                <LowerContentNav navigation={data.navigation} />
                <ContributorList contributors={data.contributors} editUrl={data.editUrl} editApiUrl={data.editApiUrl} />
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
    </>
  );
};

const elementRouterHref = (tagName: string, props: any) => {
  /*
  if (tagName === 'a' && typeof props.href === 'string') {
    const currentHost = new URL(document.baseURI).host;
    const gotoHost = new URL(props.href, document.baseURI).host;

    if (currentHost !== gotoHost) {
      return {
        ...props,
        target: '_blank',
        class: props.class ? `${props.class} external-link` : 'external-link',
        rel: 'noopener',
      };
    }

    return {
      ...props,
      //...href(docsVersionHref(props.href)),
      href: props.href,
    };
  }
  */
  return props;
};

const makeDescription = (data: DocsData) => `${data.description} - Capacitor Documentation`;

export default Docs;
