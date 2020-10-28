import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import { pixelize } from 'src/utils/common';


@Component({
  tag: 'code-tabs',
  styleUrl: 'code-tabs.scss',
  scoped: true,
})
export class CodeTabs {
  private tabs: Map<number, HTMLElement> = new Map();
  private codeContainer: HTMLElement;

  @Element() elm: HTMLElement;
  @Prop() data: {
    tabs: string[]
    languages: string[]
    code: string[]
  }
  @State() activeTab = {
    index: 0,
    left: '0px',
    width: '0px'
  }
  @State() codeLeft;


  getTabsLeft() {
    return this.tabs[this.activeTab.index]?.offsetLeft
              .toString().concat('px');
  }

  componentDidLoad() {
    this.setActive(this.tabs.get(0));
  }

  handleTabSelect(ev: Event) {
    const target = ev.target as HTMLElement;
    this.setActive(target);
  }

  setActive(target: HTMLElement) {
    this.codeContainer.style.willChange = 'left';


    requestAnimationFrame(() => {
      this.activeTab = {
        ...this.activeTab,
        left: pixelize(target.offsetLeft),
        width: pixelize(target.offsetWidth)
      }
  
      this.codeLeft = `-${pixelize(this.elm.offsetWidth * this.activeTab.index)}`;

      this.codeContainer.style.willChange = 'unset';
    });
  }

  render() {

    return (
      <Host
        style={{
          '--tab-left': this.activeTab.left,
          '--tab-width': this.activeTab.width,
          '--code-left': this.codeLeft
        }}
      >
        <nav>
          <div class="tabs-wrapper">
            {this.data.tabs.map((tab, i) => (
              <button
                class={{
                  active: this.activeTab.index === i
                }}
                ref={el => this.tabs.set(i, el)}
                onClick={(ev) => {
                  this.activeTab.index = i;
                  this.handleTabSelect(ev)
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>
        <div class="background">
          <div class="code-wrapper" ref={elm => this.codeContainer = elm}>
            {this.data.code.map((code, i) => (
              <article>
                <code-snippet
                  language={this.data.languages.length === 1
                    ? this.data.languages[0]
                    : this.data.languages[i]}
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
