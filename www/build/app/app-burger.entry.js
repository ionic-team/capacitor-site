const h = window.App.h;

import './chunk-8e0d955e.js';
import { a as SiteProviderConsumer } from './chunk-8bc17254.js';
import { a as matchPath, b as matchesAreEqual, c as ActiveRouter, d as storageAvailable, e as canUseDOM, f as supportsHistory, g as supportsPopStateOnHashChange, h as getConfirmation, i as stripTrailingSlash, j as addLeadingSlash, k as hasBasename, l as stripBasename, m as createLocation, n as createKey, o as isExtraneousPopstateEvent, p as createPath, q as addEventListener, r as removeEventListener, s as stripLeadingSlash, t as supportsGoWithoutReloadUsingHash, u as locationsAreEqual } from './chunk-86910e0a.js';

class AppBurger {
    handleBurgerClicked() {
        this.burgerClick.emit();
    }
    render() {
        return (h("div", { class: "burger", onClick: () => this.handleBurgerClicked() },
            h("app-icon", { name: "menu" }),
            h("app-icon", { name: "close" })));
    }
    static get is() { return "app-burger"; }
    static get events() { return [{
            "name": "burgerClick",
            "method": "burgerClick",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":root {\n  --color-woodsmoke: #16161D;\n  --color-dolphin: #626177;\n  --color-gunpowder: #505061;\n  --color-manatee: #8888A2;\n  --color-cadet-blue: #abb2bf;\n  --color-whisper: #EBEBF7;\n  --color-selago: #F4F4FD;\n  --color-white-lilac: #f8f8fc;\n  --color-white: #fff;\n  --color-green-haze: #00AB47;\n  --color-dodger-blue: #1d9aff;\n  --color-dodger-blue-hover: rgba(#1d9aff, 0.2);\n  --color-old-lace: #fdf5e4;\n  --color-wheatfield: #F1E3C5;\n  --color-pirate-gold: #9A6400;\n  --button-shadow: 0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);\n  --button-shadow-hover: 0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);\n  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\napp-burger {\n  display: none;\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  z-index: 999;\n}\napp-burger > div {\n  padding: 18px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: start;\n  align-items: flex-start;\n  -ms-flex-pack: center;\n  justify-content: center;\n}\napp-burger > div:hover app-icon {\n  opacity: 1;\n}\napp-burger .icon-menu {\n  display: block;\n}\napp-burger .icon-close {\n  display: none;\n}\napp-burger app-icon {\n  -webkit-transition: opacity 0.3s;\n  transition: opacity 0.3s;\n  opacity: 0.7;\n  cursor: pointer;\n}\napp-burger.left-sidebar-in > div {\n  height: 100vh;\n  padding-right: 50px;\n}\napp-burger.left-sidebar-in .icon-menu {\n  display: none;\n}\napp-burger.left-sidebar-in .icon-close {\n  display: block;\n}\n\n\@media screen and (max-width: 768px) {\n  app-burger {\n    display: block;\n  }\n}"; }
}

class AppMarked {
    constructor() {
        this.docsContent = {};
    }
    componentWillLoad() {
        return this.fetchNewContent(this.fetchPath);
    }
    fetchNewContent(docPath, oldDocPath) {
        if (docPath == null || docPath === oldDocPath) {
            return;
        }
        return fetchContent(this.fetchPath).then(data => {
            if (data != null) {
                this.docsContent = data;
            }
        });
    }
    render() {
        return this.renderer ? this.renderer(this.docsContent) : null;
    }
    static get is() { return "app-marked"; }
    static get properties() { return {
        "docsContent": {
            "state": true
        },
        "fetchPath": {
            "type": String,
            "attr": "fetch-path",
            "watchCallbacks": ["fetchNewContent"]
        },
        "renderer": {
            "type": "Any",
            "attr": "renderer"
        }
    }; }
    static get style() { return "app-marked {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  -ms-flex: 1;\n  flex: 1;\n  min-width: 0;\n  width: 100%;\n  padding-top: 86px;\n  padding-bottom: 32px;\n}\n\n/**\n* xonokai theme for JavaScript, CSS and HTML\n* based on: https://github.com/MoOx/sass-prism-theme-base by Maxime Thirouin ~ MoOx --> http://moox.fr/ , which is Loosely based on Monokai textmate theme by http://www.monokai.nl/\n* license: MIT; http://moox.mit-license.org/\n*/\ncode[class*=language-],\npre[class*=language-] {\n  -moz-tab-size: 2;\n  -o-tab-size: 2;\n  tab-size: 2;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none;\n  white-space: normal;\n  word-wrap: normal;\n  font-size: 14px;\n  line-height: 20px;\n  color: #e4e4e4;\n  text-shadow: none;\n}\n\npre[class*=language-],\n:not(pre) > code[class*=language-] {\n  background: #212431;\n}\n\npre[class*=language-] {\n  border-radius: 4px;\n  border: none;\n  overflow: auto;\n  position: relative;\n}\n\npre[class*=language-] code {\n  white-space: pre;\n  display: block;\n  margin: 22px 24px !important;\n  display: block;\n}\n\n:not(pre) > code[class*=language-] {\n  padding: 0.15em 0.2em 0.05em;\n  border-radius: 0.3em;\n  border: 0.13em solid #7a6652;\n  -webkit-box-shadow: 1px 1px 0.3em -0.1em #000 inset;\n  box-shadow: 1px 1px 0.3em -0.1em #000 inset;\n}\n\n/* Line highlight plugin */\npre[class*=language-] {\n  position: relative;\n}\n\npre .line-highlight {\n  position: absolute;\n  left: 0;\n  right: 0;\n  padding: 0 0 0 22px;\n  background: rgba(86, 90, 101, 0.4);\n}\n\n.token.comment {\n  color: #5c6370;\n  font-style: italic;\n}\n\n.token.function {\n  color: #61aeee;\n}\n\n.token.class-name,\n.token.builtin {\n  color: #e6c07b;\n}\n\n.token.namespace {\n  opacity: 0.7;\n}\n\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: #6f705e;\n}\n\n.token.boolean,\n.token.number {\n  color: #a77afe;\n}\n\n.token.string {\n  color: #98c379;\n}\n\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #e6d06c;\n}\n\n.token.selector,\n.token.inserted {\n  color: #a6e22d;\n}\n\n.token.atrule,\n.token.keyword,\n.token.important,\n.token.deleted {\n  color: #c678dd;\n}\n\n.token.regex,\n.token.statement {\n  color: #76d9e6;\n}\n\n.token.placeholder,\n.token.variable {\n  color: #fff;\n}\n\n.token.important,\n.token.statement,\n.token.bold {\n  font-weight: bold;\n}\n\n.token.operator,\n.token.punctuation {\n  color: #bebec5;\n}\n\n.token.entity {\n  cursor: help;\n}\n\n.token.italic {\n  font-style: italic;\n}\n\ncode.language-markup {\n  color: #f9f9f9;\n}\n\ncode.language-markup .token.tag,\n.token.tag {\n  color: #da5686;\n}\n\ncode.language-markup .token.attr-name,\n.token.attr-name {\n  color: #98c379;\n}\n\ncode.language-markup .token.attr-value,\n.token.attr-value {\n  color: #e6d06c;\n}\n\ncode.language-markup .token.style,\ncode.language-markup .token.script {\n  color: #76d9e6;\n}\n\ncode.language-markup .token.script .token.keyword {\n  color: #76d9e6;\n}"; }
}
const localCache = new Map();
function fetchContent(path) {
    let promise = localCache.get(path);
    if (!promise) {
        promise = fetch(path, { cache: 'force-cache' }).then(response => response.json());
        localCache.set(path, promise);
    }
    return promise;
}

class Enterprise {
    componentDidLoad() {
        const hbsScript = document.createElement('script');
        hbsScript.src = '//js.hsforms.net/forms/v2.js';
        hbsScript.type = 'text/javascript';
        hbsScript.charset = 'utf-8';
        hbsScript.addEventListener('load', () => {
            window.hbspt.forms.create({
                portalId: '3776657',
                formId: 'd0019a78-110e-4d28-b356-56357b4abe4b',
                target: '#scripts',
                css: ''
            });
        });
        document.body.appendChild(hbsScript);
        // el.appendChild(hbsScript);
    }
    render() {
        return (h("div", { class: "enterprise" },
            h("div", { class: "cta" },
                h("div", { class: "container" },
                    h("h1", null, "Capacitor for Enterprises"),
                    h("p", null,
                        "Powerful solution for mission-critical enterprise apps",
                        h("br", null),
                        "across consumer and employee-facing",
                        h("br", null),
                        "iOS, Android, and Progressive Web Apps."),
                    h("a", { href: "#contact", class: "btn" }, "Learn more"))),
            h("section", { class: "section" },
                h("div", { class: "container" },
                    h("hgroup", null,
                        h("h2", null, "Enterprise mobile development, made easy"),
                        h("p", null, "Meet your development goals with premium software and services that accelerate development and reduce project risk.")),
                    h("div", { class: "points" },
                        h("div", { class: "point" },
                            h("svg", { class: "box", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 64 64" },
                                h("defs", null),
                                h("path", { fill: "#B2BECD", d: "M23.77 34.8H5.5A5.48 5.48 0 000 40.26v18.25A5.48 5.48 0 005.49 64h18.28a5.48 5.48 0 005.49-5.48V40.27a5.48 5.48 0 00-5.49-5.48z", opacity: ".8" }),
                                h("path", { fill: "#FFEDBA", d: "M47.54 44.83v-7.3a2.74 2.74 0 00-2.74-2.74h-7.31a2.74 2.74 0 00-2.75 2.74v7.3a2.74 2.74 0 002.75 2.74h7.31a2.74 2.74 0 002.74-2.74z" }),
                                h("path", { fill: "#FED352", d: "M61.26 34.8h-7.32a2.75 2.75 0 00-2.74 2.73v11.7a2 2 0 01-2 2H37.49a2.75 2.75 0 00-2.75 2.73v7.3A2.74 2.74 0 0037.5 64h23.77A2.75 2.75 0 0064 61.26V37.53a2.74 2.74 0 00-2.74-2.74z" }),
                                h("path", { fill: "#21426B", d: "M64 23.84V5.59A5.48 5.48 0 0058.51.1H40.23a5.48 5.48 0 00-5.49 5.48v18.25a5.48 5.48 0 005.49 5.48H58.5A5.48 5.48 0 0064 23.84z" }),
                                h("path", { fill: "#92A1B3", d: "M9.14 55.79a1.37 1.37 0 01-1.37-1.37v-4.34a1.37 1.37 0 012.74 0v4.34a1.37 1.37 0 01-1.37 1.37z" }),
                                h("path", { fill: "#5B708B", d: "M19.2 44.83a1.37 1.37 0 01-1.37-1.37V32.51a1.37 1.37 0 012.34-.97c.26.26.4.6.4.97v10.95a1.37 1.37 0 01-1.37 1.37z" }),
                                h("path", { fill: "#2D4665", d: "M24.1 4.35L20.12.4a1.37 1.37 0 00-1.94 0l-3.96 3.95a1.37 1.37 0 001.94 1.94l1.66-1.65v22.4a1.37 1.37 0 002.74 0V4.7l1.58 1.58a1.37 1.37 0 001.94-1.94z" }),
                                h("path", { fill: "#5B708B", d: "M14.03 16.22l-3.96-3.95a1.37 1.37 0 00-1.93 0l-3.96 3.95a1.37 1.37 0 001.93 1.94l1.66-1.66V45.3a1.37 1.37 0 002.34.97c.26-.26.4-.6.4-.97V16.58l1.59 1.58a1.37 1.37 0 001.93-1.94z" })),
                            h("h3", null, "Build with confidence"),
                            h("p", null, "Enjoy peace of mind knowing the native plugins you depend on are built and maintained by a team you can trust, and backed by mission-critical support and expert services.")),
                        h("div", { class: "point" },
                            h("svg", { class: "box", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 78 65" },
                                h("defs", null),
                                h("path", { fill: "url(#paint0_radial)", d: "M50.61 12.85c-.5 0-.98-.19-1.35-.53a31.34 31.34 0 00-42.53 0 2 2 0 01-2.7-2.96 35.34 35.34 0 0147.93 0 2 2 0 01-1.35 3.48z" }),
                                h("path", { fill: "url(#paint1_radial)", d: "M54 25.91a2 2 0 01-1.66-.88 29.03 29.03 0 00-48.68 0A2 2 0 01.34 22.8a33.04 33.04 0 0155.32 0A2 2 0 0154 25.9z" }),
                                h("path", { fill: "url(#paint2_radial)", d: "M21.68 64a2 2 0 01-1.42-.6c-.43-.43-10.68-10.9-10.68-20.97 0-10.45 8.26-18.95 18.42-18.95 10.16 0 18.42 8.5 18.42 18.95a2 2 0 11-4 0c0-8.24-6.47-14.95-14.42-14.95-7.96 0-14.43 6.7-14.43 14.95 0 8.45 9.43 18.06 9.53 18.16a2 2 0 01-1.42 3.4z" }),
                                h("path", { fill: "url(#paint3_radial)", d: "M34.32 64c-4.81 0-15.96-9.15-17.04-19.34a12.93 12.93 0 013.06-9.86 10.2 10.2 0 017.6-3.5H28a10.65 10.65 0 017.55 3.14 11.18 11.18 0 013.3 8v1.3a5.58 5.58 0 1011.15 0v-.46c0-12.45-9.02-22.81-20.54-23.58a21.41 21.41 0 00-16.2 5.82 23.36 23.36 0 00-2.22 31.43 2 2 0 01-3.13 2.5 27.37 27.37 0 012.6-36.85 25.37 25.37 0 0119.22-6.89C43.33 16.61 54 28.73 54 43.28v.45a9.58 9.58 0 11-19.16 0v-1.3a7.21 7.21 0 00-4.28-6.61A6.66 6.66 0 0028 35.3h-.04a6.18 6.18 0 00-4.65 2.16 8.87 8.87 0 00-2.07 6.77C22.13 52.55 31.68 60 34.31 60a2 2 0 010 4z" }),
                                h("path", { fill: "url(#paint4_radial)", d: "M41.74 60.09c-7.16 0-15.9-8.75-15.9-18.96a2 2 0 114 0c0 7.91 6.66 14.96 11.9 14.96a2 2 0 010 4z" }),
                                h("circle", { cx: "60", cy: "47", r: "16", fill: "#2D4665", stroke: "#fff", "stroke-width": "4" }),
                                h("path", { fill: "#DEE3EA", d: "M59.93 38.97a4.22 4.22 0 00-3.88 2.57c-.21.5-.32 1.04-.32 1.59v.7a1.41 1.41 0 00-1.4 1.38v6.94a1.4 1.4 0 001.4 1.4h8.4a1.42 1.42 0 001.4-1.4v-6.94a1.4 1.4 0 00-1.4-1.39v-.69a4.13 4.13 0 00-2.6-3.85 4.22 4.22 0 00-1.6-.31zm0 1.38a2.76 2.76 0 012.6 1.7c.14.35.2.71.2 1.08v.7h-5.6v-.7a2.7 2.7 0 011.72-2.58c.34-.14.7-.2 1.08-.2zm-4.2 4.86h8.4v6.94h-8.4v-6.94zm4.2 2.08a1.4 1.4 0 00-1.3.86 1.38 1.38 0 001.03 1.9 1.41 1.41 0 001.43-.6 1.38 1.38 0 00-.17-1.75 1.4 1.4 0 00-1-.4z" }),
                                h("defs", null,
                                    h("radialGradient", { id: "paint0_radial", cx: "0", cy: "0", r: "1", gradientTransform: "matrix(0 28.9994 -28.2768 0 28 35)", gradientUnits: "userSpaceOnUse" },
                                        h("stop", { offset: ".1", "stop-color": "#FED352" }),
                                        h("stop", { offset: ".94", "stop-color": "#FFE8A0" })),
                                    h("radialGradient", { id: "paint1_radial", cx: "0", cy: "0", r: "1", gradientTransform: "matrix(0 28.9994 -28.2768 0 28 35)", gradientUnits: "userSpaceOnUse" },
                                        h("stop", { offset: ".1", "stop-color": "#FED352" }),
                                        h("stop", { offset: ".94", "stop-color": "#FFE8A0" })),
                                    h("radialGradient", { id: "paint2_radial", cx: "0", cy: "0", r: "1", gradientTransform: "matrix(0 28.9994 -28.2768 0 28 35)", gradientUnits: "userSpaceOnUse" },
                                        h("stop", { offset: ".1", "stop-color": "#FED352" }),
                                        h("stop", { offset: ".94", "stop-color": "#FFE8A0" })),
                                    h("radialGradient", { id: "paint3_radial", cx: "0", cy: "0", r: "1", gradientTransform: "matrix(0 28.9994 -28.2768 0 28 35)", gradientUnits: "userSpaceOnUse" },
                                        h("stop", { offset: ".1", "stop-color": "#FED352" }),
                                        h("stop", { offset: ".94", "stop-color": "#FFE8A0" })),
                                    h("radialGradient", { id: "paint4_radial", cx: "0", cy: "0", r: "1", gradientTransform: "matrix(0 28.9994 -28.2768 0 28 35)", gradientUnits: "userSpaceOnUse" },
                                        h("stop", { offset: ".1", "stop-color": "#FED352" }),
                                        h("stop", { offset: ".94", "stop-color": "#FFE8A0" })))),
                            h("h3", null, "Protect your users & data"),
                            h("p", null, "Give your users the best possible mobile security, with advanced biometric authentication, SSO integration, and the latest in secure encrypted storage.")),
                        h("div", { class: "point" },
                            h("svg", { class: "box", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 68 68" },
                                h("defs", null),
                                h("path", { fill: "#FFF6DC", d: "M39.5 56C49.717 56 58 47.717 58 37.5S49.717 19 39.5 19 21 27.283 21 37.5 29.283 56 39.5 56z" }),
                                h("path", { fill: "#5B708B", d: "M51.5 31.2c-.398 0-.78-.164-1.06-.454A1.574 1.574 0 0150 29.65v-4.903c0-.41.158-.805.44-1.095.28-.29.662-.453 1.06-.453s.78.163 1.06.453c.282.29.44.684.44 1.095v4.904c0 .41-.158.804-.44 1.094-.28.29-.662.454-1.06.454z" }),
                                h("path", { fill: "#2D4665", d: "M56.604 4.529L52.505.417a1.417 1.417 0 00-2.007 0l-4.1 4.112a1.426 1.426 0 001.01 2.413c.372.003.73-.14.998-.4l1.715-1.72v14.754c0 .377.15.74.416 1.007a1.418 1.418 0 002.424-1.007V4.902l1.633 1.638A1.417 1.417 0 0057 5.527a1.426 1.426 0 00-.399-1.001l.003.003z" }),
                                h("path", { fill: "#FED352", d: "M48.833 41H37.167c-.31 0-.607-.126-.825-.35a1.215 1.215 0 01-.342-.848V24.198c0-.318.123-.622.342-.847.218-.225.515-.351.825-.351.31 0 .606.126.825.35.218.226.341.53.341.848v14.407h10.5c.31 0 .607.126.825.35.22.225.342.53.342.848 0 .317-.123.622-.342.847-.218.224-.515.35-.825.35z" }),
                                h("path", { fill: "#FED352", d: "M67.598 14.164l-4.126-4.123a1.43 1.43 0 00-2.021 0l-4.127 4.123a1.427 1.427 0 002.021 2.02l1.727-1.725v23.107c0 3.728-.963 7.394-2.796 10.642a21.665 21.665 0 01-7.668 7.896 21.69 21.69 0 01-29.42-6.786 21.645 21.645 0 015.91-29.584 1.428 1.428 0 00-1.621-2.35 24.494 24.494 0 00-6.76 33.373 24.523 24.523 0 009.117 8.428 24.547 24.547 0 0032.777-9.317 24.494 24.494 0 003.31-11.962c0-.029.01-.056.01-.086V14.538l1.647 1.643A1.43 1.43 0 0068 15.166a1.428 1.428 0 00-.401-1.005v.003z" }),
                                h("path", { fill: "#21426B", stroke: "#fff", "stroke-width": "4", d: "M21.073 40H8.927A6.927 6.927 0 002 46.927v12.146A6.927 6.927 0 008.927 66h12.146A6.927 6.927 0 0028 59.073V46.927A6.927 6.927 0 0021.073 40z" }),
                                h("path", { fill: "#DEE3EA", d: "M19.957 51.957h-3.914v-3.914a1.043 1.043 0 10-2.086 0v3.914h-3.914a1.043 1.043 0 100 2.086h3.914v3.914a1.043 1.043 0 102.086 0v-3.914h3.914a1.043 1.043 0 100-2.086z" })),
                            h("h3", null, "Accelerate your mobile projects"),
                            h("p", null, "Save valuable time and effort that would normally be spent chasing plugins and building from scratch. Capacitor Enterprise delivers everything you need on Day 1."))))),
            h("section", { id: "highlights" },
                h("div", { class: "container" },
                    h("div", { class: "highlight" },
                        h("h2", null, "World-class support"),
                        h("p", null, "Get guaranteed response SLAs through the app lifecycle. Ionic's professional support team is on-hand to help you troubleshoot and address issues occurring at the native layer.")),
                    h("div", { class: "highlight" },
                        h("h2", null, "Stable, secure plugin library"),
                        h("p", null, "Native features maintained by our team of native experts. Active subscribers get ongoing updates to supported plugins, to keep pace with OS and API changes, and evolving devices.")),
                    h("div", { class: "highlight" },
                        h("h2", null, "Pre-built solutions"),
                        h("p", null, "Accelerate development with pre-built native solutions to common mobile use cases, like biometrics, authentication, and encrypted offline storage. Built by mobile experts. Deployed in minutes.")),
                    h("div", { class: "highlight" },
                        h("h2", null, "Expert help & guidance"),
                        h("p", null, "Our team of native experts will work with you to define a native strategy that fits your unique goals and challenges. From architectural reviews to performance & security audits.")))),
            h("section", { id: "key-features" },
                h("div", { class: "container" },
                    h("hgroup", null,
                        h("h2", null, "Key features"),
                        h("p", null, "Premium software and services to help you reach your development goals")),
                    h("div", { class: "points" },
                        h("div", { class: "point" },
                            h("h3", null, "Core Device Plugins"),
                            h("p", null, "Everything you need to deliver the core functionality your users expect, from essentials like camera and geolocation, to payments and security.")),
                        h("div", { class: "point" },
                            h("h3", null, "Biometrics Sign-in"),
                            h("p", null, "Add a critical layer of protection width advanced biometrics that locks down sensitive data, by employing the latest in native security best practices.")),
                        h("div", { class: "point" },
                            h("h3", null, "Auth Integration"),
                            h("p", null, "Easily connect through existing authentication providers, including Auth0, Azure Active Directory, and AWS Cognito--from any mobile device.")),
                        h("div", { class: "point" },
                            h("h3", null, "Secure Offline Storage"),
                            h("p", null, "Deliver secure, offline-first mobile experiences with a flexible mobile storage solution that uses military-grade encryption to prevent unwanted access and secure user data.")),
                        h("div", { class: "point" },
                            h("h3", null, "Guaranteed SLA"),
                            h("p", null, "Timely support and troubleshooting when you need it most. Get expert help directly from our team with guaranteed response times.")),
                        h("div", { class: "point" },
                            h("h3", null, "Guidance & Expertise"),
                            h("p", null, "Ensure your team is utilizing best practices when adding native functionality, helping you meet your deadlines while avoiding costly tech debt."))))),
            h("section", null,
                h("div", { class: "container" },
                    h("hgroup", null,
                        h("h2", null, "Use Cases")),
                    h("div", null,
                        h("h3", null, "Mission-critical projects"),
                        h("p", null, "When your brand and company reputation are on the line, you need a solution that will work on Day 1. Capacitor Enterprise is a great fit for teams building mission-critical projects who want to minimize project risk and reach their goals.")),
                    h("div", null,
                        h("h3", null, "Highly secure apps"),
                        h("p", null, "Handling sensitive user or company data? Protect what matters most with advanced mobile security solutions that take advantage of the latest in native security best practices--from biometrics to military-grade encryption.")),
                    h("div", null,
                        h("h3", null, "Accelerated timeline"),
                        h("p", null, "Facing an aggressive release timeline? We can help. Our pre-built solutions will save you weeks or months of coding from scratch, while our native mobile experts can help you find ways to speed up development and better reach your goals.")))),
            h("section", { id: "contact" },
                h("div", { class: "container" },
                    h("hgroup", null,
                        h("h2", null, "Learn more"),
                        h("p", null, "Fill out form below to receive more information on Capacitor Enterprise."))),
                h("div", { id: "scripts", class: "hubspot-override" }))));
    }
    static get is() { return "capacitor-enterprise"; }
    static get style() { return ":root {\n  --color-woodsmoke: #16161D;\n  --color-dolphin: #626177;\n  --color-gunpowder: #505061;\n  --color-manatee: #8888A2;\n  --color-cadet-blue: #abb2bf;\n  --color-whisper: #EBEBF7;\n  --color-selago: #F4F4FD;\n  --color-white-lilac: #f8f8fc;\n  --color-white: #fff;\n  --color-green-haze: #00AB47;\n  --color-dodger-blue: #1d9aff;\n  --color-dodger-blue-hover: rgba(#1d9aff, 0.2);\n  --color-old-lace: #fdf5e4;\n  --color-wheatfield: #F1E3C5;\n  --color-pirate-gold: #9A6400;\n  --button-shadow: 0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);\n  --button-shadow-hover: 0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);\n  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\ncapacitor-enterprise {\n  display: block;\n  margin: 76px 0;\n}\ncapacitor-enterprise .cta {\n  position: relative;\n  text-align: center;\n  background: #f0f0f0;\n  padding: 128px 0;\n}\ncapacitor-enterprise .cta h1 {\n  margin-top: 0;\n  color: #222;\n}\ncapacitor-enterprise .cta svg {\n  position: absolute;\n  top: 0;\n  left: calc((1800px - 100%)/ 2 * -1);\n  height: 100%;\n  z-index: -1;\n}\ncapacitor-enterprise .cta .btn {\n  margin-top: 24px;\n  background-color: #111;\n  color: white;\n}\ncapacitor-enterprise .container {\n  max-width: 1024px;\n  margin: auto;\n}\ncapacitor-enterprise .points {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  -webkit-column-gap: 16px;\n  column-gap: 16px;\n  row-gap: 24px;\n  margin-top: 48px;\n}\n\@media (max-width: 480px) {\n  capacitor-enterprise .points {\n    grid-template-columns: 1fr;\n  }\n}\ncapacitor-enterprise .points .point h3 {\n  margin-top: 0;\n}\ncapacitor-enterprise .points .point svg {\n  max-height: 48px;\n  margin-bottom: 32px;\n}\ncapacitor-enterprise hgroup {\n  text-align: center;\n}\ncapacitor-enterprise .hs-form {\n  margin: 48px auto;\n  max-width: 420px !important;\n  font-weight: 400;\n}\ncapacitor-enterprise .hs-form .hs-form-required {\n  display: none;\n}\ncapacitor-enterprise .hs-form form fieldset.form-columns-2 .input {\n  margin-right: 12px;\n}\ncapacitor-enterprise .hs-form form.stacked .field {\n  margin-bottom: 4px;\n}\ncapacitor-enterprise .hs-form .hs-input,\ncapacitor-enterprise .hs-form input.hs-input,\ncapacitor-enterprise .hs-form select.hs-input {\n  -webkit-appearance: none;\n  appearance: none;\n  -moz-appearance: none;\n  border: 1px solid #e1e5ed;\n  font-weight: 500;\n  border-radius: 4px;\n  -webkit-transition: border-color 0.2s;\n  transition: border-color 0.2s;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  outline: none;\n  height: 30px;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.428571429;\n}\ncapacitor-enterprise .hs-form .hs-input:placeholder,\ncapacitor-enterprise .hs-form input.hs-input:placeholder,\ncapacitor-enterprise .hs-form select.hs-input:placeholder {\n  color: #aaa;\n}\ncapacitor-enterprise .hs-form .hs-input:hover, capacitor-enterprise .hs-form .hs-input:focus, capacitor-enterprise .hs-form .hs-input:active,\ncapacitor-enterprise .hs-form input.hs-input:hover,\ncapacitor-enterprise .hs-form input.hs-input:focus,\ncapacitor-enterprise .hs-form input.hs-input:active,\ncapacitor-enterprise .hs-form select.hs-input:hover,\ncapacitor-enterprise .hs-form select.hs-input:focus,\ncapacitor-enterprise .hs-form select.hs-input:active {\n  outline: none;\n  border-color: #3880ff;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\ncapacitor-enterprise .hs-form .hs-input.hs-input.error,\ncapacitor-enterprise .hs-form input.hs-input.hs-input.error,\ncapacitor-enterprise .hs-form select.hs-input.hs-input.error {\n  border-color: #ee0000;\n}\ncapacitor-enterprise .hs-form select.hs-input {\n  height: 44px;\n  width: calc(100% + 6px) !important;\n}\ncapacitor-enterprise .hs-form textarea.hs-input {\n  padding: 12px;\n  width: calc(100% + 3px) !important;\n  min-height: 192px;\n}\ncapacitor-enterprise .hs-form .hs_submit input.hs-button {\n  font-size: 13px;\n  padding: 10px 18px 10px;\n  margin-right: -14px;\n  margin-top: -36px;\n  line-height: 23px;\n  float: right;\n  font-weight: 600;\n  letter-spacing: 0;\n  text-transform: none;\n  text-shadow: none;\n  background: #3880ff;\n  border: 0;\n  outline: 0;\n  -webkit-transition: all 0.2s linear;\n  transition: all 0.2s linear;\n  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);\n}\ncapacitor-enterprise .hs-form .hs_submit input.hs-button:hover {\n  border: 0;\n  -webkit-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);\n  background: #5995fc;\n  color: #fff;\n  outline: 0;\n}\ncapacitor-enterprise .hs-form .hs_submit input.hs-button:active, capacitor-enterprise .hs-form .hs_submit input.hs-button:active:not(.inactive):not(.link), capacitor-enterprise .hs-form .hs_submit input.hs-button:focus:not(.inactive) {\n  border: 0;\n  color: #fff;\n  -webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.2);\n  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.2);\n  background: #5995fc;\n  outline: 0;\n}\ncapacitor-enterprise .hs-form .submitted-message {\n  font-size: 18px;\n  padding: 34px 0 78px;\n  text-align: center;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-align: center;\n  align-items: center;\n  font-weight: 400;\n  color: #35af55;\n  max-width: 410px;\n  background-color: white;\n  margin: 0 auto;\n}\ncapacitor-enterprise .hs-form .submitted-message:before {\n  content: \"\";\n  display: block;\n  background-image: url(\"/img/checkmark-light-green.svg\");\n  background-repeat: no-repeat;\n  background-size: 100%;\n  width: 42px;\n  height: 42px;\n  margin-bottom: 12px;\n}\ncapacitor-enterprise .modal .hs-form .hs_submit input.hs-button {\n  padding: 0;\n}\ncapacitor-enterprise .hs-form, capacitor-enterprise .hs-form fieldset, capacitor-enterprise .hs-form iframe {\n  max-width: 100%;\n}\ncapacitor-enterprise .hs-form .hs-form-field {\n  margin-top: 16px;\n}\ncapacitor-enterprise .hs-form label {\n  margin-bottom: 3px;\n}\ncapacitor-enterprise .hs-form .hs-form-required {\n  display: inline;\n  color: #F45454;\n  margin-left: 4px;\n}\ncapacitor-enterprise .hs-form .hs-richtext {\n  margin-top: 8px;\n}\ncapacitor-enterprise .hs-form .hs-input,\ncapacitor-enterprise .hs-form input.hs-input {\n  -webkit-transition: border 0.3s;\n  transition: border 0.3s;\n  font-weight: 500;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ced6e3;\n  line-height: 1.39286;\n  border-radius: 4px;\n  padding: 11px 15px;\n  font-size: 15px;\n  margin-bottom: 0;\n  color: #505863;\n}\ncapacitor-enterprise .hs-form input.hs-input[type=number] {\n  float: none;\n}\ncapacitor-enterprise .hs-form input.hs-input[type=text],\ncapacitor-enterprise .hs-form input.hs-input[type=email],\ncapacitor-enterprise .hs-form input.hs-input[type=tel] {\n  height: auto;\n  width: 100%;\n  float: none;\n}\ncapacitor-enterprise .hs-form input.hs-input[type=text]:focus,\ncapacitor-enterprise .hs-form input.hs-input[type=email]:focus,\ncapacitor-enterprise .hs-form input.hs-input[type=tel]:focus {\n  border-color: #629eff;\n}\ncapacitor-enterprise .hs-form input.hs-input[type=radio],\ncapacitor-enterprise .hs-form input.hs-input[type=checkbox] {\n  height: auto;\n  margin-right: 8px;\n}\ncapacitor-enterprise .hs-form .hs-form-booleancheckbox-display {\n  display: -ms-flexbox;\n  display: flex;\n}\ncapacitor-enterprise .hs-form select.hs-input {\n  height: 44px;\n  -webkit-appearance: none;\n  appearance: none;\n  -moz-appearance: none;\n  background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%);\n  background-position: calc(100% - 20px) 50%, calc(100% - 15px) 50%;\n  background-size: 5px 5px, 5px 5px, 1px 1.5em;\n  background-repeat: no-repeat;\n}\ncapacitor-enterprise .hs-form form fieldset.form-columns-2 .input {\n  margin: 0;\n}\ncapacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field {\n  padding: 0 10px;\n}\ncapacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field:first-child {\n  padding-left: 0;\n}\ncapacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field:last-child {\n  padding-right: 0;\n}\ncapacitor-enterprise .hs-form .inputs-list,\ncapacitor-enterprise .hs-form .hs-error-msgs {\n  margin: 0;\n  padding: 0;\n  list-style-type: none;\n}\ncapacitor-enterprise .hs-form .inputs-list.multi-container {\n  overflow: hidden;\n}\ncapacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child,\ncapacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child ~ li {\n  width: 50%;\n  float: left;\n  padding-right: 11px;\n}\ncapacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child ~ li:nth-child(even) {\n  padding-right: 0;\n  padding-left: 11px;\n}\ncapacitor-enterprise .hs-form .hs-form-checkbox-display {\n  margin-top: 4px;\n  display: -ms-flexbox;\n  display: flex;\n}\ncapacitor-enterprise .hs-form .hs-form-checkbox-display .hs-input[type=checkbox] {\n  margin-right: 10px;\n}\ncapacitor-enterprise .hs-form .hs-form-checkbox-display span {\n  font-size: 15px;\n  color: #505863;\n}\ncapacitor-enterprise .hs-form .hs-error-msgs {\n  padding: 5px 0 0;\n  font-size: 11px;\n  color: #F45454;\n}\ncapacitor-enterprise .hs-form .hs_submit {\n  margin-top: 30px;\n}\ncapacitor-enterprise .hs-form .hs_submit input.hs-button {\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n  margin: 0;\n  float: none;\n  font-size: 16px;\n  font-weight: 700;\n  padding: 12px 20px;\n  vertical-align: middle;\n  color: white;\n  background: #3880ff;\n  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12);\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12);\n  border-radius: 4px;\n  line-height: 18px;\n  letter-spacing: -0.01em;\n}\ncapacitor-enterprise .hs-form .hs_submit input.hs-button:hover {\n  -webkit-box-shadow: 0 7px 14px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08);\n  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08);\n  background: #4d8dfd;\n  color: #fff;\n  outline: none;\n}\n\@media (max-width: 480px) {\n  capacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field {\n    width: 100%;\n    float: none;\n    padding: 0;\n  }\n  capacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field + .hs-form-field {\n    margin-top: 24px;\n  }\n  capacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child,\ncapacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child ~ li {\n    width: 100%;\n    float: none;\n    padding-right: 0;\n  }\n  capacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child ~ li:nth-child(even) {\n    padding-left: 0;\n  }\n  capacitor-enterprise .hs-form .hs_submit input.hs-button {\n    width: 100%;\n  }\n}\ncapacitor-enterprise .hubspot-override--large .hs-form label:not(.hs-form-booleancheckbox-display) {\n  text-transform: uppercase;\n  font-size: 12px;\n  letter-spacing: 0.05em;\n  margin-bottom: 6px;\n}\ncapacitor-enterprise .hubspot-override--large .hs-form .hs-form-booleancheckbox-display {\n  font-size: 15px;\n}\ncapacitor-enterprise .hubspot-override--large .hs-form .hs-richtext p span,\ncapacitor-enterprise .hubspot-override--large .hs-form .hs-richtext p a {\n  font-size: 15px;\n}\ncapacitor-enterprise .hubspot-override--large .hs-form .hs-input,\ncapacitor-enterprise .hubspot-override--large .hs-form input.hs-input {\n  padding: 16px 20px 18px;\n  font-size: 18px;\n}\ncapacitor-enterprise .hubspot-override--large .hs-form select.hs-input {\n  text-indent: 10px;\n  height: 60px;\n}\n\@-moz-document url-prefix() {\n  capacitor-enterprise .hubspot-override--large .hs-form select.hs-input {\n    text-indent: 0;\n  }\n}\ncapacitor-enterprise .hubspot-override--large .hs-form .hs-error-msgs label {\n  font-size: 11px;\n  letter-spacing: 0;\n  text-transform: none;\n}\ncapacitor-enterprise .hubspot-override--large .hs-form fieldset.form-columns-2 .hs-form-field {\n  padding: 0 20px;\n}\ncapacitor-enterprise .hubspot-override--large .hs-form .hs_submit {\n  text-align: center;\n  padding-top: 18px;\n}\ncapacitor-enterprise .hubspot-override--large .hs-form .hs_submit input.hs-button {\n  padding: 22px 27px 24px;\n  border-radius: 6px;\n}\n\@media (max-width: 480px) {\n  capacitor-enterprise .hubspot-override--large .hs-form fieldset.form-columns-2 .hs-form-field {\n    padding: 0;\n  }\n}\ncapacitor-enterprise .hubspot-override--measure {\n  max-width: 748px;\n  margin-left: auto;\n  margin-right: auto;\n}"; }
}

class App {
    constructor() {
        this.history = null;
        this.elements = [
            'site-header',
            'site-menu',
            'app-burger',
            '.root'
        ];
        this.isLandingPage = false;
        this.setHistory = ({ history }) => {
            if (!this.history) {
                this.history = history;
                this.history.listen((location) => {
                    window.gtag('config', 'UA-44023830-42', { 'page_path': location.pathname + location.search });
                });
            }
        };
    }
    handleResize() {
        requestAnimationFrame(() => {
            if (window.innerWidth > 768 && this.isLeftSidebarIn) {
                this.isLeftSidebarIn = false;
                document.body.classList.remove('no-scroll');
                this.elements.forEach((el) => {
                    this.el.querySelector(el).classList.remove('left-sidebar-in');
                });
            }
        });
    }
    handleToggle() {
        if (window.innerWidth <= 768)
            this.toggleLeftSidebar();
    }
    componentDidLoad() {
        this.isLeftSidebarIn = false;
    }
    toggleLeftSidebar() {
        if (this.isLeftSidebarIn) {
            this.isLeftSidebarIn = false;
            document.body.classList.remove('no-scroll');
            this.elements.forEach((el) => {
                this.el.querySelector(el).classList.remove('left-sidebar-in');
                this.el.querySelector(el).classList.add('left-sidebar-out');
            });
        }
        else {
            this.isLeftSidebarIn = true;
            document.body.classList.add('no-scroll');
            this.elements.forEach((el) => {
                this.el.querySelector(el).classList.add('left-sidebar-in');
                this.el.querySelector(el).classList.remove('left-sidebar-out');
            });
        }
    }
    hostData() {
        return {
            class: {
                'landing-page': this.isLandingPage
            }
        };
    }
    render() {
        const siteState = {
            isLeftSidebarIn: this.isLeftSidebarIn,
            toggleLeftSidebar: this.toggleLeftSidebar
        };
        const footerClass = this.isLandingPage ? 'footer-landing' : '';
        return (h(SiteProviderConsumer.Provider, { state: siteState },
            h("div", { id: "main-div" },
                h("site-header", null),
                h("div", { class: "app root" },
                    h("stencil-router", { scrollTopOffset: 0 },
                        h("stencil-route", { style: { display: 'none' }, routeRender: this.setHistory }),
                        h("stencil-route-switch", { scrollTopOffset: 0 },
                            h("stencil-route", { url: "/", component: "landing-page", exact: true }),
                            h("stencil-route", { url: "/docs/", exact: true, routeRender: () => (h("document-component", { page: '/docs/' })) }),
                            h("stencil-route", { url: "/enterprise/", exact: true, routeRender: () => (h("capacitor-enterprise", null)) }),
                            h("stencil-route", { url: "/docs/:pageName*", routeRender: ({ match }) => (h("document-component", { page: match.url })) }))))),
            h("footer", { class: footerClass },
                h("div", { class: "container" },
                    h("div", { id: "open-source" },
                        h("a", { href: "http://ionicframework.com/", title: "IonicFramework.com", rel: "noopener" },
                            h("div", { class: "ionic-oss-logo" })),
                        h("p", null,
                            "Released under ",
                            h("span", { id: "mit" }, "MIT License"),
                            " | Copyright @ ",
                            (new Date()).getFullYear(),
                            " Drifty Co.")),
                    h("div", { id: "footer-icons" },
                        h("iframe", { title: "Github Star Count", class: "star-button", src: "https://ghbtns.com/github-btn.html?user=ionic-team&repo=capacitor&type=star&count=true", frameBorder: "0", scrolling: "0", width: "100px", height: "20px" }),
                        h("a", { class: "svg-button", id: "capacitor-twitter", href: "https://twitter.com/getcapacitor", target: "_blank", rel: "noopener", title: "Open the Capacitor account on twitter", style: { fill: 'white' } },
                            h("app-icon", { name: "twitter" })),
                        h("a", { class: "svg-button", id: "cap-forum", href: "https://getcapacitor.herokuapp.com/", target: "_blank", rel: "noopener", title: "Join the Capacitor slack" },
                            h("app-icon", { name: "slack" })))))));
    }
    static get is() { return "capacitor-site"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "isLandingPage": {
            "type": Boolean,
            "attr": "is-landing-page"
        },
        "isLeftSidebarIn": {
            "state": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "handleResize",
            "passive": true
        }, {
            "name": "burgerClick",
            "method": "handleToggle"
        }, {
            "name": "leftSidebarClick",
            "method": "handleToggle"
        }]; }
    static get style() { return ":root {\n  --color-woodsmoke: #16161D;\n  --color-dolphin: #626177;\n  --color-gunpowder: #505061;\n  --color-manatee: #8888A2;\n  --color-cadet-blue: #abb2bf;\n  --color-whisper: #EBEBF7;\n  --color-selago: #F4F4FD;\n  --color-white-lilac: #f8f8fc;\n  --color-white: #fff;\n  --color-green-haze: #00AB47;\n  --color-dodger-blue: #1d9aff;\n  --color-dodger-blue-hover: rgba(#1d9aff, 0.2);\n  --color-old-lace: #fdf5e4;\n  --color-wheatfield: #F1E3C5;\n  --color-pirate-gold: #9A6400;\n  --button-shadow: 0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);\n  --button-shadow-hover: 0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);\n  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\n\@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 400;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-Regular.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-Regular.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 400;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-Italic.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-Italic.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 500;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-Medium.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-Medium.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 500;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-MediumItalic.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-MediumItalic.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 600;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-SemiBold.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-SemiBold.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 600;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-SemiBoldItalic.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-SemiBoldItalic.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 700;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-Bold.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-Bold.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 700;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-BoldItalic.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-BoldItalic.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 800;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-ExtraBold.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-ExtraBold.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 800;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-ExtraBoldItalic.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-ExtraBoldItalic.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 900;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-Black.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-Black.woff\") format(\"woff\");\n}\n\@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 900;\n  unicode-range: U+000-5FF;\n  src: url(\"/assets/fonts/inter/Inter-BlackItalic.woff2\") format(\"woff2\"), url(\"/assets/fonts/inter/Inter-BlackItalic.woff\") format(\"woff\");\n}\n.push {\n  margin-top: 70px;\n}\n\n.push-sm {\n  margin-top: 36px;\n}\n\n.block {\n  display: block;\n}\n\n.pull-left {\n  float: left;\n}\n\n.pull-right {\n  float: right;\n}\n\n.no-scroll {\n  overflow: hidden;\n}\n\n.sticky {\n  position: -webkit-sticky;\n  position: sticky;\n  top: 100px;\n  max-height: calc(100vh - 100px);\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n\n.btn {\n  -webkit-transition: all 0.15s ease;\n  transition: all 0.15s ease;\n  text-decoration: none;\n  border: none;\n  outline: none;\n  font-size: 13px;\n  font-weight: 700;\n  text-transform: uppercase;\n  padding: 12px 14px;\n  border-radius: 4px;\n  letter-spacing: 0.04em;\n  -webkit-box-shadow: var(--button-shadow);\n  box-shadow: var(--button-shadow);\n  cursor: pointer;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n  align-items: center;\n}\n\n.btn a {\n  text-decoration: none;\n}\n\n.btn app-icon {\n  margin-right: 8px;\n  opacity: 0.8;\n}\n\n.btn:hover {\n  text-decoration: none;\n  -webkit-transform: translateY(1px);\n  transform: translateY(1px);\n  -webkit-box-shadow: var(--button-shadow-hover);\n  box-shadow: var(--button-shadow-hover);\n}\n\n.btn--primary {\n  background: var(--color-dodger-blue);\n  color: var(--color-white);\n}\n\n.btn--secondary {\n  background: var(--color-white);\n  color: var(--color-dodger-blue);\n}\n\n.btn--tertiary {\n  background: #F4F4FD;\n  color: var(--color-dodger-blue);\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n\n.btn--tertiary:hover {\n  background-color: #ececf9;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  -webkit-transform: none;\n  transform: none;\n}\n\n.btn--small {\n  letter-spacing: -0.02em;\n  text-transform: none;\n  font-size: 15px;\n  padding: 5px 12px 7px;\n  font-weight: 500;\n  border-radius: 8px;\n  min-height: 38px;\n}\n\n* {\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\ncapacitor-site {\n  min-height: 100%;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column;\n  flex-flow: column;\n}\n\n.no-scroll {\n  overflow: hidden;\n}\n\n.left-sidebar-in {\n  -webkit-animation-name: slideIn;\n  animation-name: slideIn;\n  -webkit-animation-duration: 0.7s;\n  animation-duration: 0.7s;\n  -webkit-animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);\n  animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n\n\@-webkit-keyframes slideIn {\n  from {\n    left: 0;\n  }\n  to {\n    left: calc(100vw - 56px);\n  }\n}\n\n\@keyframes slideIn {\n  from {\n    left: 0;\n  }\n  to {\n    left: calc(100vw - 56px);\n  }\n}\n.left-sidebar-out {\n  -webkit-animation-name: slideOut;\n  animation-name: slideOut;\n  -webkit-animation-duration: 0.7s;\n  animation-duration: 0.7s;\n  -webkit-animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);\n  animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n\n\@-webkit-keyframes slideOut {\n  from {\n    left: calc(100vw - 56px);\n  }\n  to {\n    left: 0;\n  }\n}\n\n\@keyframes slideOut {\n  from {\n    left: calc(100vw - 56px);\n  }\n  to {\n    left: 0;\n  }\n}\n.root {\n  position: relative;\n}\n\n.row {\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.col {\n  -ms-flex: 1;\n  flex: 1;\n}\n\n.container {\n  max-width: 1280px;\n  width: 100%;\n  margin: auto;\n  padding: 0 24px;\n}\n\n.container-flex {\n  display: -ms-flexbox;\n  display: flex;\n}\n\ndocument-component > div {\n  display: -ms-flexbox;\n  display: flex;\n}\n\ndoc-content .input-with-button {\n  display: -ms-flexbox;\n  display: flex;\n  height: 50px;\n  max-width: 460px;\n  -ms-flex: 1;\n  flex: 1;\n}\ndoc-content .input-with-button input {\n  -ms-flex: 1;\n  flex: 1;\n  height: 100%;\n}\ndoc-content .input-with-button button {\n  -ms-flex-positive: 0;\n  flex-grow: 0;\n  -ms-flex-negative: 1;\n  flex-shrink: 1;\n  margin: 0;\n  border: 0;\n  border-radius: 0px 3px 3px 0;\n  height: 100%;\n}\ndoc-content .input-with-button button:hover {\n  -webkit-transform: none;\n  transform: none;\n}\n\n.measure-lg {\n  max-width: 670px;\n}\n\n.app {\n  height: 100%;\n}\n\n#main-div {\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n}\n\n::selection {\n  background: #98d2ff;\n}\n\n::-moz-selection {\n  background: #98d2ff;\n}\n\nhtml, body {\n  font-family: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  width: 100%;\n  height: 100%;\n  padding: 0;\n  margin: 0;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n}\n\nbody {\n  background-color: #fff;\n}\n\nh1, h2, h3, h4 {\n  color: #16161d;\n  letter-spacing: 0px;\n  font-weight: 700;\n}\n\nh1 {\n  font-size: 32px;\n  letter-spacing: -0.02em;\n  font-weight: 700;\n}\n\nh2 {\n  font-size: 22px;\n  letter-spacing: -0.02em;\n  font-weight: 600;\n}\n\nh2, h3 {\n  margin-top: 64px;\n  margin-bottom: 8px;\n}\n\nh2 code {\n  font-weight: 600;\n  font-family: \"Roboto Mono\", \"Source Code Pro\", monospace;\n  font-size: 20px;\n  color: #16161D;\n  background: #ecf4fb;\n  margin-left: 6px;\n  padding: 4px 8px;\n  border-radius: 4px;\n}\n\nul li {\n  font-size: 14px;\n  margin-top: 16px;\n}\n\nol li {\n  color: #4a5568;\n  font-size: 15px;\n  line-height: 1.8em;\n  margin: 16px 0;\n}\n\np, ul {\n  color: #4a5568;\n  font-size: 15px;\n  line-height: 1.8em;\n  margin: 16px 0px;\n}\n\nstrong, b {\n  font-weight: 500;\n}\n\na {\n  -webkit-transition: border 0.3s;\n  transition: border 0.3s;\n  color: #1d9aff;\n  border-bottom: 1px solid transparent;\n}\na:hover {\n  border-bottom-color: rgba(29, 154, 255, 0.3);\n}\n\np a {\n  font-weight: 500;\n}\n\n.intro {\n  font-size: 18px;\n  margin-bottom: 24px;\n  letter-spacing: -0.01em;\n}\n\n.intro code {\n  font-size: 18px;\n}\n\nblockquote {\n  background: rgba(255, 250, 237, 0.8);\n  border-left: 4px solid #ffcc5f;\n  border-radius: 2px 4px 4px 2px;\n  color: #736545 !important;\n  font-size: 14px;\n  line-height: 1.8em;\n  margin: auto;\n  padding: 16px 20px;\n}\n\nstencil-route-link:hover {\n  cursor: pointer;\n}\n\nbutton {\n  -webkit-transition: all 0.15s ease;\n  transition: all 0.15s ease;\n  font-size: 17px;\n  font-weight: 600;\n  color: #FFFFFF;\n  letter-spacing: -0.5px;\n  text-align: center;\n  border: none;\n  padding: 16px 20px;\n  border-radius: 5px;\n  outline: none;\n  cursor: pointer;\n}\n\nbutton:hover {\n  -webkit-transform: translateY(-1px);\n  transform: translateY(-1px);\n}\n\n.wrapper {\n  line-height: 32px;\n  min-height: 100%;\n  padding-top: 100px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-wrap: nowrap;\n  flex-wrap: nowrap;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n  -ms-flex-line-pack: stretch;\n  align-content: stretch;\n  -ms-flex-align: start;\n  align-items: flex-start;\n}\n\n.nextButton {\n  background: #5851ff;\n  color: white;\n  text-decoration: none;\n  border: none;\n  font-size: 13px;\n  font-weight: 600;\n  text-transform: uppercase;\n  padding: 12px 14px;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);\n  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);\n  outline: none;\n  letter-spacing: 0.04em;\n  -webkit-transition: all 0.15s ease;\n  transition: all 0.15s ease;\n  cursor: pointer;\n  float: right;\n  margin-right: 5px;\n}\n.nextButton:hover {\n  text-decoration: none;\n  -webkit-transform: translateY(1px);\n  transform: translateY(1px);\n  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.16);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.16);\n}\n\n.backButton {\n  color: #5851ff;\n  background: white;\n  text-decoration: none;\n  float: left;\n  border: none;\n  font-size: 13px;\n  font-weight: 600;\n  text-transform: uppercase;\n  padding: 12px 14px;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);\n  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);\n  outline: none;\n  letter-spacing: 0.04em;\n  -webkit-transition: all 0.15s ease;\n  transition: all 0.15s ease;\n  cursor: pointer;\n  margin-bottom: 15px;\n  margin-left: 5px;\n}\n.backButton:hover {\n  text-decoration: none;\n  -webkit-transform: translateY(1px);\n  transform: translateY(1px);\n  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.16);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.16);\n}\n\npre {\n  word-break: break-all;\n  word-wrap: break-word;\n  display: block;\n  white-space: pre-wrap;\n  margin: 24px 0px 28px;\n  /*padding: 16px 24px;*/\n  border-radius: 4px;\n  color: #16161D;\n  background-color: #f8f8f8;\n}\npre code {\n  font-weight: 500;\n  display: block;\n  overflow-x: auto;\n  word-wrap: normal;\n  white-space: pre-wrap;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  font-size: 14px;\n  line-height: 20px;\n}\n\ncode {\n  font-weight: 400;\n  font-family: \"Roboto Mono\", \"Source Code Pro\", monospace;\n  font-size: 14px;\n}\n\n.hljs-comment, .hljs-quote {\n  color: #5c6370;\n  font-style: italic;\n}\n\n.hljs-doctag, .hljs-keyword, .hljs-formula {\n  color: #db00e9;\n}\n\n.hljs-section, .hljs-name, .hljs-selector-tag, .hljs-deletion, .hljs-subst {\n  color: #2973b7;\n}\n\n.hljs-tag {\n  color: #2973b7;\n}\n\n.hljs-literal {\n  color: #56b6c2;\n}\n\n.hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-meta-string {\n  color: #2cc17e;\n}\n\n.hljs-built_in, .hljs-class .hljs-title {\n  color: #db00e9;\n}\n\n.hljs-attr,\n.hljs-variable,\n.hljs-template-variable,\n.hljs-type,\n.hljs-selector-class,\n.hljs-selector-attr,\n.hljs-selector-pseudo,\n.hljs-number {\n  color: #d19a66;\n}\n\n.hljs-attr {\n  color: #525252;\n}\n\n.hljs-symbol,\n.hljs-bullet,\n.hljs-link,\n.hljs-meta,\n.hljs-selector-id,\n.hljs-title {\n  color: #2973b7;\n}\n\n.hljs-emphasis {\n  font-style: italic;\n}\n\n.hljs-strong {\n  font-weight: bold;\n}\n\n.hljs-link {\n  text-decoration: underline;\n}\n\n.landing-page footer .ionic-oss-logo {\n  background-image: url(/assets/img/ionic-os-logo.png);\n}\n\nfooter {\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background: #f8f8fc;\n  height: 8em;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -ms-flex: 0 0 8em;\n  flex: 0 0 8em;\n}\nfooter .ionic-oss-logo {\n  background: url(/assets/img/ionic-os-dark-logo.png) no-repeat transparent;\n  width: 124px;\n  height: 16px;\n  background-size: 100%;\n}\nfooter .container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex: 1;\n  flex: 1;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  -ms-flex-align: center;\n  align-items: center;\n}\nfooter .svg-button {\n  margin-left: 16px;\n  -webkit-transition: all 0.15s ease;\n  transition: all 0.15s ease;\n  opacity: 0.5;\n  border: 0;\n}\nfooter .svg-button:hover {\n  opacity: 1;\n}\n\@media screen and (max-width: 768px) {\n  footer .container {\n    text-align: center;\n    -ms-flex-direction: column;\n    flex-direction: column;\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n  footer #open-source {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: column;\n    flex-direction: column;\n    -ms-flex-align: center;\n    align-items: center;\n    margin-bottom: 24px;\n  }\n}\n\n#open-source img {\n  width: 50%;\n}\n#open-source p {\n  margin-top: 0;\n  margin-bottom: 0;\n  color: #a5a4b8;\n  font-size: 10px;\n}\n\n\@media screen and (max-width: 355px) {\n  .wrapper {\n    padding-top: 100px;\n  }\n}\n\@media screen and (max-width: 450px) {\n  .wrapper {\n    padding-top: 80px;\n  }\n\n  site-header stencil-route-link a {\n    display: initial;\n  }\n}\n\@media screen and (max-width: 590px) {\n  .wrapper {\n    margin-right: 0;\n    margin-left: 0;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between;\n    -webkit-flex-direction: column-reverse;\n    -ms-flex-direction: column-reverse;\n    flex-direction: column-reverse;\n  }\n  .wrapper .pull-right {\n    padding: 0 15px;\n    width: 100%;\n    min-height: 100vh;\n  }\n  .wrapper .pull-left {\n    position: relative;\n    padding: 15px;\n    width: 100%;\n    bottom: 0;\n    background-color: #16161d;\n  }\n  .wrapper .pull-left * {\n    color: #ffffff;\n  }\n}\n\@media screen and (min-width: 590px) {\n  .wrapper .pull-left {\n    min-width: 250px;\n    max-width: 250px;\n    position: -webkit-sticky;\n    position: sticky;\n    top: 50px;\n  }\n  .wrapper .pull-right {\n    padding-left: 96px;\n    padding-right: 32px;\n    -ms-flex: 1 1 auto;\n    flex: 1 1 auto;\n    overflow: auto;\n    min-height: 100vh;\n  }\n}\n.document .container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n.document plugin-platforms {\n  display: block;\n  float: right;\n}\n.document plugin-platforms .platform {\n  margin-left: 8px;\n}\n.document img {\n  max-width: 100%;\n}\n.document h1:first-child anchor-link {\n  display: none;\n}\n.document ul {\n  -webkit-padding-start: 0px;\n}\n.document ul li, .document ul code {\n  font-size: 16px;\n  margin-left: 18px;\n}\n.document p a {\n  color: #1d9aff;\n  text-decoration: none;\n}\n.document p code,\n.document ul code,\n.document ol code {\n  padding: 0 4px 3px;\n  background-color: #ecf4fb;\n  color: #16161D;\n  border-radius: 3px;\n}\n.document #introButton {\n  background: #1d9aff;\n  color: white;\n  text-decoration: none;\n  border: none;\n  font-size: 13px;\n  font-weight: 600;\n  text-transform: uppercase;\n  padding: 16px 20px;\n  border-radius: 2px;\n  -webkit-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);\n  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);\n  outline: none;\n  letter-spacing: 0.04em;\n  -webkit-transition: all 0.15s ease;\n  transition: all 0.15s ease;\n  cursor: pointer;\n}\n.document #introButton:hover {\n  -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);\n  -webkit-transform: translateY(1px);\n  transform: translateY(1px);\n}"; }
}

class ContributorList {
    constructor() {
        this.contributors = [];
        this.link = (contributor) => `https://github.com/${contributor}`;
    }
    render() {
        if (this.contributors.length === 0) {
            return null;
        }
        return (h("ul", { class: "img-list" }, this.contributors.reverse().map(contributor => (h("li", null,
            h("a", { class: "contributor-img", target: "_blank", href: this.link(contributor) },
                h("img", { src: `https://github.com/${contributor}.png?size=90`, title: `Contributor ${contributor}` })))))));
    }
    static get is() { return "contributor-list"; }
    static get properties() { return {
        "contributors": {
            "type": "Any",
            "attr": "contributors"
        },
        "link": {
            "type": "Any",
            "attr": "link"
        }
    }; }
    static get style() { return "contributor-list {\n  display: block;\n}\n\ncontributor-list ul.img-list {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row-reverse;\n  flex-direction: row-reverse;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\ncontributor-list li:last-child {\n  margin-left:0 !important;\n}\n\ncontributor-list li:not(:last-child) {\n  margin-left: -10px;\n}\n\ncontributor-list img {\n  border: solid 2px var(--background);\n  border-radius: 50%;\n  height: 32px;\n  width: 32px;\n  border: 2px solid #FFF;\n}\n\ncontributor-list a.contributor-img {\n  display: block;\n  border: none;\n  -webkit-transition: -webkit-transform 50ms ease-out;\n  transition: -webkit-transform 50ms ease-out;\n  transition: transform 50ms ease-out;\n  transition: transform 50ms ease-out, -webkit-transform 50ms ease-out;\n}\n\n\@media (hover: hover) {\n  contributor-list a:hover {\n    -webkit-transform: scale(1.125);\n    transform: scale(1.125);\n    z-index: 1;\n  }\n}"; }
}

var siteStructure = [
  {
    "text": "Getting Started",
    "children": [
      {
        "text": "Introduction",
        "filePath": "/assets/docs-content/index.json",
        "url": "/docs/"
      },
      {
        "text": "Required Dependencies",
        "filePath": "/assets/docs-content/getting-started/dependencies.json",
        "url": "/docs/getting-started/dependencies"
      },
      {
        "text": "Installation",
        "filePath": "/assets/docs-content/getting-started/index.json",
        "url": "/docs/getting-started"
      },
      {
        "text": "Using with Ionic",
        "filePath": "/assets/docs-content/getting-started/with-ionic.json",
        "url": "/docs/getting-started/with-ionic"
      }
    ]
  },
  {
    "text": "Basics",
    "children": [
      {
        "text": "Development Workflow",
        "filePath": "/assets/docs-content/basics/workflow.json",
        "url": "/docs/basics/workflow"
      },
      {
        "text": "Opening Native IDE",
        "filePath": "/assets/docs-content/basics/opening-native-projects.json",
        "url": "/docs/basics/opening-native-projects"
      },
      {
        "text": "Building your App",
        "filePath": "/assets/docs-content/basics/building-your-app.json",
        "url": "/docs/basics/building-your-app"
      },
      {
        "text": "Running your App",
        "filePath": "/assets/docs-content/basics/running-your-app.json",
        "url": "/docs/basics/running-your-app"
      },
      {
        "text": "Using Plugins",
        "filePath": "/assets/docs-content/basics/using-plugins.json",
        "url": "/docs/basics/using-plugins"
      },
      {
        "text": "Native Project Configuration",
        "filePath": "/assets/docs-content/basics/configuring-your-app.json",
        "url": "/docs/basics/configuring-your-app"
      },
      {
        "text": "Progressive Web Apps",
        "filePath": "/assets/docs-content/basics/progressive-web-app.json",
        "url": "/docs/basics/progressive-web-app"
      }
    ]
  },
  {
    "text": "Cordova/PhoneGap",
    "children": [
      {
        "text": "Introduction",
        "filePath": "/assets/docs-content/cordova/index.json",
        "url": "/docs/cordova"
      },
      {
        "text": "Migration Strategy",
        "filePath": "/assets/docs-content/cordova/migration-strategy.json",
        "url": "/docs/cordova/migration-strategy"
      },
      {
        "text": "Cordova to Capacitor Migration",
        "filePath": "/assets/docs-content/cordova/migrating-from-cordova-to-capacitor.json",
        "url": "/docs/cordova/migrating-from-cordova-to-capacitor"
      },
      {
        "text": "Cordova/Ionic Native Plugins",
        "filePath": "/assets/docs-content/cordova/using-cordova-plugins.json",
        "url": "/docs/cordova/using-cordova-plugins"
      },
      {
        "text": "Known Incompatible Plugins",
        "filePath": "/assets/docs-content/cordova/known-incompatible-plugins.json",
        "url": "/docs/cordova/known-incompatible-plugins"
      }
    ]
  },
  {
    "text": "Guides",
    "children": [
      {
        "text": "Ionic Framework Camera App",
        "filePath": "/assets/docs-content/guides/ionic-framework-app.json",
        "url": "/docs/guides/ionic-framework-app"
      },
      {
        "text": "Push Notifications - Firebase",
        "filePath": "/assets/docs-content/guides/push-notifications-firebase.json",
        "url": "/docs/guides/push-notifications-firebase"
      },
      {
        "text": "Deep Links",
        "filePath": "/assets/docs-content/guides/deep-links.json",
        "url": "/docs/guides/deep-links"
      },
      {
        "text": "Community Guides",
        "filePath": "/assets/docs-content/guides/community.json",
        "url": "/docs/guides/community"
      }
    ]
  },
  {
    "text": "iOS",
    "children": [
      {
        "text": "Getting Started",
        "filePath": "/assets/docs-content/ios/index.json",
        "url": "/docs/ios"
      },
      {
        "text": "Configuration",
        "filePath": "/assets/docs-content/ios/configuration.json",
        "url": "/docs/ios/configuration"
      },
      {
        "text": "Updating",
        "filePath": "/assets/docs-content/ios/updating.json",
        "url": "/docs/ios/updating"
      },
      {
        "text": "Custom Native Code",
        "filePath": "/assets/docs-content/ios/custom-code.json",
        "url": "/docs/ios/custom-code"
      },
      {
        "text": "Deploying to App Store",
        "filePath": "https://www.joshmorony.com/deploying-capacitor-applications-to-ios-development-distribution/"
      },
      {
        "text": "Troubleshooting",
        "filePath": "/assets/docs-content/ios/troubleshooting.json",
        "url": "/docs/ios/troubleshooting"
      }
    ]
  },
  {
    "text": "Android",
    "children": [
      {
        "text": "Getting Started",
        "filePath": "/assets/docs-content/android/index.json",
        "url": "/docs/android"
      },
      {
        "text": "Configuration",
        "filePath": "/assets/docs-content/android/configuration.json",
        "url": "/docs/android/configuration"
      },
      {
        "text": "Updating",
        "filePath": "/assets/docs-content/android/updating.json",
        "url": "/docs/android/updating"
      },
      {
        "text": "Custom Native Code",
        "filePath": "/assets/docs-content/android/custom-code.json",
        "url": "/docs/android/custom-code"
      },
      {
        "text": "Deploying to Google Play",
        "filePath": "https://www.joshmorony.com/deploying-capacitor-applications-to-android-development-distribution/"
      },
      {
        "text": "Troubleshooting",
        "filePath": "/assets/docs-content/android/troubleshooting.json",
        "url": "/docs/android/troubleshooting"
      }
    ]
  },
  {
    "text": "Web/PWA",
    "children": [
      {
        "text": "Getting Started",
        "filePath": "/assets/docs-content/web/index.json",
        "url": "/docs/web"
      },
      {
        "text": "PWA Elements",
        "filePath": "/assets/docs-content/web/pwa-elements.json",
        "url": "/docs/pwa-elements"
      }
    ]
  },
  {
    "text": "Electron",
    "children": [
      {
        "text": "Getting Started",
        "filePath": "/assets/docs-content/electron/index.json",
        "url": "/docs/electron"
      },
      {
        "text": "Updating",
        "filePath": "/assets/docs-content/electron/updating.json",
        "url": "/docs/electron/updating"
      }
    ]
  },
  {
    "text": "Creating Plugins",
    "children": [
      {
        "text": "Introduction",
        "filePath": "/assets/docs-content/plugins/index.json",
        "url": "/docs/plugins"
      },
      {
        "text": "iOS Guide",
        "filePath": "/assets/docs-content/plugins/ios.json",
        "url": "/docs/plugins/ios"
      },
      {
        "text": "Android Guide",
        "filePath": "/assets/docs-content/plugins/android.json",
        "url": "/docs/plugins/android"
      },
      {
        "text": "Web/PWA Guide",
        "filePath": "/assets/docs-content/plugins/web.json",
        "url": "/docs/plugins/web"
      },
      {
        "text": "JavaScript Guide",
        "filePath": "/assets/docs-content/plugins/js.json",
        "url": "/docs/plugins/js"
      }
    ]
  },
  {
    "text": "APIs",
    "children": [
      {
        "text": "Introduction",
        "filePath": "/assets/docs-content/apis/index.json",
        "url": "/docs/apis"
      },
      {
        "text": "Community Plugins",
        "filePath": "/assets/docs-content/community/plugins.json",
        "url": "/docs/community/plugins"
      },
      {
        "text": "Accessibility",
        "filePath": "/assets/docs-content/apis/accessibility/index.json",
        "url": "/docs/apis/accessibility"
      },
      {
        "text": "App",
        "filePath": "/assets/docs-content/apis/app/index.json",
        "url": "/docs/apis/app"
      },
      {
        "text": "Background Task",
        "filePath": "/assets/docs-content/apis/background-task/index.json",
        "url": "/docs/apis/background-task"
      },
      {
        "text": "Browser",
        "filePath": "/assets/docs-content/apis/browser/index.json",
        "url": "/docs/apis/browser"
      },
      {
        "text": "Camera",
        "filePath": "/assets/docs-content/apis/camera/index.json",
        "url": "/docs/apis/camera"
      },
      {
        "text": "Clipboard",
        "filePath": "/assets/docs-content/apis/clipboard/index.json",
        "url": "/docs/apis/clipboard"
      },
      {
        "text": "Console",
        "filePath": "/assets/docs-content/apis/console/index.json",
        "url": "/docs/apis/console"
      },
      {
        "text": "Device",
        "filePath": "/assets/docs-content/apis/device/index.json",
        "url": "/docs/apis/device"
      },
      {
        "text": "Filesystem",
        "filePath": "/assets/docs-content/apis/filesystem/index.json",
        "url": "/docs/apis/filesystem"
      },
      {
        "text": "Geolocation",
        "filePath": "/assets/docs-content/apis/geolocation/index.json",
        "url": "/docs/apis/geolocation"
      },
      {
        "text": "Haptics",
        "filePath": "/assets/docs-content/apis/haptics/index.json",
        "url": "/docs/apis/haptics"
      },
      {
        "text": "Keyboard",
        "filePath": "/assets/docs-content/apis/keyboard/index.json",
        "url": "/docs/apis/keyboard"
      },
      {
        "text": "Local Notifications",
        "filePath": "/assets/docs-content/apis/local-notifications/index.json",
        "url": "/docs/apis/local-notifications"
      },
      {
        "text": "Modals",
        "filePath": "/assets/docs-content/apis/modals/index.json",
        "url": "/docs/apis/modals"
      },
      {
        "text": "Motion",
        "filePath": "/assets/docs-content/apis/motion/index.json",
        "url": "/docs/apis/motion"
      },
      {
        "text": "Network",
        "filePath": "/assets/docs-content/apis/network/index.json",
        "url": "/docs/apis/network"
      },
      {
        "text": "Permissions",
        "filePath": "/assets/docs-content/apis/permissions/index.json",
        "url": "/docs/apis/permissions"
      },
      {
        "text": "Push Notifications",
        "filePath": "/assets/docs-content/apis/push-notifications/index.json",
        "url": "/docs/apis/push-notifications"
      },
      {
        "text": "Share",
        "filePath": "/assets/docs-content/apis/share/index.json",
        "url": "/docs/apis/share"
      },
      {
        "text": "Splash Screen",
        "filePath": "/assets/docs-content/apis/splash-screen/index.json",
        "url": "/docs/apis/splash-screen"
      },
      {
        "text": "Status Bar",
        "filePath": "/assets/docs-content/apis/status-bar/index.json",
        "url": "/docs/apis/status-bar"
      },
      {
        "text": "Storage",
        "filePath": "/assets/docs-content/apis/storage/index.json",
        "url": "/docs/apis/storage"
      },
      {
        "text": "Toast",
        "filePath": "/assets/docs-content/apis/toast/index.json",
        "url": "/docs/apis/toast"
      }
    ]
  }
];

function findItem(siteStructureList, url, foundData = { parent: null }) {
    for (const item of siteStructureList) {
        if (item.url === url) {
            foundData.item = item;
        }
        else if (foundData.item != null && item.url != null) {
            foundData.nextItem = item;
        }
        else if (item.url != null && foundData.item == null) {
            foundData.prevItem = item;
        }
        else if (item.children && item.children.length > 0) {
            if (foundData.item == null) {
                foundData.parent = item;
            }
            foundData = findItem(item.children, url, foundData);
        }
        if (foundData.item != null && foundData.nextItem != null) {
            return foundData;
        }
    }
    return foundData;
}

class DocumentComponent {
    constructor() {
        this.pages = [];
        this.page = null;
    }
    componentWillLoad() {
        return this.fetchNewContent(this.page);
    }
    fetchNewContent(page, oldPage) {
        if (page == null || page === oldPage) {
            return;
        }
        const foundData = findItem(siteStructure, this.page);
        this.item = foundData.item;
        this.nextItem = foundData.nextItem;
        this.prevItem = foundData.prevItem;
        this.parent = foundData.parent;
    }
    render() {
        // debugger;
        if (this.item == null) {
            return h("h1", null, "Page not found");
        }
        return (h("div", { class: "container" },
            h("app-burger", null),
            h("site-menu", { selectedParent: this.parent, siteStructureList: siteStructure }),
            h("app-marked", { fetchPath: this.item.filePath, renderer: (docsContent) => [
                    h("stencil-route-title", { pageTitle: docsContent.title ? `${docsContent.title} - Capacitor` : 'Capacitor' }),
                    h("div", { class: "doc-content" },
                        h("div", { class: "measure-lg" },
                            h("div", { innerHTML: docsContent.content }),
                            h("h2", null, "Contributors"),
                            h("contributor-list", { contributors: docsContent.contributors }),
                            h("lower-content-nav", { next: this.nextItem, prev: this.prevItem }))),
                    h("in-page-navigation", { pageLinks: docsContent.headings, srcUrl: docsContent.srcPath, currentPageUrl: docsContent.url })
                ] })));
    }
    static get is() { return "document-component"; }
    static get properties() { return {
        "item": {
            "state": true
        },
        "nextItem": {
            "state": true
        },
        "page": {
            "type": String,
            "attr": "page",
            "watchCallbacks": ["fetchNewContent"]
        },
        "pages": {
            "type": "Any",
            "attr": "pages"
        },
        "parent": {
            "state": true
        },
        "prevItem": {
            "state": true
        }
    }; }
    static get style() { return ":root {\n  --color-woodsmoke: #16161D;\n  --color-dolphin: #626177;\n  --color-gunpowder: #505061;\n  --color-manatee: #8888A2;\n  --color-cadet-blue: #abb2bf;\n  --color-whisper: #EBEBF7;\n  --color-selago: #F4F4FD;\n  --color-white-lilac: #f8f8fc;\n  --color-white: #fff;\n  --color-green-haze: #00AB47;\n  --color-dodger-blue: #1d9aff;\n  --color-dodger-blue-hover: rgba(#1d9aff, 0.2);\n  --color-old-lace: #fdf5e4;\n  --color-wheatfield: #F1E3C5;\n  --color-pirate-gold: #9A6400;\n  --button-shadow: 0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);\n  --button-shadow-hover: 0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);\n  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\ndocument-component .container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\ndocument-component plugin-platforms {\n  display: block;\n  float: right;\n}\ndocument-component plugin-platforms .platform {\n  margin-left: 8px;\n}\ndocument-component table, document-component td, document-component th {\n  border: 1px solid #eee;\n  border-collapse: collapse;\n}\ndocument-component table {\n  width: 100%;\n}\ndocument-component table th {\n  text-align: left;\n  padding: 4px;\n}\ndocument-component table td {\n  font-size: 12px;\n  line-height: 18px;\n  vertical-align: top;\n  padding: 4px;\n  min-width: 150px;\n}\ndocument-component table td code {\n  font-size: 12px;\n}\ndocument-component .heading-link {\n  position: relative;\n  text-decoration: none;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  color: #2d2d4c;\n}\ndocument-component .heading-link:hover {\n  border-bottom: 1px solid transparent;\n}\ndocument-component .heading-link ion-icon {\n  -webkit-transition: opacity 0.2s;\n  transition: opacity 0.2s;\n  position: absolute;\n  left: -24px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  opacity: 0;\n}\ndocument-component .heading-link:hover ion-icon {\n  opacity: 0.8;\n}\ndocument-component img {\n  max-width: 100%;\n  margin: 8px 0;\n}\ndocument-component h1:first-child anchor-link {\n  display: none;\n}\ndocument-component ul {\n  -webkit-padding-start: 16px;\n}\ndocument-component ul li, document-component ul code {\n  font-size: 14px;\n  margin-top: 16px;\n}\ndocument-component p a {\n  color: #1d9aff;\n  text-decoration: none;\n}\ndocument-component p code,\ndocument-component ul code,\ndocument-component ol code {\n  padding: 1px 4px 2px;\n  background-color: #ecf4fb;\n  color: #16161D;\n  border-radius: 3px;\n}\ndocument-component #introButton {\n  background: #1d9aff;\n  color: white;\n  text-decoration: none;\n  border: none;\n  font-size: 13px;\n  font-weight: 600;\n  text-transform: uppercase;\n  padding: 12px 14px;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);\n  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);\n  outline: none;\n  letter-spacing: 0.04em;\n  -webkit-transition: all 0.15s ease;\n  transition: all 0.15s ease;\n  cursor: pointer;\n}\ndocument-component #introButton:hover {\n  -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);\n  -webkit-transform: translateY(1px);\n  transform: translateY(1px);\n}\ndocument-component .btn.pull-left,\ndocument-component .btn.pull-right {\n  margin: 64px 8px 20px;\n}"; }
}

class InPageNavigtion {
    constructor() {
        this.pageLinks = [];
        this.srcUrl = '';
        this.currentPageUrl = '';
        this.itemOffsets = [];
        this.selectedId = null;
    }
    function() {
        const itemIndex = this.itemOffsets.findIndex(item => item.topOffset > window.scrollY);
        if (itemIndex === 0 || this.itemOffsets[this.itemOffsets.length - 1] === undefined) {
            this.selectedId = null;
        }
        else if (itemIndex === -1) {
            this.selectedId = this.itemOffsets[this.itemOffsets.length - 1].id;
        }
        else {
            this.selectedId = this.itemOffsets[itemIndex - 1].id;
        }
    }
    updateItemOffsets() {
        requestAnimationFrame(() => {
            this.itemOffsets = this.pageLinks.map((pl) => {
                const item = document.getElementById(pl.id);
                return {
                    id: pl.id,
                    topOffset: item.getBoundingClientRect().top + window.scrollY
                };
            });
        });
    }
    componentDidLoad() {
        this.updateItemOffsets();
    }
    ghIcon() {
        return (h("svg", { id: "icon-github", viewBox: "0 0 512 512", width: "100%", height: "100%" },
            h("path", { d: "M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9 1.4.3 2.6.4 3.8.4 8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1-8.4 1.9-15.9 2.7-22.6 2.7-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1 10.5 0 20-3.4 25.6-6 2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8 0 0 1.6-.5 5-.5 8.1 0 26.4 3.1 56.6 24.1 17.9-5.1 37-7.6 56.1-7.7 19 .1 38.2 2.6 56.1 7.7 30.2-21 48.5-24.1 56.6-24.1 3.4 0 5 .5 5 .5 12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5 1.2 0 2.6-.1 4-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z" })));
    }
    stripTags(html) {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }
    render() {
        const pageLinks = this.pageLinks.filter(pl => pl.level !== 1);
        const submitEditLink = (h("a", { class: "submit-edit-link", href: `https://github.com/ionic-team/capacitor/tree/master/site/${this.srcUrl}` },
            this.ghIcon(),
            h("span", null, "Submit an edit")));
        if (pageLinks.length === 0) {
            return (h("div", { class: "sticky" }, submitEditLink));
        }
        return (h("div", { class: "sticky" },
            h("h5", null, "Contents"),
            h("ul", { class: "heading-links" }, pageLinks.map(pl => (h("li", { class: {
                    'heading-link': true,
                    [`size-h${pl.level}`]: true,
                    'selected': this.selectedId === pl.id
                } },
                h("stencil-route-link", { url: `${this.currentPageUrl}#${pl.id}` }, this.stripTags(pl.text)))))),
            submitEditLink));
    }
    static get is() { return "in-page-navigation"; }
    static get properties() { return {
        "currentPageUrl": {
            "type": String,
            "attr": "current-page-url"
        },
        "itemOffsets": {
            "state": true
        },
        "pageLinks": {
            "type": "Any",
            "attr": "page-links",
            "watchCallbacks": ["updateItemOffsets"]
        },
        "selectedId": {
            "state": true
        },
        "srcUrl": {
            "type": String,
            "attr": "src-url"
        }
    }; }
    static get listeners() { return [{
            "name": "window:scroll",
            "method": "function",
            "passive": true
        }, {
            "name": "window:resize",
            "method": "updateItemOffsets",
            "passive": true
        }]; }
    static get style() { return "in-page-navigation {\n  -ms-flex: 0 0 180px;\n  flex: 0 0 180px;\n  height: 100%;\n  padding-top: 26px;\n  padding-left: 16px;\n}\n\nin-page-navigation h5 {\n  text-transform: uppercase;\n  font-size: 11px;\n  margin-top: 0;\n  margin-bottom: 12px;\n  font-weight: 600;\n  color: #a0aec0;\n  letter-spacing: .05em;\n\n}\n\nin-page-navigation .heading-links {\n  list-style: none;\n  line-height: 1;\n  padding: 0;\n  margin: 0;\n  --indent-size: 12px;\n  margin-left: calc(var(--indent-size) * -2);\n}\n\nin-page-navigation .heading-links li {\n  width: 188px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nin-page-navigation .heading-links li + li {\n  margin-top: 8px;\n}\n\nin-page-navigation .heading-links a {\n  font-weight: 400;\n  color: var(--color-gunpowder);\n  font-size: 13px;\n  line-height: 18px;\n  font-weight: 500;\n  border: none;\n  text-decoration: none;\n  border: none !important;\n  -webkit-transition: .2s color ease;\n  transition: .2s color ease;\n}\n\nin-page-navigation .heading-links a:hover {\n  color: var(--color-woodsmoke);\n}\n\nin-page-navigation .heading-links a:hover {\n  border: none;\n}\n\nin-page-navigation .heading-links .heading-link:hover,\nin-page-navigation .heading-links .heading-link.selected {\n  border-bottom: none !important;\n  -webkit-transform: translateX(calc(var(--indent-size) * 1 + 2px));\n  transform: translateX(calc(var(--indent-size) * 1 + 2px));\n}\n\nin-page-navigation li.heading-link {\n  padding-left: 12px;\n  margin-left: 0;\n  border-left: 2px solid transparent;\n  -webkit-transition: .2s transform ease;\n  transition: .2s transform ease;\n}\n\nin-page-navigation li.heading-link.selected {\n  border-left: 2px solid var(--color-dodger-blue);\n}\n\nin-page-navigation li.heading-link.selected a {\n  color: var(--color-dodger-blue);\n  font-weight: 600;\n}\n\nin-page-navigation li.size-h2 {\n  -webkit-transform: translateX(calc(var(--indent-size) * 1));\n  transform: translateX(calc(var(--indent-size) * 1));\n  font-weight: 600;\n}\n\nin-page-navigation li.size-h3 {\n  -webkit-transform: translateX(calc(var(--indent-size) * 2));\n  transform: translateX(calc(var(--indent-size) * 2));\n}\n\nin-page-navigation li.size-h4 {\n  -webkit-transform: translateX(calc(var(--indent-size) * 3));\n  transform: translateX(calc(var(--indent-size) * 3));\n}\n\nin-page-navigation li.size-h3 a,\nin-page-navigation li.size-h4 a {\n  font-weight: 400;\n  color: #6c6c8b;\n}\n\nin-page-navigation li.size-h3:hover a,\nin-page-navigation li.size-h4:hover a {\n  color: var(--color-gunpowder);\n}\n\nin-page-navigation li.heading-link.size-h3:hover,\nin-page-navigation li.heading-link.size-h3.selected {\n  -webkit-transform: translateX(calc(var(--indent-size) * 2 + 2px));\n  transform: translateX(calc(var(--indent-size) * 2 + 2px));\n}\n\nin-page-navigation li.heading-link.size-h4:hover,\nin-page-navigation li.heading-link.size-h4.selected {\n  -webkit-transform: translateX(calc(var(--indent-size) * 3 + 2px));\n  transform: translateX(calc(var(--indent-size) * 3 + 2px));\n}\n\nin-page-navigation .submit-edit-link {\n  font-size: 12px;\n  display: inline-block;\n  color: var(--color-dodger-blue);\n  font-weight: 600;\n  text-decoration: none;\n  display: -ms-flexbox;\n  display: flex;\n}\n\nin-page-navigation .submit-edit-link svg {\n  width: 16px;\n  fill: currentColor;\n}\n\nin-page-navigation .submit-edit-link span {\n  -webkit-transition: border 0.2s;\n  transition: border 0.2s;\n  height: 16px;\n  margin-left: 6px;\n  border-bottom: 1px solid transparent;\n}\n\nin-page-navigation .submit-edit-link:hover span {\n  border-bottom: 1px solid var(--color-cadet-blue);\n}\n\nin-page-navigation .heading-links + .submit-edit-link {\n  margin-top: 28px;\n  border-bottom: none;\n}\n\n\n\@media screen and (max-width: 1024px) {\n  in-page-navigation {\n    display: none;\n  }\n}"; }
}

class LowerContentNav {
    render() {
        return [
            (this.prev != null ?
                h("stencil-route-link", { url: this.prev.url, anchorClass: "pull-left btn btn--secondary" }, "Back") :
                null),
            (this.next != null ?
                h("stencil-route-link", { url: this.next.url, anchorClass: "pull-right btn btn--primary" }, "Next") :
                null)
        ];
    }
    static get is() { return "lower-content-nav"; }
    static get properties() { return {
        "next": {
            "type": "Any",
            "attr": "next"
        },
        "prev": {
            "type": "Any",
            "attr": "prev"
        }
    }; }
    static get style() { return "lower-content-nav {\n    display: block;\n    overflow: hidden;\n}"; }
}

class SiteHeader {
    constructor() {
        this.isScrolled = false;
    }
    handleResize() {
        requestAnimationFrame(() => {
            if (window.innerWidth > 768) {
                const menu = this.el.querySelector('.header-menu');
                menu.style.display = "";
                this.el.classList.remove('show-mobile-menu');
                document.body.classList.remove('no-scroll');
                this.isMobileMenuShown = false;
            }
        });
    }
    handleScroll(event) {
        requestAnimationFrame(() => {
            if (event.target.documentElement.scrollTop !== 0 && !this.isScrolled) {
                this.el.classList.add('scrolled');
                this.isScrolled = true;
            }
            else if (event.target.documentElement.scrollTop === 0 && this.isScrolled) {
                this.el.classList.remove('scrolled');
                this.isScrolled = false;
            }
        });
    }
    componentDidLoad() {
        this.isMobileMenuShown = false;
    }
    showNav() {
        if (this.isMobileMenuShown)
            return;
        this.isMobileMenuShown = true;
        const menu = this.el.querySelector('.header-menu');
        menu.style.display = "flex";
        setTimeout(() => {
            this.el.classList.add('show-mobile-menu');
            document.body.classList.add('no-scroll');
        }, 1);
    }
    hideNav() {
        if (!this.isMobileMenuShown)
            return;
        this.isMobileMenuShown = false;
        const menu = this.el.querySelector('.header-menu');
        this.el.classList.remove('show-mobile-menu');
        setTimeout(() => {
            menu.style.display = "none";
            document.body.classList.remove('no-scroll');
        }, 300);
    }
    handleDropdownEnter() {
        this.isDropdownShown = true;
    }
    handleDropdownLeave() {
        this.isDropdownShown = false;
    }
    render() {
        return (h("div", { class: "site-header container" },
            h("stencil-route-link", { url: "/", class: "logo-link" },
                h("div", { class: "logo" })),
            h("div", { class: "header-menu" },
                h("stencil-route-link", { urlMatch: "/docs", url: "/docs/", onClick: () => { this.hideNav(); } }, "Docs"),
                h("span", { class: {
                        'link': true,
                        'dropdown': true,
                        'dropdown--visible': this.isDropdownShown
                    }, onMouseEnter: this.handleDropdownEnter.bind(this), onMouseLeave: this.handleDropdownLeave.bind(this) },
                    h("span", { class: "dropdown__label" }, "Community"),
                    h("ul", { class: "dropdown__menu" },
                        h("div", { class: "dropdown__arrow" }),
                        h("li", { class: "dropdown__item" },
                            h("a", { href: "/docs/community/plugins/" }, "Plugins")),
                        h("li", { class: "dropdown__item" },
                            h("a", { href: "https://forum.ionicframework.com/", target: "_blank" }, "Forum")),
                        h("li", { class: "dropdown__item" },
                            h("a", { href: "https://getcapacitor.herokuapp.com/", target: "_blank" }, "Slack")),
                        h("li", { class: "dropdown__item" },
                            h("a", { href: "https://twitter.com/getcapacitor", target: "_blank" }, "Twitter")))),
                h("stencil-route-link", { urlMatch: "/enterprise", url: "/enterprise/", class: "link" }, "Enterprise"),
                h("a", { class: "link link--external", href: "https://github.com/ionic-team/capacitor", target: "_blank" },
                    "GitHub",
                    h("app-icon", { name: "targetblank" })),
                h("div", { class: "header-close", onClick: () => { this.hideNav(); } },
                    h("app-icon", { name: "close" }))),
            h("div", { class: "header-overflow", onClick: () => { this.showNav(); } },
                h("app-icon", { name: "more" }))));
    }
    static get is() { return "site-header"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "isDropdownShown": {
            "state": true
        },
        "isMobileMenuShown": {
            "state": true
        },
        "isScrolled": {
            "state": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "handleResize",
            "passive": true
        }, {
            "name": "window:scroll",
            "method": "handleScroll",
            "passive": true
        }]; }
    static get style() { return ":root {\n  --color-woodsmoke: #16161D;\n  --color-dolphin: #626177;\n  --color-gunpowder: #505061;\n  --color-manatee: #8888A2;\n  --color-cadet-blue: #abb2bf;\n  --color-whisper: #EBEBF7;\n  --color-selago: #F4F4FD;\n  --color-white-lilac: #f8f8fc;\n  --color-white: #fff;\n  --color-green-haze: #00AB47;\n  --color-dodger-blue: #1d9aff;\n  --color-dodger-blue-hover: rgba(#1d9aff, 0.2);\n  --color-old-lace: #fdf5e4;\n  --color-wheatfield: #F1E3C5;\n  --color-pirate-gold: #9A6400;\n  --button-shadow: 0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);\n  --button-shadow-hover: 0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);\n  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\nsite-header {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  background-color: #fff;\n  z-index: 99;\n  -webkit-transition: 0.2s -webkit-box-shadow ease-out;\n  transition: 0.2s -webkit-box-shadow ease-out;\n  transition: 0.2s box-shadow ease-out;\n  transition: 0.2s box-shadow ease-out, 0.2s -webkit-box-shadow ease-out;\n}\nsite-header.scrolled {\n  -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 0px rgba(0, 0, 0, 0.02);\n  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 0px rgba(0, 0, 0, 0.02);\n}\nsite-header .container {\n  padding-top: 20px;\n  padding-bottom: 20px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\nsite-header .logo {\n  background: url(/assets/img/logo-light.png);\n  width: 128px;\n  height: 22px;\n  background-size: contain;\n  background-repeat: no-repeat;\n  font-size: 24px;\n}\nsite-header .logo-link a {\n  margin: 0;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  text-decoration: none;\n  border: 0;\n}\nsite-header .version {\n  color: #4CAFFF;\n  display: inline-block;\n  margin-left: 6px;\n  font-size: 8px;\n  letter-spacing: 0.4px;\n  text-transform: uppercase;\n  padding: 3px 5px;\n  background: rgba(120, 179, 228, 0.14);\n  border-radius: 4px;\n}\n\@media screen and (max-width: 768px) {\n  site-header .container {\n    padding-top: 15px;\n    padding-bottom: 15px;\n    -ms-flex-direction: column;\n    flex-direction: column;\n    -ms-flex-align: center;\n    align-items: center;\n  }\n}\n\n.landing-page site-header .version {\n  background: rgba(255, 255, 255, 0.14);\n}\n\n.header-menu a,\n.header-menu .dropdown__label {\n  -webkit-transition: border 0.3s, color 0.3s;\n  transition: border 0.3s, color 0.3s;\n  font-size: 14px;\n  padding-bottom: 4px;\n  border-bottom: 3px solid transparent;\n  vertical-align: top;\n  color: rgba(0, 0, 0, 0.6);\n  text-decoration: none;\n  font-weight: 500;\n  letter-spacing: -0.02em;\n}\n.header-menu stencil-route-link + stencil-route-link,\n.header-menu stencil-route-link + .link,\n.header-menu .link + .link {\n  margin-left: 30px;\n}\n.header-menu a:not(.link--external):hover,\n.header-menu .link-active {\n  color: black;\n  border-bottom-color: rgba(0, 0, 0, 0.1);\n}\n.header-menu .dropdown:hover .dropdown__label {\n  color: black;\n}\n.header-menu a.link-active {\n  color: #000;\n}\n.header-menu .link,\n.header-menu .link--external {\n  position: relative;\n  border: 0;\n  -webkit-transition: color 0.3s;\n  transition: color 0.3s;\n}\n.header-menu .link--external .icon {\n  margin-left: 6px;\n  -webkit-transition: top 0.2s, left 0.2s;\n  transition: top 0.2s, left 0.2s;\n  position: relative;\n}\n.header-menu .link--external:hover {\n  color: #000;\n}\n.header-menu .link--external:hover .icon {\n  left: 1px;\n  top: -1px;\n}\n\n.header-overflow,\n.header-close {\n  -webkit-transition: opacity 0.3s;\n  transition: opacity 0.3s;\n  position: absolute;\n  top: 15px;\n  right: 15px;\n  width: 22px;\n  height: 18px;\n  display: none;\n  cursor: pointer;\n  opacity: 0.7;\n}\n.header-overflow:hover,\n.header-close:hover {\n  opacity: 1;\n}\n\@media screen and (max-width: 768px) {\n  .header-overflow,\n.header-close {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n}\n\n.header-close .icon-close {\n  fill: #fff;\n}\n\n.landing-page .logo {\n  background-image: url(/assets/img/logo-dark.png);\n  color: #fff;\n  font-family: \"Roboto Mono\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  letter-spacing: 1px;\n  font-weight: 600;\n}\n.landing-page site-header {\n  position: static;\n}\n.landing-page .header-menu a,\n.landing-page .header-menu .dropdown__label {\n  color: rgba(255, 255, 255, 0.7);\n}\n.landing-page .header-menu a:not(.link--external):hover,\n.landing-page .header-menu a.link-active {\n  color: white;\n  border-bottom-color: rgba(255, 255, 255, 0.2);\n}\n.landing-page .header-menu a.link-active,\n.landing-page .header-menu a.link-active:hover,\n.landing-page .header-menu .dropdown:hover .dropdown__label {\n  color: #fff;\n}\n.landing-page .header-menu .link:hover {\n  color: #fff;\n}\n\n\@media screen and (max-width: 768px) {\n  .header-menu {\n    -webkit-transition: opacity 0.3s;\n    transition: opacity 0.3s;\n    position: fixed;\n    z-index: 9999;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: column;\n    flex-direction: column;\n    -ms-flex-pack: center;\n    justify-content: center;\n    -ms-flex-align: center;\n    align-items: center;\n    background: #000;\n    opacity: 0;\n    display: none;\n  }\n  .header-menu stencil-route-link + stencil-route-link,\n.header-menu stencil-route-link + .link,\n.header-menu .link + .link {\n    margin-left: 0px;\n    margin-top: 38px;\n    margin-bottom: 0;\n    padding-bottom: 0;\n    display: inline-block;\n  }\n  .header-menu a,\n.header-menu .link {\n    font-size: 24px;\n    color: rgba(255, 255, 255, 0.7) !important;\n  }\n  .header-menu a:hover,\n.header-menu .link:hover {\n    color: #fff !important;\n  }\n  .header-menu a:hover,\n.header-menu .link:hover,\n.header-menu a.link-active {\n    color: #fff !important;\n    border-bottom-color: rgba(255, 255, 255, 0.2) !important;\n  }\n  .header-menu stencil-route-link,\n.header-menu .link {\n    -webkit-transition: color 0.3s, -webkit-transform 0.4s;\n    transition: color 0.3s, -webkit-transform 0.4s;\n    transition: transform 0.4s, color 0.3s;\n    transition: transform 0.4s, color 0.3s, -webkit-transform 0.4s;\n    -webkit-transform: translateY(8px);\n    transform: translateY(8px);\n  }\n\n  .show-mobile-menu {\n    z-index: 999999;\n  }\n\n  .show-mobile-menu .header-menu {\n    opacity: 1;\n  }\n\n  .show-mobile-menu .header-menu stencil-route-link,\n.show-mobile-menu .header-menu .link {\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n  }\n\n  .show-mobile-menu .header-menu--show + .header-overflow {\n    display: none;\n  }\n}\n.dropdown {\n  cursor: pointer;\n}\n\n.dropdown__menu {\n  padding: 0;\n  margin: 0;\n  text-align: center;\n}\n\n.dropdown__item {\n  list-style-type: none;\n  border: 0 !important;\n}\n\n.dropdown__label {\n  border: 0 !important;\n}\n\n\@media screen and (min-width: 769px) {\n  .dropdown__menu {\n    text-align: left;\n    position: absolute;\n    top: calc(100% + 12px);\n    left: 50%;\n    z-index: 999;\n    -webkit-box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1), 0 1px 6px rgba(0, 0, 0, 0.1);\n    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1), 0 1px 6px rgba(0, 0, 0, 0.1);\n    padding: 10px 18px 12px;\n    border-radius: 8px;\n    background: #fff;\n    display: block;\n    visibility: 0;\n    opacity: 0;\n    -webkit-transform: translate(-50%, -5px);\n    transform: translate(-50%, -5px);\n    pointer-events: none;\n    -webkit-transition: opacity 0.3s, -webkit-transform 0.3s ease;\n    transition: opacity 0.3s, -webkit-transform 0.3s ease;\n    transition: transform 0.3s ease, opacity 0.3s;\n    transition: transform 0.3s ease, opacity 0.3s, -webkit-transform 0.3s ease;\n  }\n  .dropdown__menu:before {\n    content: \"\";\n    position: absolute;\n    top: -20px;\n    width: 100%;\n    height: 30px;\n    left: 0;\n  }\n\n  .dropdown--visible .dropdown__menu {\n    visibility: 1;\n    opacity: 1;\n    -webkit-transform: scaleY(1);\n    transform: scaleY(1);\n    -webkit-transform: translate(-50%, 0);\n    transform: translate(-50%, 0);\n    pointer-events: auto;\n  }\n\n  .dropdown__arrow {\n    position: absolute;\n    height: 8px;\n    width: 20px;\n    overflow: hidden;\n    top: -8px;\n    left: calc(50% - 8px);\n  }\n  .dropdown__arrow:before {\n    position: absolute;\n    width: 20px;\n    height: 20px;\n    top: 4px;\n    background: #fff;\n    -webkit-transform: rotate(45deg);\n    transform: rotate(45deg);\n    border-radius: 4px;\n    -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);\n    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);\n    content: \"\";\n    display: block;\n  }\n\n  .dropdown__item {\n    min-width: 80px;\n    display: block;\n  }\n\n  .dropdown__item a {\n    color: #1d9aff !important;\n    font-weight: 500;\n    border: 0;\n  }\n  .dropdown__item a:hover {\n    color: #0073d0 !important;\n  }\n}\n\@media screen and (max-width: 768px) {\n  .landing-page .header-menu .dropdown__label,\n.header-menu .dropdown__label {\n    font-size: 11px;\n    text-transform: uppercase;\n    letter-spacing: 0.1em;\n    color: rgba(255, 255, 255, 0.4) !important;\n    font-weight: 600;\n    vertical-align: baseline;\n  }\n\n  .dropdown__arrow {\n    display: none;\n  }\n\n  .dropdown__menu {\n    text-align: center;\n  }\n\n  .dropdown__item {\n    margin-top: 4px;\n  }\n\n  .dropdown__item a {\n    border: 0;\n    font-size: 18px;\n  }\n}"; }
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Route {
    constructor() {
        this.group = null;
        this.match = null;
        this.componentProps = {};
        this.exact = false;
        this.scrollOnNextRender = false;
        this.previousMatch = null;
    }
    computeMatch(newLocation) {
        const isGrouped = this.group != null || (this.el.parentElement != null && this.el.parentElement.tagName.toLowerCase() === "stencil-route-switch");
        if (!newLocation || isGrouped) {
            return;
        }
        this.previousMatch = this.match;
        return this.match = matchPath(newLocation.pathname, {
            path: this.url,
            exact: this.exact,
            strict: true
        });
    }
    loadCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            let routeViewOptions = {};
            if (this.history && this.history.location.hash) {
                routeViewOptions = {
                    scrollToId: this.history.location.hash.substr(1)
                };
            }
            else if (this.scrollTopOffset) {
                routeViewOptions = {
                    scrollTopOffset: this.scrollTopOffset
                };
            }
            if (typeof this.componentUpdated === "function") {
                this.componentUpdated(routeViewOptions);
            }
            else if (this.match && !matchesAreEqual(this.match, this.previousMatch) && this.routeViewsUpdated) {
                this.routeViewsUpdated(routeViewOptions);
            }
        });
    }
    componentDidUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadCompleted();
        });
    }
    componentDidLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadCompleted();
        });
    }
    render() {
        if (!this.match || !this.history) {
            return null;
        }
        const childProps = Object.assign({}, this.componentProps, { history: this.history, match: this.match });
        if (this.routeRender) {
            return this.routeRender(Object.assign({}, childProps, { component: this.component }));
        }
        if (this.component) {
            const ChildComponent = this.component;
            return (h(ChildComponent, Object.assign({}, childProps)));
        }
    }
    static get is() { return "stencil-route"; }
    static get properties() {
        return {
            "component": {
                "type": String,
                "attr": "component"
            },
            "componentProps": {
                "type": "Any",
                "attr": "component-props"
            },
            "componentUpdated": {
                "type": "Any",
                "attr": "component-updated"
            },
            "el": {
                "elementRef": true
            },
            "exact": {
                "type": Boolean,
                "attr": "exact"
            },
            "group": {
                "type": String,
                "attr": "group",
                "reflectToAttr": true
            },
            "history": {
                "type": "Any",
                "attr": "history"
            },
            "historyType": {
                "type": String,
                "attr": "history-type"
            },
            "location": {
                "type": "Any",
                "attr": "location",
                "watchCallbacks": ["computeMatch"]
            },
            "match": {
                "type": "Any",
                "attr": "match",
                "mutable": true
            },
            "routeRender": {
                "type": "Any",
                "attr": "route-render"
            },
            "routeViewsUpdated": {
                "type": "Any",
                "attr": "route-views-updated"
            },
            "scrollTopOffset": {
                "type": Number,
                "attr": "scroll-top-offset"
            },
            "url": {
                "type": String,
                "attr": "url"
            }
        };
    }
    static get style() { return "stencil-route.inactive {\n  display: none;\n}"; }
}
ActiveRouter.injectProps(Route, [
    "location",
    "history",
    "historyType",
    "routeViewsUpdated"
]);

function uuidv4 () {
    return ([1e7].toString() + -1e3.toString() + -4e3.toString() + -8e3.toString() + -1e11.toString()).replace(/[018]/g, function (c) {
        const random = window.crypto.getRandomValues(new Uint8Array(1));
        return (c ^ random[0] & 15 >> c / 4).toString(16);
    });
}

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getUniqueId() {
    if (window.crypto) {
        return uuidv4();
    }
    return ((Math.random() * 100000000000000000).toString().match(/.{4}/g) || []).join("-");
}
function getMatch(pathname, url, exact) {
    return matchPath(pathname, {
        path: url,
        exact: exact,
        strict: true
    });
}
function isHTMLStencilRouteElement(element) {
    return element.tagName.toLowerCase() === "stencil-route";
}
class RouteSwitch {
    constructor() {
        this.group = getUniqueId();
        this.subscribers = [];
    }
    componentWillLoad() {
        if (this.location != null) {
            this.regenerateSubscribers(this.location);
        }
    }
    regenerateSubscribers(newLocation) {
        return __awaiter$1(this, void 0, void 0, function* () {
            if (newLocation == null) {
                return;
            }
            let newActiveIndex = -1;
            this.subscribers = Array.prototype.slice.call(this.el.children)
                .filter(isHTMLStencilRouteElement)
                .map((childElement, index) => {
                const match = getMatch(newLocation.pathname, childElement.url, childElement.exact);
                if (match && newActiveIndex === -1) {
                    newActiveIndex = index;
                }
                return {
                    el: childElement,
                    match: match
                };
            });
            if (newActiveIndex === -1) {
                return;
            }
            if (this.activeIndex === newActiveIndex) {
                this.subscribers[newActiveIndex].el.match = this.subscribers[newActiveIndex].match;
                return;
            }
            this.activeIndex = newActiveIndex;
            const activeChild = this.subscribers[this.activeIndex];
            if (this.scrollTopOffset) {
                activeChild.el.scrollTopOffset = this.scrollTopOffset;
            }
            activeChild.el.group = this.group;
            activeChild.el.match = activeChild.match;
            activeChild.el.componentUpdated = (routeViewUpdatedOptions) => {
                this.queue.write(() => {
                    this.subscribers.forEach((child, index) => {
                        child.el.componentUpdated = undefined;
                        if (index === this.activeIndex) {
                            return child.el.style.display = "";
                        }
                        if (this.scrollTopOffset) {
                            child.el.scrollTopOffset = this.scrollTopOffset;
                        }
                        child.el.group = this.group;
                        child.el.match = null;
                        child.el.style.display = "none";
                    });
                });
                if (this.routeViewsUpdated) {
                    this.routeViewsUpdated(Object.assign({ scrollTopOffset: this.scrollTopOffset }, routeViewUpdatedOptions));
                }
            };
        });
    }
    render() {
        return (h("slot", null));
    }
    static get is() { return "stencil-route-switch"; }
    static get properties() {
        return {
            "el": {
                "elementRef": true
            },
            "group": {
                "type": String,
                "attr": "group",
                "reflectToAttr": true
            },
            "location": {
                "type": "Any",
                "attr": "location",
                "watchCallbacks": ["regenerateSubscribers"]
            },
            "queue": {
                "context": "queue"
            },
            "routeViewsUpdated": {
                "type": "Any",
                "attr": "route-views-updated"
            },
            "scrollTopOffset": {
                "type": Number,
                "attr": "scroll-top-offset"
            }
        };
    }
}
ActiveRouter.injectProps(RouteSwitch, [
    "location",
    "routeViewsUpdated"
]);

class RouteTitle {
    constructor() {
        this.titleSuffix = "";
        this.pageTitle = "";
    }
    updateDocumentTitle() {
        document.title = `${this.pageTitle}${this.titleSuffix || ""}`;
    }
    componentWillLoad() {
        this.updateDocumentTitle();
    }
    static get is() { return "stencil-route-title"; }
    static get properties() {
        return {
            "el": {
                "elementRef": true
            },
            "pageTitle": {
                "type": String,
                "attr": "page-title",
                "watchCallbacks": ["updateDocumentTitle"]
            },
            "titleSuffix": {
                "type": String,
                "attr": "title-suffix"
            }
        };
    }
}
ActiveRouter.injectProps(RouteTitle, [
    "titleSuffix",
]);

function invariant(value, ...args) {
    if (!value) {
        console.error(...args);
    }
}
function warning(value, ...args) {
    if (!value) {
        console.warn(...args);
    }
}

const createTransitionManager = () => {
    let prompt;
    const setPrompt = (nextPrompt) => {
        warning(prompt == null, 'A history supports only one prompt at a time');
        prompt = nextPrompt;
        return () => {
            if (prompt === nextPrompt) {
                prompt = null;
            }
        };
    };
    const confirmTransitionTo = (location, action, getUserConfirmation, callback) => {
        if (prompt != null) {
            const result = typeof prompt === 'function' ? prompt(location, action) : prompt;
            if (typeof result === 'string') {
                if (typeof getUserConfirmation === 'function') {
                    getUserConfirmation(result, callback);
                }
                else {
                    warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message');
                    callback(true);
                }
            }
            else {
                callback(result !== false);
            }
        }
        else {
            callback(true);
        }
    };
    let listeners = [];
    const appendListener = (fn) => {
        let isActive = true;
        const listener = (...args) => {
            if (isActive) {
                fn(...args);
            }
        };
        listeners.push(listener);
        return () => {
            isActive = false;
            listeners = listeners.filter(item => item !== listener);
        };
    };
    const notifyListeners = (...args) => {
        listeners.forEach(listener => listener(...args));
    };
    return {
        setPrompt,
        confirmTransitionTo,
        appendListener,
        notifyListeners
    };
};

const createScrollHistory = (applicationScrollKey = 'scrollPositions') => {
    let scrollPositions = new Map();
    if (storageAvailable('sessionStorage')) {
        const scrollData = window.sessionStorage.getItem(applicationScrollKey);
        scrollPositions = scrollData ?
            new Map(JSON.parse(scrollData)) :
            scrollPositions;
    }
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    function set(key, value) {
        scrollPositions.set(key, value);
        if (storageAvailable('sessionStorage')) {
            const arrayData = [];
            scrollPositions.forEach((value, key) => {
                arrayData.push([key, value]);
            });
            window.sessionStorage.setItem('scrollPositions', JSON.stringify(arrayData));
        }
    }
    function get(key) {
        return scrollPositions.get(key);
    }
    function has(key) {
        return scrollPositions.has(key);
    }
    function capture(key) {
        set(key, [window.scrollX, window.scrollY]);
    }
    return {
        set,
        get,
        has,
        capture
    };
};

const PopStateEvent = 'popstate';
const HashChangeEvent = 'hashchange';
const getHistoryState = () => {
    try {
        return window.history.state || {};
    }
    catch (e) {
        return {};
    }
};
const createBrowserHistory = (props = {}) => {
    invariant(canUseDOM, 'Browser history needs a DOM');
    const globalHistory = window.history;
    const canUseHistory = supportsHistory();
    const needsHashChangeListener = !supportsPopStateOnHashChange();
    const scrollHistory = createScrollHistory();
    const forceRefresh = (props.forceRefresh != null) ? props.forceRefresh : false;
    const getUserConfirmation = (props.getUserConfirmation != null) ? props.getUserConfirmation : getConfirmation;
    const keyLength = (props.keyLength != null) ? props.keyLength : 6;
    const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
    const getDOMLocation = (historyState) => {
        historyState = historyState || {};
        const { key, state } = historyState;
        const { pathname, search, hash } = window.location;
        let path = pathname + search + hash;
        warning((!basename || hasBasename(path, basename)), 'You are attempting to use a basename on a page whose URL path does not begin ' +
            'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) {
            path = stripBasename(path, basename);
        }
        return createLocation(path, state, key || createKey(keyLength));
    };
    const transitionManager = createTransitionManager();
    const setState = (nextState) => {
        scrollHistory.capture(history.location.key);
        Object.assign(history, nextState);
        history.location.scrollPosition = scrollHistory.get(history.location.key);
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
    };
    const handlePopState = (event) => {
        if (isExtraneousPopstateEvent(event)) {
            return;
        }
        handlePop(getDOMLocation(event.state));
    };
    const handleHashChange = () => {
        handlePop(getDOMLocation(getHistoryState()));
    };
    let forceNextPop = false;
    const handlePop = (location) => {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        }
        else {
            const action = 'POP';
            transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
                if (ok) {
                    setState({ action, location });
                }
                else {
                    revertPop(location);
                }
            });
        }
    };
    const revertPop = (fromLocation) => {
        const toLocation = history.location;
        let toIndex = allKeys.indexOf(toLocation.key);
        if (toIndex === -1) {
            toIndex = 0;
        }
        let fromIndex = allKeys.indexOf(fromLocation.key);
        if (fromIndex === -1) {
            fromIndex = 0;
        }
        const delta = toIndex - fromIndex;
        if (delta) {
            forceNextPop = true;
            go(delta);
        }
    };
    const initialLocation = getDOMLocation(getHistoryState());
    let allKeys = [initialLocation.key];
    const createHref = (location) => {
        return basename + createPath(location);
    };
    const push = (path, state) => {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' +
            'argument is a location-like object that already has state; it is ignored');
        const action = 'PUSH';
        const location = createLocation(path, state, createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const href = createHref(location);
            const { key, state } = location;
            if (canUseHistory) {
                globalHistory.pushState({ key, state }, undefined, href);
                if (forceRefresh) {
                    window.location.href = href;
                }
                else {
                    const prevIndex = allKeys.indexOf(history.location.key);
                    const nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
                    nextKeys.push(location.key);
                    allKeys = nextKeys;
                    setState({ action, location });
                }
            }
            else {
                warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');
                window.location.href = href;
            }
        });
    };
    const replace = (path, state) => {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' +
            'argument is a location-like object that already has state; it is ignored');
        const action = 'REPLACE';
        const location = createLocation(path, state, createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const href = createHref(location);
            const { key, state } = location;
            if (canUseHistory) {
                globalHistory.replaceState({ key, state }, undefined, href);
                if (forceRefresh) {
                    window.location.replace(href);
                }
                else {
                    const prevIndex = allKeys.indexOf(history.location.key);
                    if (prevIndex !== -1) {
                        allKeys[prevIndex] = location.key;
                    }
                    setState({ action, location });
                }
            }
            else {
                warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');
                window.location.replace(href);
            }
        });
    };
    const go = (n) => {
        globalHistory.go(n);
    };
    const goBack = () => go(-1);
    const goForward = () => go(1);
    let listenerCount = 0;
    const checkDOMListeners = (delta) => {
        listenerCount += delta;
        if (listenerCount === 1) {
            addEventListener(window, PopStateEvent, handlePopState);
            if (needsHashChangeListener) {
                addEventListener(window, HashChangeEvent, handleHashChange);
            }
        }
        else if (listenerCount === 0) {
            removeEventListener(window, PopStateEvent, handlePopState);
            if (needsHashChangeListener) {
                removeEventListener(window, HashChangeEvent, handleHashChange);
            }
        }
    };
    let isBlocked = false;
    const block = (prompt = '') => {
        const unblock = transitionManager.setPrompt(prompt);
        if (!isBlocked) {
            checkDOMListeners(1);
            isBlocked = true;
        }
        return () => {
            if (isBlocked) {
                isBlocked = false;
                checkDOMListeners(-1);
            }
            return unblock();
        };
    };
    const listen = (listener) => {
        const unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(1);
        return () => {
            checkDOMListeners(-1);
            unlisten();
        };
    };
    const history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref,
        push,
        replace,
        go,
        goBack,
        goForward,
        block,
        listen
    };
    return history;
};

const HashChangeEvent$1 = 'hashchange';
const HashPathCoders = {
    hashbang: {
        encodePath: (path) => path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path),
        decodePath: (path) => path.charAt(0) === '!' ? path.substr(1) : path
    },
    noslash: {
        encodePath: stripLeadingSlash,
        decodePath: addLeadingSlash
    },
    slash: {
        encodePath: addLeadingSlash,
        decodePath: addLeadingSlash
    }
};
const getHashPath = () => {
    const href = window.location.href;
    const hashIndex = href.indexOf('#');
    return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
};
const pushHashPath = (path) => (window.location.hash = path);
const replaceHashPath = (path) => {
    const hashIndex = window.location.href.indexOf('#');
    window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
};
const createHashHistory = (props = {}) => {
    invariant(canUseDOM, 'Hash history needs a DOM');
    const globalHistory = window.history;
    const canGoWithoutReload = supportsGoWithoutReloadUsingHash();
    const keyLength = (props.keyLength != null) ? props.keyLength : 6;
    const { getUserConfirmation = getConfirmation, hashType = 'slash' } = props;
    const basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
    const { encodePath, decodePath } = HashPathCoders[hashType];
    const getDOMLocation = () => {
        let path = decodePath(getHashPath());
        warning((!basename || hasBasename(path, basename)), 'You are attempting to use a basename on a page whose URL path does not begin ' +
            'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) {
            path = stripBasename(path, basename);
        }
        return createLocation(path, undefined, createKey(keyLength));
    };
    const transitionManager = createTransitionManager();
    const setState = (nextState) => {
        Object.assign(history, nextState);
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
    };
    let forceNextPop = false;
    let ignorePath = null;
    const handleHashChange = () => {
        const path = getHashPath();
        const encodedPath = encodePath(path);
        if (path !== encodedPath) {
            replaceHashPath(encodedPath);
        }
        else {
            const location = getDOMLocation();
            const prevLocation = history.location;
            if (!forceNextPop && locationsAreEqual(prevLocation, location)) {
                return;
            }
            if (ignorePath === createPath(location)) {
                return;
            }
            ignorePath = null;
            handlePop(location);
        }
    };
    const handlePop = (location) => {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        }
        else {
            const action = 'POP';
            transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
                if (ok) {
                    setState({ action, location });
                }
                else {
                    revertPop(location);
                }
            });
        }
    };
    const revertPop = (fromLocation) => {
        const toLocation = history.location;
        let toIndex = allPaths.lastIndexOf(createPath(toLocation));
        if (toIndex === -1) {
            toIndex = 0;
        }
        let fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
        if (fromIndex === -1) {
            fromIndex = 0;
        }
        const delta = toIndex - fromIndex;
        if (delta) {
            forceNextPop = true;
            go(delta);
        }
    };
    const path = getHashPath();
    const encodedPath = encodePath(path);
    if (path !== encodedPath) {
        replaceHashPath(encodedPath);
    }
    const initialLocation = getDOMLocation();
    let allPaths = [createPath(initialLocation)];
    const createHref = (location) => ('#' + encodePath(basename + createPath(location)));
    const push = (path, state) => {
        warning(state === undefined, 'Hash history cannot push state; it is ignored');
        const action = 'PUSH';
        const location = createLocation(path, undefined, createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const path = createPath(location);
            const encodedPath = encodePath(basename + path);
            const hashChanged = getHashPath() !== encodedPath;
            if (hashChanged) {
                ignorePath = path;
                pushHashPath(encodedPath);
                const prevIndex = allPaths.lastIndexOf(createPath(history.location));
                const nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
                nextPaths.push(path);
                allPaths = nextPaths;
                setState({ action, location });
            }
            else {
                warning(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');
                setState();
            }
        });
    };
    const replace = (path, state) => {
        warning(state === undefined, 'Hash history cannot replace state; it is ignored');
        const action = 'REPLACE';
        const location = createLocation(path, undefined, createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const path = createPath(location);
            const encodedPath = encodePath(basename + path);
            const hashChanged = getHashPath() !== encodedPath;
            if (hashChanged) {
                ignorePath = path;
                replaceHashPath(encodedPath);
            }
            const prevIndex = allPaths.indexOf(createPath(history.location));
            if (prevIndex !== -1) {
                allPaths[prevIndex] = path;
            }
            setState({ action, location });
        });
    };
    const go = (n) => {
        warning(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');
        globalHistory.go(n);
    };
    const goBack = () => go(-1);
    const goForward = () => go(1);
    let listenerCount = 0;
    const checkDOMListeners = (delta) => {
        listenerCount += delta;
        if (listenerCount === 1) {
            addEventListener(window, HashChangeEvent$1, handleHashChange);
        }
        else if (listenerCount === 0) {
            removeEventListener(window, HashChangeEvent$1, handleHashChange);
        }
    };
    let isBlocked = false;
    const block = (prompt = '') => {
        const unblock = transitionManager.setPrompt(prompt);
        if (!isBlocked) {
            checkDOMListeners(1);
            isBlocked = true;
        }
        return () => {
            if (isBlocked) {
                isBlocked = false;
                checkDOMListeners(-1);
            }
            return unblock();
        };
    };
    const listen = (listener) => {
        const unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(1);
        return () => {
            checkDOMListeners(-1);
            unlisten();
        };
    };
    const history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref,
        push,
        replace,
        go,
        goBack,
        goForward,
        block,
        listen
    };
    return history;
};

var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getLocation(location, root) {
    const pathname = location.pathname.indexOf(root) == 0 ?
        "/" + location.pathname.slice(root.length) :
        location.pathname;
    return Object.assign({}, location, { pathname });
}
const HISTORIES = {
    "browser": createBrowserHistory,
    "hash": createHashHistory
};
class Router {
    constructor() {
        this.root = "/";
        this.historyType = "browser";
        this.titleSuffix = "";
        this.routeViewsUpdated = (options = {}) => {
            if (options.scrollToId && this.historyType === "browser") {
                const element = document.getElementById(options.scrollToId);
                if (element) {
                    return element.scrollIntoView();
                }
            }
            this.scrollTo(options.scrollTopOffset || this.scrollTopOffset);
        };
    }
    componentWillLoad() {
        this.history = HISTORIES[this.historyType]();
        this.history.listen((location) => __awaiter$2(this, void 0, void 0, function* () {
            location = getLocation(location, this.root);
            this.location = location;
        }));
        this.location = getLocation(this.history.location, this.root);
    }
    scrollTo(scrollToLocation) {
        if (scrollToLocation == null || this.isServer || !this.history) {
            return;
        }
        if (this.history.action === "POP" && Array.isArray(this.history.location.scrollPosition)) {
            return this.queue.write(() => {
                if (this.history && this.history.location && Array.isArray(this.history.location.scrollPosition)) {
                    window.scrollTo(this.history.location.scrollPosition[0], this.history.location.scrollPosition[1]);
                }
            });
        }
        return this.queue.write(() => {
            window.scrollTo(0, scrollToLocation);
        });
    }
    render() {
        if (!this.location || !this.history) {
            return;
        }
        const state = {
            historyType: this.historyType,
            location: this.location,
            titleSuffix: this.titleSuffix,
            root: this.root,
            history: this.history,
            routeViewsUpdated: this.routeViewsUpdated
        };
        return (h(ActiveRouter.Provider, { state: state }, h("slot", null)));
    }
    static get is() { return "stencil-router"; }
    static get properties() {
        return {
            "history": {
                "state": true
            },
            "historyType": {
                "type": String,
                "attr": "history-type"
            },
            "isServer": {
                "context": "isServer"
            },
            "location": {
                "state": true
            },
            "queue": {
                "context": "queue"
            },
            "root": {
                "type": String,
                "attr": "root"
            },
            "scrollTopOffset": {
                "type": Number,
                "attr": "scroll-top-offset"
            },
            "titleSuffix": {
                "type": String,
                "attr": "title-suffix"
            }
        };
    }
}

export { AppBurger, AppMarked, Enterprise as CapacitorEnterprise, App as CapacitorSite, ContributorList, DocumentComponent, InPageNavigtion as InPageNavigation, LowerContentNav, SiteHeader, Route as StencilRoute, RouteSwitch as StencilRouteSwitch, RouteTitle as StencilRouteTitle, Router as StencilRouter };
