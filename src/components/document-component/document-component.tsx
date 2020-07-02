import { Component, Listen, Prop, Watch, ComponentInterface, State, h } from '@stencil/core';
import Helmet from '@stencil/helmet';

import docsStructure from '../../assets/docs-structure.json';
import pluginsStructure from '../../assets/plugins-structure.json';
import { findItem } from '../../global/site-structure-utils';
import { SiteStructureItem } from '../../global/definitions';
import { handleRoutableLinkClick } from '../../utils/route-link';

import state from '../../store';

@Component({
  tag: 'document-component',
  styleUrl: 'document-component.scss'
})
export class DocumentComponent implements ComponentInterface {
  menuStructure;

  menuEl!: HTMLDocsMenuElement;

  @Prop() pages: string[] = [];

  @Prop() page: string = null;

  @Prop() template: 'docs' | 'plugins' = 'docs';

  @State() item: SiteStructureItem;
  @State() nextItem: SiteStructureItem;
  @State() prevItem: SiteStructureItem;
  @State() parent: SiteStructureItem;

  @Listen('menuToggleClick')
  toggleMenu() {
    this.menuEl.toggleOverlayMenu();
  }

  componentWillLoad() {
    console.log(pluginsStructure);
    state.showTopBar = false;
    this.menuStructure = docsStructure;

    if (this.template === 'plugins') {
      this.menuStructure = pluginsStructure;
    }

    return this.fetchNewContent(this.page);
  }

  @Watch('page')
  fetchNewContent(page: string, oldPage?: string) {
    if (page == null || page === oldPage) {
      return;
    }
    state.showTopBar = false;
    const foundData = findItem(this.menuStructure as SiteStructureItem[], this.page);
    this.item = foundData.item;
    this.nextItem = foundData.nextItem;
    this.prevItem = foundData.prevItem;
    this.parent = foundData.parent;
  }

  render() {
    if (this.item == null) {
      return <h1>Page not found</h1>;
    }
    return (
      <div class="container">
        <app-menu-toggle />

        <docs-menu
          ref={ el => this.menuEl = el }
          template={this.template}
          selectedParent={this.parent}
          siteStructureList={this.menuStructure as SiteStructureItem[]} />

        <div class="content-container">
          <docs-header template={this.template} />

          <app-marked fetchPath={this.item.filePath} renderer={(docsContent) => [
            <Helmet>
              <title>{docsContent.title ? `${docsContent.title} - Capacitor` : 'Capacitor'}</title>
            </Helmet>,
            <div class="doc-content">
              <div class="measure-lg">
                <div
                  onClick={handleRoutableLinkClick}
                  innerHTML={docsContent.content}></div>
                <h2>Contributors</h2>
                <contributor-list contributors={docsContent.contributors}></contributor-list>
                <lower-content-nav next={this.nextItem} prev={this.prevItem}></lower-content-nav>
              </div>
            </div>,
            <in-page-navigation
              pageLinks={docsContent.headings}
              srcUrl={docsContent.srcPath}
              currentPageUrl={docsContent.url}
            ></in-page-navigation>
          ]}/>
        </div>
      </div>
    );
  }
}
