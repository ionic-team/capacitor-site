import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'plugin-api-index',
  styleUrl: 'plugin-api-index.scss',
})
export class PluginApiIndex {
  // @Element() el: Element;
  @Prop() name: string;
  @Prop() index = false;
  @Prop() api: string;
  content: string;

  render() {
    if (!this.api || this.api === 'undefined' ) {
      return null;
    }
    const data = JSON.parse(this.api);
    if (
      data.length === 0 || 
      (data.methodChildren.length === 0 && data.listenerChildren.length === 0)
    ) {
      return null;
    }
    // console.log('gets here', data)
    return (
      <Host>
        <GenerateIndexForPlugin plugin={data} />
      </Host>
    );
  }
}

const GenerateIndexForPlugin = ({ plugin }) =>{
  // const { methodChildren, listenerChildren } = plugin;
  // global.console.log('gets here too', plugin);
  return (
    <div class="avc-code-plugin-index">
      <h3>Table of Contents</h3>
      <ul>
        {plugin.methodChildren.map((method, index) => { return (
          <li>
            <div class="avc-code-method-name">
              <anchor-link to={`method-${method.name}-${index}`}>
                {method.name}()
              </anchor-link>
            </div>
          </li>
        )})}

        {plugin.listenerChildren.map((method) => {
          return method.signatures.map((signature, index) => {
            var paramString = '';
            if (
              signature.eventNameParam && 
              signature.eventNameParam.type == 'stringLiteral'
            ) {
              paramString = `'${signature.eventNameParam.value}'`;
            }
            // global.console.log(method.name, signature)
            return (
              <li>
                <div class="avc-code-method-name">
                  <anchor-link to={`method-${method.name}-${index}`}>
                    {method.name}({paramString})
                  </anchor-link>
                </div>
              </li>
            );
          })
        })}
      </ul>
    </div>
  );
  
}