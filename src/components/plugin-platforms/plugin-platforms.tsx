import { Component, Prop, h } from '@stencil/core';
@Component({
  tag: 'plugin-platforms',
  styleUrl: 'plugin-platforms.scss'
})
export class PluginPlatforms {
  @Prop() platforms: string = "";

  render() {
    const platforms = this.platforms.split(',');
    return (
    <div class="platforms">
      {platforms.map(platform => {
        return (
          <img src={`/assets/img/landing/${platform}.png`} alt={`${platform}`} title={`${platform}`}  />
        )
      })}
    </div>
    );
  }
}
