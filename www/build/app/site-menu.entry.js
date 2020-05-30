const h = window.App.h;

import './chunk-8e0d955e.js';
import { a as SiteProviderConsumer } from './chunk-8bc17254.js';

class SiteMenu {
    constructor() {
        this.siteStructureList = [];
        this.selectedParent = null;
        this.closeList = [];
        this.toggleParent = (itemNumber) => {
            return (e) => {
                e.preventDefault();
                if (this.closeList.indexOf(itemNumber) !== -1) {
                    this.closeList.splice(this.closeList.indexOf(itemNumber), 1);
                    this.closeList = [...this.closeList];
                }
                else {
                    this.closeList = [...this.closeList, itemNumber];
                }
                console.log(e, this.closeList);
            };
        };
    }
    render() {
        return (h("div", { class: "sticky" },
            h(SiteProviderConsumer.Consumer, null, ({ toggleLeftSidebar }) => (h("div", null,
                h("ul", { class: 'menu-list' }, this.siteStructureList.map((item, i) => (h("li", null,
                    h("a", { href: "#", onClick: this.toggleParent(i) },
                        h("span", { class: "section-label" }, item.text)),
                    h("ul", { class: { 'collapsed': this.closeList.indexOf(i) !== -1 } }, item.children.map((childItem) => (h("li", null, (childItem.url) ?
                        h("stencil-route-link", { url: childItem.url, exact: true, onClick: toggleLeftSidebar }, childItem.text) :
                        h("a", { rel: "noopener", class: "link--external", target: "_blank", href: childItem.filePath }, childItem.text))))))))))))));
    }
    static get is() { return "site-menu"; }
    static get properties() { return {
        "closeList": {
            "state": true
        },
        "selectedParent": {
            "type": "Any",
            "attr": "selected-parent",
            "mutable": true
        },
        "siteStructureList": {
            "type": "Any",
            "attr": "site-structure-list"
        }
    }; }
    static get style() { return ":root {\n  --color-woodsmoke: #16161D;\n  --color-dolphin: #626177;\n  --color-gunpowder: #505061;\n  --color-manatee: #8888A2;\n  --color-cadet-blue: #abb2bf;\n  --color-whisper: #EBEBF7;\n  --color-selago: #F4F4FD;\n  --color-white-lilac: #f8f8fc;\n  --color-white: #fff;\n  --color-green-haze: #00AB47;\n  --color-dodger-blue: #1d9aff;\n  --color-dodger-blue-hover: rgba(#1d9aff, 0.2);\n  --color-old-lace: #fdf5e4;\n  --color-wheatfield: #F1E3C5;\n  --color-pirate-gold: #9A6400;\n  --button-shadow: 0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);\n  --button-shadow-hover: 0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);\n  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\nsite-menu {\n  display: block;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  margin-top: 100px;\n}\n\nsite-menu .section-label {\n  color: var(--color-woodsmoke);\n  margin-bottom: 0;\n  font-size: 14px;\n  font-weight: 600;\n}\n\nsite-menu .menu-list li,\nsite-menu .menu-list ul li {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n}\n\nsite-menu .menu-list {\n  margin-top: 0;\n  padding: 0;\n}\n\nsite-menu .menu-list .section-label:first-of-type {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\nsite-menu .menu-list ul {\n  padding: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\nsite-menu .menu-list li {\n  font-size: 14px;\n}\n\nsite-menu .menu-list > li + li {\n  margin-top: 8px;\n}\n\nsite-menu .menu-list a {\n  font-weight: 400;\n  color: #6c6c8b;\n  text-decoration: none;\n  border: 0;\n}\n\nsite-menu .menu-list a:hover {\n  border: 0;\n}\n\nsite-menu .menu-list .link-active {\n  font-weight: 500;\n  color: var(--color-dodger-blue);\n}\n\nsite-menu .menu-list a:hover:not(.link-active) {\n  color: var(--color-woodsmoke);\n}\n\nsite-menu .menu-list ul li {\n  padding-left: 8px;\n  -webkit-transition: 80ms height;\n  transition: 80ms height;\n  height: 26px;\n  display: block;\n  overflow: hidden;\n}\n\nsite-menu .menu-list ul li a {\n  display: block;\n  -webkit-transition: 0.2s color ease, 0.2s -webkit-transform ease;\n  transition: 0.2s color ease, 0.2s -webkit-transform ease;\n  transition: 0.2s transform ease, 0.2s color ease;\n  transition: 0.2s transform ease, 0.2s color ease, 0.2s -webkit-transform ease;\n}\n\nsite-menu .menu-list ul li:hover a,\nsite-menu .menu-list ul li a.link-active {\n  -webkit-transform: translateX(2px);\n  transform: translateX(2px);\n}\n\nsite-menu .menu-list ul.collapsed li {\n  height: 0;\n}\n\n\@media screen and (max-width: 768px) {\n  site-menu {\n    position: fixed;\n    top: 0;\n    left: 0;\n    background: var(--color-woodsmoke);\n    z-index: 999;\n    padding: 20px;\n    width: calc(100vw - 56px);\n    -webkit-transform: translateX(calc(-100vw + 56px));\n    transform: translateX(calc(-100vw + 56px));\n    height: 100%;\n    overflow-y: scroll;\n  }\n\n  site-menu .menu-list .section-label {\n    color: white;\n  }\n\n  site-menu .menu-list a {\n    color: rgba(255, 255, 255, 0.6);\n  }\n\n  site-menu .menu-list a:hover:not(.link-active) {\n    color: white;\n  }\n}"; }
}

export { SiteMenu };
