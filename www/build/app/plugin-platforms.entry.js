const h = window.App.h;

class PluginPlatforms {
    constructor() {
        this.platforms = "";
    }
    componentDidLoad() {
    }
    render() {
        const platforms = this.platforms.split(',');
        return (h("div", { class: "platforms" }, platforms.map(platform => {
            return (h("div", { class: `platform platform-icon-${platform}` }, platform));
        })));
    }
    static get is() { return "plugin-platforms"; }
    static get properties() { return {
        "platforms": {
            "type": String,
            "attr": "platforms"
        }
    }; }
    static get style() { return "plugin-platforms {\n  display: block;\n}\nplugin-platforms .platforms .platform {\n  display: inline-block;\n}"; }
}

export { PluginPlatforms };
