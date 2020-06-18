import { Component, Prop, ComponentInterface, State, h, Watch } from '@stencil/core';
import { SiteStructureItem } from '../../global/definitions';
import { href } from 'stencil-router-v2';

import Router from '../../router';
import state from '../../store';

@Component({
  tag: 'docs-menu',
  styleUrl: 'docs-menu.scss',
  scoped: true
})
export class SiteMenu implements ComponentInterface{
  version: string;

  @Prop() siteStructureList: SiteStructureItem[] = [];
  @Prop({ mutable: true }) selectedParent: SiteStructureItem = null;

  @State() closeList = [];

  async componentWillLoad() {
    const parentIndex = this.siteStructureList.findIndex(item => item === this.selectedParent);
    this.closeList = this.siteStructureList.map((_item, i) => i).filter(i => i !== parentIndex);

    try {
      const ret = await fetch("https://api.github.com/repos/ionic-team/capacitor/releases/latest")
      const json = await ret.json();

      this.version = json.tag_name;
    } catch (e) {
      console.error('Unable to get latest release', e);
    }
  }

  @Watch('selectedParent')
  selectedParentChange() {
    const parentIndex = this.siteStructureList.findIndex(item => item === this.selectedParent);
    this.closeList = this.siteStructureList.map((_item, i) => i).filter(i => i !== parentIndex);
  }

  toggleParent = (itemNumber) => {
    return (e: MouseEvent) => {
      e.preventDefault();
      if (this.closeList.indexOf(itemNumber) !== -1) {
        this.closeList.splice(this.closeList.indexOf(itemNumber), 1)
        this.closeList = [...this.closeList];
      } else {
        this.closeList = [...this.closeList, itemNumber];
      }

      console.log(e, this.closeList)
    }
  }

  render() {
    const { version } = this;

    return (
      <div class="sticky">
        <div>
          <div class="menu-header">
            <a {...href('/')} class="menu-header__logo-link">
              {state.pageTheme === 'dark' ? (
                <img src="/assets/img/heading/logo-white.png" alt="Capacitor Logo" />
              ) : (
                <img src="/assets/img/heading/logo-black.png" alt="Capacitor Logo" />
              )}
            </a>
            <a {...href('/docs')} class="menu-header__docs-link">
              docs
            </a>
            { version ?
              <a href={`https://github.com/ionic-team/capacitor/releases/tag/${version}`} rel="noopener" target="_blank" class="menu-header__version-link">
                v{version}
              </a>
              : null
            }
          </div>
          <ul class="menu-list">
            { this.siteStructureList.map((item, i) => {
              const active = item.url === Router.activePath;
              const collapsed = this.closeList.indexOf(i) !== -1;

              if (item.children) {
                return (
                  <li>
                    <a href="#" onClick={this.toggleParent(i)} class={{ collapsed }}>
                      { collapsed ? <ion-icon name="chevron-forward" /> : <ion-icon name="chevron-down" /> }
                      <span class="section-label">
                        {item.text}
                      </span>
                    </a>
                    <ul class={{ collapsed }}>
                    { item.children.map((childItem) => {
                      return (
                      <li>
                        { (childItem.url) ?
                        <a {...href(childItem.url)} class={{'link-active': childItem.url === Router.activePath}}>
                          {childItem.text}
                        </a> :
                        <a rel="noopener" class="link--external" target="_blank" href={childItem.filePath}>
                          {childItem.text}
                        </a> }
                      </li>
                      )
                    }) }
                    </ul>
                  </li>
                )
              }

              return (
                <li>
                  { (item.url) ?
                  <a {...href(item.url)} class={{
                    "section-active": active
                  }}>
                    <span class="section-active-indicator" />
                    <span class="section-label">
                      {item.text}
                    </span>
                  </a>:
                  <a rel="noopener" class="link--external" target="_blank" href={item.filePath}>
                    {item.text}
                  </a> }
                </li>
              )
            }) }
          </ul>
        </div>
      </div>
    );
  }
}
