import { Component, Prop, ComponentInterface, State, h } from '@stencil/core';
import { SiteStructureItem } from '../../global/definitions';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'docs-menu',
  styleUrl: 'docs-menu.scss',
  scoped: true
})
export class SiteMenu implements ComponentInterface{
  @Prop() siteStructureList: SiteStructureItem[] = [];
  @Prop({ mutable: true }) selectedParent: SiteStructureItem = null;

  @State() closeList = [];

  componentWillLoad() {
    this.closeList = this.siteStructureList.map((_item, i) => i);
    this.closeList.shift();
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
    return (
      <div class="sticky">
        <div>
          <ul class="menu-list">
            { this.siteStructureList.map((item, i) => {
              const collapsed = this.closeList.indexOf(i) !== -1;

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
                    console.log('Rendering child item', childItem);
                    return (
                    <li>
                      { (childItem.url) ?
                      <a {...href(childItem.url)}>
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
            }) }
          </ul>
        </div>
      </div>
    );
  }
}
