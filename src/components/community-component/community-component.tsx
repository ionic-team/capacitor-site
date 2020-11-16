import { Component, ComponentInterface, Element, Fragment, h, Listen, Prop, State } from '@stencil/core';
import { href } from '@stencil/router';
import { RenderJsxAst } from '@stencil/ssg';
import { CommunityData } from '../../data.server/community';
import Router from '../../router';


@Component({
  tag: 'community-component',
  styleUrl: 'community-component.scss',
  scoped: true,
})
export class CommunityComponent implements ComponentInterface {
  menuEl!: HTMLCommunityMenuElement;

  @Prop() data: CommunityData;

  @State() showBackdrop = false;

  @Element() el;

  @Listen('menuToggleClick')
  toggleMenu() {
    this.menuEl.toggleOverlayMenu();
  }

  @Listen('menuToggled')
  menuToggled(ev: CustomEvent) {
    const isOpen = ev.detail;
    this.showBackdrop = isOpen;
  }

  backdropClicked = () => {
    this.menuEl.toggleOverlayMenu();
  };

  render() {
    const { data, showBackdrop } = this;

    if (!data) {
      return (
        <div class="container">
          <strong>Page Not Found</strong>
        </div>
      );
    }
    return (
      <Fragment>
        <meta-tags
          page-title={this.data.title}
          description={`${this.data.description} - Capacitor Community Plugins`}
        />
        <platform-bar
          containerClass="sc-docs-component docs-container"
          productName="Capacitor"
        />
        <div class="row">
          <site-backdrop
            visible={showBackdrop}
            onClick={this.backdropClicked}
          />

          <community-menu
            ref={el => (this.menuEl = el)}
            template={data.template}
            activePath={Router.path}
          />
          <div class="content-wrapper">
            <site-header
              class="docs-container"
              template={data.template}
              includeLogo={false}
              includeBurger
            />
            <div class="app-marked  docs-container">
              <div class="doc-content">
                <div class="measure-lg">
                  <h1 class="ui-heading ui-heading-1 ui-theme--editorial sc-docs-component">{data.title}</h1>
                  <p
                    class="ui-paragraph ui-paragraph--prose ui-paragraph-3 paragraph-intro sc-docs-component">{data.description}</p>
                  <plugin-platforms platforms={data.platforms.join(',')}></plugin-platforms>
                  <RenderJsxAst
                    ast={data.ast}
                    elementProps={elementRouterHref}
                  />
                  <lower-content-nav navigation={data.navigation} />
                  <contributor-list
                    contributors={data.contributors}
                    repoFileUrl={data.editUrl}
                  />
                </div>
              </div>

              <in-page-navigation
                headings={data.headings}
                editUrl={data.editUrl}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const elementRouterHref = (tagName: string, props: any) => {
  if (tagName === 'a' && typeof props.href === 'string') {
    const currentHost = new URL(document.baseURI).host;
    const gotoHost = new URL(props.href, document.baseURI).host;

    if (currentHost !== gotoHost) {
      return {
        ...props,
        target: '_blank',
        class: 'external-link',
        rel: 'noopener',
      };
    }

    return {
      ...props,
      ...href(props.href),
    };
  }
  return props;
};
