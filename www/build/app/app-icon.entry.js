const h = window.App.h;

class AppIcon {
    render() {
        return (h("svg", { class: `icon icon-${this.name}` },
            h("use", { xlinkHref: `#icon-${this.name}` })));
    }
    static get is() { return "app-icon"; }
    static get properties() { return {
        "name": {
            "type": String,
            "attr": "name"
        }
    }; }
    static get style() { return "app-icon .icon-checkmark {\n  fill: #4CAFFF;\n  width: 15px;\n  height: 11px;\n}\napp-icon .icon-targetblank {\n  fill: #86869c;\n  width: 9px;\n  height: 9px;\n}\napp-icon .icon-slack,\napp-icon .icon-twitter {\n  fill: #16161d;\n  width: 20px;\n  height: 20px;\n}\napp-icon .icon-menu {\n  fill: #4CAFFF;\n  width: 17px;\n  height: 15px;\n}\napp-icon .icon-close {\n  fill: #4CAFFF;\n  width: 14px;\n  height: 14px;\n}\napp-icon .icon-more {\n  fill: #4CAFFF;\n  width: 4px;\n  height: 18px;\n}\n\n.landing-page app-icon .icon-slack,\n.landing-page app-icon .icon-twitter {\n  fill: #4CAFFF;\n  width: 20px;\n  height: 20px;\n}"; }
}

export { AppIcon };
