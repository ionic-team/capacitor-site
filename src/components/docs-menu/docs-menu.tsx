import { Component, Prop, ComponentInterface, State, h } from '@stencil/core';
import { SiteStructureItem } from '../../global/definitions';
import state from '../../store';

@Component({
  tag: 'docs-menu',
  styleUrl: 'docs-menu.scss'
})
export class SiteMenu implements ComponentInterface{
  @Prop() siteStructureList: SiteStructureItem[] = [];
  @Prop({ mutable: true }) selectedParent: SiteStructureItem = null;

  @State() closeList = [];

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
          <ul class='menu-list'>
            { this.siteStructureList.map((item, i) => (
              <li>
                <a href="#" onClick={this.toggleParent(i)}>
                  <span class="section-label">
                    {item.text}
                  </span>
                </a>
                <ul class={{ 'collapsed': this.closeList.indexOf(i) !== -1 }}>
                { item.children.map((childItem) => (
                  <li>
                    { (childItem.url) ?
                    <a href={childItem.url} onClick={() => state.isLeftSidebarIn = !state.isLeftSidebarIn}>
                      {childItem.text}
                    </a> :
                    <a rel="noopener" class="link--external" target="_blank" href={childItem.filePath}>
                      {childItem.text}
                    </a> }
                  </li>
                )) }
                </ul>
              </li>
            )) }
          </ul>
        </div>
      </div>
    );
  }
}
