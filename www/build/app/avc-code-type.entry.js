const h = window.App.h;

class AvcCodeType {
    render() {
        if (this.typeId) {
            return (h("anchor-link", { to: `type-${this.typeId}` },
                h("slot", null)));
        }
        return (h("slot", null));
    }
    static get is() { return "avc-code-type"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "typeId": {
            "type": String,
            "attr": "type-id"
        }
    }; }
    static get style() { return ":host {\n    color: #5EB6FC;\n    display: inline-block;\n    color: $link-color;\n    font-weight: 500;\n  }"; }
}

export { AvcCodeType };
