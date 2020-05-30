const h = window.App.h;

class PluginApi {
    componentWillLoad() {
        if (this.isServer) {
            return;
        }
        const url = `api${this.index ? '-index' : ''}.html`;
        return fetch(`/assets/docs-content/apis/${this.name}/${url}`)
            .then(response => {
            return response.text();
        })
            .then(data => {
            this.content = data;
            const el = document.createElement('div');
            el.innerHTML = data;
        });
    }
    componentDidUpdate() {
        this.bindHeadings(this.el);
    }
    bindHeadings(el) {
        if (this.isServer) {
            return;
        }
        const headings = Array.from(el.querySelectorAll('h1,h2,h3,h4,h5'));
        headings.forEach(h => {
            h.classList.add('anchor-link-relative');
            var link = document.createElement('anchor-link');
            link.className = 'hover-anchor';
            if (h.id) {
                link.to = h.id;
            }
            link.innerHTML = '#';
            h.insertBefore(link, h.firstChild);
        });
    }
    render() {
        return (h("div", null,
            h("div", { innerHTML: this.content })));
    }
    static get is() { return "plugin-api"; }
    static get properties() { return {
        "content": {
            "state": true
        },
        "el": {
            "elementRef": true
        },
        "index": {
            "type": Boolean,
            "attr": "index"
        },
        "isServer": {
            "context": "isServer"
        },
        "name": {
            "type": String,
            "attr": "name"
        }
    }; }
    static get style() { return "/*Consolas,Menlo,Monaco,source-code-pro,Courier New,monospace;*/\nplugin-api .avc-code-plugin-index ul anchor-link div {\n  display: inline-block;\n}\nplugin-api .avc-code-plugin-index anchor-link {\n  color: #5EB6FC;\n  cursor: pointer;\n}\nplugin-api .avc-code-plugin-name {\n  display: none;\n}\nplugin-api .avc-code-method-anchor-point {\n  height: 20px;\n}\nplugin-api .avc-code-method {\n  margin-bottom: 25px;\n}\nplugin-api .avc-code-method .avc-code-method-header {\n  margin-top: 15px;\n}\nplugin-api .avc-code-method .avc-code-method-comment {\n  margin: 20px 0;\n}\nplugin-api .avc-code-method-signature {\n  font-family: monospace;\n  padding: 8px;\n  background-color: #eee;\n  border-radius: 3px;\n}\nplugin-api .avc-code-method-params .avc-code-method-param-info .avc-code-method-param-info-name {\n  font-size: 14px;\n  font-weight: bold;\n}\nplugin-api .avc-code-method-params .avc-code-method-param-info .avc-code-type-name, plugin-api .avc-code-method-params .avc-code-method-param-info avc-code-type {\n  margin-left: 5px;\n  margin-right: 5px;\n  font-style: italic;\n}\nplugin-api .avc-code-method-params .avc-code-method-param-info .avc-code-method-param-comment {\n  display: inline-block;\n}\nplugin-api .avc-code-method-params .avc-code-method-returns-label {\n  font-weight: bold;\n  font-size: 14px;\n  text-transform: lowercase;\n}\nplugin-api .avc-code-string {\n  color: #5EB6FC;\n}\nplugin-api .avc-code-interface {\n  margin-top: 25px;\n  font-family: monospace;\n  line-height: 18px;\n}\nplugin-api .avc-code-interface-param {\n  margin-left: 25px;\n  margin: 8px 0 8px 25px;\n}\nplugin-api .avc-code-param-comment {\n  color: #8b94a5;\n}"; }
}

export { PluginApi };
