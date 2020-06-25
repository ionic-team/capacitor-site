import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'solution-page',
  styleUrl: 'solution-page.css',
  scoped: true,
})
export class SolutionPage {
  @Prop() solutionId: string;

  render() {
    return (
      <Host>
        <h1>{this.solutionId}</h1>
      </Host>
    );
  }

}
