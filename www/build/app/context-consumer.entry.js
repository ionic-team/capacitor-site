const h = window.App.h;

class ContextConsumer {
    constructor() {
        this.context = {};
        this.renderer = () => null;
    }
    componentWillLoad() {
        this.unsubscribe = () => {
            if (this.subscribe != null) {
                this.subscribe(this.el, "context");
            }
        };
    }
    componentDidUnload() {
        if (this.unsubscribe != null) {
            this.unsubscribe();
        }
    }
    render() {
        return this.renderer(Object.assign({}, this.context));
    }
    static get is() { return "context-consumer"; }
    static get properties() {
        return {
            "context": {
                "type": "Any",
                "attr": "context"
            },
            "el": {
                "elementRef": true
            },
            "renderer": {
                "type": "Any",
                "attr": "renderer"
            },
            "subscribe": {
                "type": "Any",
                "attr": "subscribe"
            },
            "unsubscribe": {
                "state": true
            }
        };
    }
}

export { ContextConsumer };
