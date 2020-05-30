const h = window.App.h;

class DocSnippet {
    render() {
        return (h("div", { class: "snippet" }));
    }
    static get is() { return "doc-snippet"; }
}

export { DocSnippet };
