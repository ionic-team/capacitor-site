import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'plugin-api',
  styleUrl: 'plugin-api.scss',
})
export class PluginApi {
  // @Element() el: Element;
  @Prop() name: string;
  @Prop() index = false;
  @Prop() api: string;
  content: string;
  interfacesUsedMap = {};
  interfacesUsed = [];

  // componentDidUpdate() {
  //   this.bindHeadings(this.el);
  // }

  // bindHeadings(el: Element) {
  //   if (Build.isServer) {
  //     return;
  //   }

  //   const headings = Array.from(el.querySelectorAll('h1,h2,h3,h4,h5'));
  //   headings.forEach(h => {
  //     h.classList.add('anchor-link-relative');
  //     var link = document.createElement('anchor-link');
  //     link.className = 'hover-anchor';
  //     if (h.id) {
  //       link.to = h.id;
  //     }
  //     link.innerHTML = '#';
  //     h.insertBefore(link, h.firstChild);
  //   });
  // }

  render() {
    if (!this.api || this.api === 'undefined') {
      return null;
    }
    // debugger;
    const data = JSON.parse(this.api);
    console.log(data);

    return (
      <Host class="avc-code-plugin">
        {data.methodChildren.map(method => this.methodBuild(method))}
        {data.listenerChildren.map(method => this.methodBuild(method))}
        {this.getInterfacesUsed()}
      </Host>
    );
  }

  methodBuild(method) {
    // Only support methods with signatures, meaning they are our subclasses
    // implementation of it not our superclass' (I think...)
    if(!method.signatures) { return; }

    const html = this.generateMethod(method);
    const interfaces = this.getInterfacesUsedByMethod(method);
    // Dedupe the interfaces found in each method
    interfaces.filter(i => {
      if(this.interfacesUsedMap.hasOwnProperty(i.id)) {
        return false;
      }
      this.interfacesUsedMap[i.id] = i;
      return true;
    }).forEach(face => this.interfacesUsed.push(face));
    return html;
  }


  generateMethod(method) {
    return method.signatures.map((signature, index) => {
      const signatureString = this.generateMethodSignature(method, signature, index);
      const params = this.generateMethodParamDocs(signature);
      return <div class="avc-code-method">{signatureString + params}</div>;
    });
  };

  getInterfacesUsed() {
    const html = <h3 id="interfaces">Interfaces Used</h3>;
    // let childrenReferences = [];
    // this.interfacesUsed.forEach(face => {
    //   const interfaceDecl = typeLookup[face.id];
    //   if(!interfaceDecl) {
    //     return;
    //   }

    //   let kindString = interfaceDecl.kindString;
    //   if(!kindString) {
    //     kindString = 'Interface';
    //   } else if(kindString == 'Enumeration') {
    //     kindString = 'Enum';
    //   }

    //   html.push(`
    //   <div class="avc-code-interface" id="type-${face.id}">
    //     <h4 class="avc-code-interface-name">${face.name}</h4>
    //     <div class="avc-code-line">
    //       <span class="avc-code-keyword">${kindString.toLowerCase()}</span> <span class="avc-code-type-name">${face.name}</span>
    //       <span class="avc-code-brace">{</span>
    //     </div>
    //   `);

    //   if(interfaceDecl.children) {
    //     html.push(...interfaceDecl.children.map(c => {
    //       const nameString = c.type.name ? c.type.name : c.type.value ? `'${c.type.value}'` : c.type.type && c.type.type === 'array' ? `${c.type.elementType.name}[]` : 'any';
    //       if (!c.type.name && !c.type.value) {
    //         console.log(c);
    //       }
    //       if (c.type.type === 'reference') {
    //         const childRef = typeLookup[c.type.id];
    //         if (!childrenReferences.includes(childRef)) {
    //           childrenReferences.push(childRef);
    //         }
    //       }
    //       return `
    //         <div class="avc-code-interface-param">
    //           <div class="avc-code-param-comment">${c.comment && `// ${c.comment.shortText}` || ''}</div>
    //           <div class="avc-code-line"><span class="avc-code-param-name">${c.name}</span>
    //             ${c.flags && c.flags.isOptional ? '<span class="avc-code-param-optional">?</span>' : ''}${kindString !== 'Enum' && `:
    //             ${c.type.id && `<avc-code-type type-id="${c.type.id}">${nameString}</avc-code-type>` || `<avc-code-type>${nameString}</avc-code-type>`}` || ''};
    //           </div>
    //         </div>`;
    //     }));
    //   }
    //   html.push(`<span class="avc-code-line"><span class="avc-code-brace">}</span></span>`);
    // });

    // if(childrenReferences.length>0) {
    //   childrenReferences.map(child => {
    //     let kindString = child.kindString;
    //     if(!kindString) {
    //       kindString = 'Enum';
    //     } else if(kindString == 'Enumeration') {
    //       kindString = 'Enum';
    //     }
    //     html.push(`
    //     <div class="avc-code-interface" id="type-${child.id}">
    //       <h4 class="avc-code-interface-name">${child.name}</h4>
    //       <div class="avc-code-line">
    //         <span class="avc-code-keyword">${kindString.toLowerCase()}</span> <span class="avc-code-type-name">${child.name}</span>
    //         <span class="avc-code-brace">{</span>
    //       </div>`);
    //     if(child.children) {
    //       html.push(...child.children.map(c => {
    //         return `
    //           <div class="avc-code-interface-param">
    //             <div class="avc-code-param-comment">${c.comment && `// ${c.comment.shortText}` || ''}</div>
    //             <div class="avc-code-line"><span class="avc-code-param-name">${c.name}</span>:
    //               <avc-code-type">${c.defaultValue}</avc-code-type>
    //             </div>
    //           </div>`;
    //       }));
    //     }
    //     html.push(`<span class="avc-code-line"><span class="avc-code-brace">}</span></span>`);
    //   });
    // }
    // html.push(`</div>`);
    return html;
  }

  generateMethodSignature = (method, signature, _signatureIndex) => {
    //console.log(util.inspect(signature, {showHidden: false, depth: 20}))
    const params = signature.parameters;
    const parts = [
      <h3 class="avc-code-method-header" id="method-${method.name}-${signatureIndex}">{method.name}</h3>,
      <div class="avc-code-method-signature">
        <span class="avc-code-method-name">{method.name}</span>
        <span class="avc-code-paren">(</span>
        { params && params.map((param, i) => {
          const reply = [<span class="avc-code-param-name">{param.name}</span>]

          if(param.flags && param.flags.isOptional) {
            reply.push(<span class="avc-code-param-optional">?</span>);
          }

          reply.push(<span class="avc-code-param-colon">:</span> );
          reply.push(this.getParamTypeName(param));
          if(i < params.length-1) {
            reply.push(', ');
          }
          return reply;
        })}
      </div>
    ];
  
    // Build the params portion of the method
    params && params.forEach((param, i) => {
      parts.push(<span class="avc-code-param-name">${param.name}</span>)
  
      if(param.flags && param.flags.isOptional) {
        parts.push(<span class="avc-code-param-optional">?</span>);
      }
  
      parts.push(<span class="avc-code-param-colon">:</span> );
      parts.push(this.getParamTypeName(param));
      if(i < params.length-1) {
        parts.push(', ');
      }
    });
    parts.push([<span class="avc-code-paren">)</span>,<span class="avc-code-return-type-colon">:</span>]);
  
    const returnType = signature.type;
  
    // Add the return type of the method
    parts.push(this.getReturnTypeName(returnType));
  
    parts.push(signature.comment && <div class="avc-code-method-comment">${signature.comment.shortText}</div> || '');
  
    return parts.join('');
  }

  getInterfacesUsedByMethod(method) {
    const interfaces = method.signatures.map(signature => {
      // Build the params portion of the method
      const params = signature.parameters || [];
  
      const returnTypes = [];
      returnTypes.push(signature.type);
      signature.type.typeArguments && signature.type.typeArguments.forEach(arg => {
        returnTypes.push(arg);
      })
  
      return params.map(param => {
        const t = param.type.type;
        if(t == 'reference') {
          return param.type;
        }
      }).filter(n => n).concat(returnTypes.map(type => {
        const t = type.type;
        if(t == 'reference') {
          return type;
        }
      }).filter(n => n));
    });
  
    const ret = [];
    interfaces.forEach(iset => {
      iset.forEach(i => ret.push(i));
    });
  
    return ret;
  };

  getParamTypeName(param) {
    const t = param.type.type;
    if(t == 'reference') {
      if(param.type.id) {
        return <avc-code-type type-id="${param.type.id}">{param.type.name}</avc-code-type>;
      }
      return <avc-code-type>{param.type.name}</avc-code-type>;
  
    } else if (param.type.type == 'stringLiteral') {
      // These are the addListener(eventName: 'specificName') eventName params
      return <span class="avc-code-string">"{param.type.value}"</span>;
    } else if(t == 'intrinsic') {
      return <avc-code-type>{param.type.name}</avc-code-type>;
    } else if(t == 'reflection') {
      return <avc-code-type>{this.generateReflectionType(param.type)}</avc-code-type>;
    } else if(param.type.name) {
      return <avc-code-type>{param.type.name}</avc-code-type>;
    }
    return <avc-code-type>any</avc-code-type>;
  }

  generateReflectionType = (t) => {
    var d = t.declaration;
    var c = d.children;
    var s = d.signatures && d.signatures[0];
  
    if (s && s.kind == 4096) { // Call signature
      var parts = ['('];
      s.parameters = s.parameters || [];
  
      s.parameters.forEach((param, index) => {
        parts.push(`${param.name}: ${this.getParamTypeName(param)}`);
        if (index < s.parameters.length-1) {
          parts.push(', ');
        }
      });
      parts.push(') => ');
      parts.push(this.getReturnTypeName(s.type));
      return parts.join('');
    } else if(c) {
      var parts = ['{ '];
      c.forEach((child, index) => {
        parts.push(`${child.name}: ${this.getParamTypeName(child)}`);
        if (index < c.length - 1) {
          parts.push(', ');
        }
      });
      parts.push(' }');
      return parts.join('');
    }
    return 'any';
  }

  getReturnTypeName(returnType) {
    const r = returnType;
  
    const html = []
    if(r.type == 'reference' && r.id) {
      html.push(<avc-code-type type-id={r.id}>{r.name}</avc-code-type>);
    } else {
      html.push(`${r.name}`);
    }
  
    if(r.typeArguments) {
      html.push(<span class="avc-code-typearg-bracket">&lt;</span>);
      r.typeArguments.forEach((a, i) => {
        if(a.id) {
          html.push(<avc-code-type type-id={a.id}>{a.name}</avc-code-type>);
        } else if(a.type == 'reflection') {
          html.push(this.generateReflectionType(a));
        } else if(a.type == 'intrinsic') {
          html.push(this.generateIntrinsicType(a));
        } else {
          html.push(a.name);
        }
  
        if(i < r.typeArguments.length-1) {
          html.push(', ');
        }
      })
      html.push(<span class="avc-code-typearg-bracket">&gt;</span>);
    }
  
    return html.join('');
  };

  generateIntrinsicType(type) {
    return type.name;
  }

  generateMethodParamDocs(signature) {
    const params = signature.parameters;
    return [
      <div class="avc-code-method-params">
        {params && params.forEach(param => {
          <div class="avc-code-method-param-info">
            <span class="avc-code-method-param-info-name">{param.name}</span>
            {this.getParamTypeName(param)}
            {param.comment && <div class="avc-code-method-param-comment">{param.comment.text}</div>}
          </div>
        })}
        <div class="avc-code-method-returns-info">
        <span class="avc-code-method-returns-label">Returns:</span> 
          {this.getReturnTypeName(signature.type)}
          {signature.comment && signature.comment.returns ? ` - ${signature.comment.returns}` : ''}
        </div>
      </div>
    ]
  }
}
