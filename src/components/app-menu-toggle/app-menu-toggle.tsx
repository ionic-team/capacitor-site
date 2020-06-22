import { Component, Event, EventEmitter, Host, h } from '@stencil/core';

@Component({
  tag: 'app-menu-toggle',
  styleUrl: 'app-menu-toggle.scss'
})
export class AppBurger {

  @Event() menuToggleClick: EventEmitter;

  handleButtonClick() {
    this.menuToggleClick.emit();
  }

  render() {
    return (
      <Host>
        <button class="menu-toggle-button" onClick={() => this.handleButtonClick() }>
          <ion-icon name="menu-outline" class="icon-menu"></ion-icon>
          <ion-icon name="close" class="icon-close"></ion-icon>
        </button>
      </Host>
    )
  }
}
