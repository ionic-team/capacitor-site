import { Button } from '@ionic-internal/ionic-ds';
import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'contributor-list',
  styleUrl: 'contributor-list.css',
})
export class ContributorList {
  @Prop() contributors: string[];
  @Prop() repoFileUrl: string;

  render() {
    const c = this.contributors;
    if (!Array.isArray(c) || c.length === 0) {
      return null;
    }

    return (
      <Host>
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
        <Button
          anchor
          href={this.repoFileUrl}
          target="_blank"
          rel="noopener"
          size="md"
          kind="round"
          color="cyan"
          variation="muted"
        >
          Contribute
          <span class="arrow"> -&gt;</span>
        </Button>
      </Host>
    );
  }
}
