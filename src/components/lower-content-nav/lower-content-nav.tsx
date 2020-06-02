import { Component, Prop, h } from '@stencil/core';
import { SiteStructureItem } from '../../global/definitions';

@Component({
  tag: 'lower-content-nav',
  styleUrl: 'lower-content-nav.css'
})
export class LowerContentNav {

  @Prop() next?: SiteStructureItem;
  @Prop() prev?: SiteStructureItem; 

  render() {
    return [
      (this.prev != null ?
        <a href={this.prev.url} class="pull-left btn btn--secondary">
          Back
        </a> :
        null ),
      (this.next != null ?
        <a href={this.next.url} class="pull-right btn btn--primary">
          Next
        </a> :
        null )
    ];
  }
}