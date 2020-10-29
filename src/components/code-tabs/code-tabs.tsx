import { Component, Host, h, Prop, State, Element, Build } from '@stencil/core';
import { pixelize } from 'src/utils/common';

class MyMap extends Map<number, HTMLElement> {
  constructor(callback: (target: HTMLElement) => any) {
    super();
    this.set = (key, value) => {
      this[key] = value;
      if (key !== 0) return this;

      callback(value);

      if (value.offsetWidth > 0) {
        this.set = super.set;
      }
    };
  }
}

@Component({
  tag: 'code-tabs',
  styleUrl: 'code-tabs.scss',
  scoped: true,
})
export class CodeTabs {
  private tabs: Map<number, HTMLElement> = new MyMap(this.setActive.bind(this));
  private codeContainer: HTMLElement;

  @Element() elm: HTMLElement;
  @Prop() data: {
    tabs: string[];
    languages: string[];
    code: string[];
  };
  @State() activeTab = {
    index: 0,
    left: '0px',
    width: '0px',
  };
  @State() codeLeft;

  getTabsLeft() {
    return this.tabs[this.activeTab.index]?.offsetLeft.toString().concat('px');
  }

  handleTabSelect(ev: Event) {
    const target = ev.target as HTMLElement;
    this.setActive(target);
  }

  async setActive(target: HTMLElement) {
    if (Build.isServer) return;

    await customElements.whenDefined('code-tabs');

    this.codeContainer.style.willChange = 'left';

    requestAnimationFrame(() => {
      this.activeTab = {
        ...this.activeTab,
        left: pixelize(target.offsetLeft),
        width: pixelize(target.offsetWidth),
      };

      this.codeLeft = `-${pixelize(
        this.elm.offsetWidth * this.activeTab.index,
      )}`;

      this.codeContainer.style.willChange = 'unset';
    });
  }

  render() {
    return (
      <Host
        style={{
          '--tab-left': this.activeTab.left,
          '--tab-width': this.activeTab.width,
          '--code-left': this.codeLeft,
        }}
      >
        <nav>
          <div class="tabs-wrapper">
            {this.data.tabs.map((tab, i) => (
              <button
                class={{
                  active: this.activeTab.index === i,
                }}
                ref={el => this.tabs.set(i, el)}
                onClick={ev => {
                  this.activeTab.index = i;
                  this.handleTabSelect(ev);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>
        <div class="background">
          <div class="code-wrapper" ref={elm => (this.codeContainer = elm)}>
            {this.data.code.map((code, i) => (
              <article>
                <code-snippet
                  language={
                    this.data.languages.length === 1
                      ? this.data.languages[0]
                      : this.data.languages[i]
                  }
                  code={code}
                />
              </article>
            ))}
          </div>
        </div>
      </Host>
    );
  }
}
