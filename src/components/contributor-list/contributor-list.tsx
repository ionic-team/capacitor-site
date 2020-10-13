import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'contributor-list',
  styleUrl: 'contributor-list.css',
})
export class ContributorList {
  @Prop() contributors: string[];

  render() {
    const c = this.contributors;
    if (!Array.isArray(c) || c.length === 0) {
      return null;
    }

    return (
      <Host>
        <h2>Contributors</h2>
        <ul class="img-list">
          {c.reverse().map(contributor => (
            <li>
              <a
                class="contributor-img"
                target="_blank"
                href={`https://github.com/${contributor}`}
              >
                <img
                  src={`https://github.com/${contributor}.png?size=90`}
                  title={`Contributor ${contributor}`}
                  loading="lazy"
                />
              </a>
            </li>
          ))}
        </ul>
      </Host>
    );
  }
}
