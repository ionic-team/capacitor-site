const h = window.App.h;

class LandingPage {
    constructor() {
        let root = document.querySelector('capacitor-site');
        root.isLandingPage = true;
        document.title = `Capacitor: Universal Web Applications`;
    }
    componentDidUnload() {
        let root = document.querySelector('capacitor-site');
        root.isLandingPage = false;
    }
    render() {
        return [
            h("div", { class: "container" },
                h("section", { class: "hero" },
                    h("hgroup", null,
                        h("h1", { id: "action-call" }, "The Native Bridge for Cross-Platform Web Apps"),
                        h("h3", null, "Invoke Native SDKs on iOS, Android, and the Web with one code base. Optimized for Ionic Framework apps, or use with any web app framework."),
                        h("stencil-route-link", { url: "/docs/getting-started/" },
                            h("button", { id: "get-started" }, "Get Started")),
                        h("h5", null, "Supports"),
                        h("img", { alt: "Apple, Android, PWA", src: "/assets/img/supported-env.png" })),
                    h("div", { class: "hero-illustration" },
                        h("img", { src: "/assets/img/capacitor-hero.jpg" }))),
                h("section", { class: "points" },
                    h("div", { class: "points__item points__item--crossplatform" },
                        h("h2", null, "Cross Platform"),
                        h("p", null, "Build web apps that run equally well on iOS, Android, and as Progressive Web Apps")),
                    h("div", { class: "points__item points__item--nativeaccess" },
                        h("h2", null, "Native Access"),
                        h("p", null, "Access the full Native SDK on each platform, and easily deploy to App Stores (and the web!)")),
                    h("div", { class: "points__item points__item--simple" },
                        h("h2", null, "Use with Ionic"),
                        h("p", null, "Capacitor provides native functionality for web apps, and is optimized for Ionic Framework")),
                    h("div", { class: "points__item points__item--webnative" },
                        h("h2", null, "Web Native"),
                        h("p", null,
                            "Build apps with standardized web technologies that will work for decades, and easily reach users on the app stores ",
                            h("i", null, "and"),
                            " the mobile web.")),
                    h("div", { class: "points__item points__item--extensible" },
                        h("h2", null, "Extensible"),
                        h("p", null, "Easily add custom native functionality with a simple Plugin API, or use existing Cordova plugins with our compatibility layer.")),
                    h("div", { class: "points__item points__item--opensource" },
                        h("h2", null, "Open Source"),
                        h("p", null,
                            "Capacitor is completely open source (MIT) and maintained by ",
                            h("a", { href: "http://ionicframework.com/" }, "Ionic"),
                            " and its community.")))),
            h("newsletter-signup", null)
        ];
    }
    static get is() { return "landing-page"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        }
    }; }
    static get style() { return ":root {\n  --color-woodsmoke: #16161D;\n  --color-dolphin: #626177;\n  --color-gunpowder: #505061;\n  --color-manatee: #8888A2;\n  --color-cadet-blue: #abb2bf;\n  --color-whisper: #EBEBF7;\n  --color-selago: #F4F4FD;\n  --color-white-lilac: #f8f8fc;\n  --color-white: #fff;\n  --color-green-haze: #00AB47;\n  --color-dodger-blue: #1d9aff;\n  --color-dodger-blue-hover: rgba(#1d9aff, 0.2);\n  --color-old-lace: #fdf5e4;\n  --color-wheatfield: #F1E3C5;\n  --color-pirate-gold: #9A6400;\n  --button-shadow: 0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);\n  --button-shadow-hover: 0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);\n  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\n.landing-page {\n  background-color: #070D12;\n}\n\n.landing-page footer {\n  background-color: #0B1A24;\n}\n\nlanding-page {\n  display: block;\n  color: #fff;\n  overflow: hidden;\n}\nlanding-page h1,\nlanding-page h2,\nlanding-page h3 {\n  color: #fff;\n  margin: 0;\n}\nlanding-page p {\n  color: #BCC0BE;\n}\nlanding-page .announcement a {\n  text-decoration: none;\n  color: #fff;\n  -webkit-transition: background 0.3s;\n  transition: background 0.3s;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n  align-items: center;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 100px;\n  padding: 5px;\n  border: 0;\n}\nlanding-page .announcement a:hover {\n  background: rgba(255, 255, 255, 0.15);\n}\nlanding-page .announcement .pill,\nlanding-page .announcement .cta {\n  font-size: 10px;\n  text-transform: uppercase;\n}\nlanding-page .announcement .pill {\n  background-color: #FDBF00;\n  color: #653D00;\n  font-weight: 800;\n  padding: 2px 6px;\n  border-radius: 100px;\n  -ms-flex: 0 0 38px;\n  flex: 0 0 38px;\n  text-align: center;\n}\nlanding-page .announcement .message {\n  font-weight: 500;\n  opacity: 0.8;\n  font-size: 13px;\n  margin: 0 14px;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n}\nlanding-page .announcement .cta {\n  color: #FDBF00;\n  font-weight: 600;\n  padding-right: 4px;\n  -ms-flex: 0 0 76px;\n  flex: 0 0 76px;\n}\nlanding-page .announcement .icon {\n  fill: #FDBF00;\n  height: 9px;\n  width: 8px;\n  -webkit-transform: translateY(1.5px);\n  transform: translateY(1.5px);\n  margin-left: 2px;\n}\n\@media screen and (max-width: 768px) {\n  landing-page .announcement {\n    max-width: 100%;\n    padding: 0;\n  }\n  landing-page .announcement a {\n    display: -ms-flexbox;\n    display: flex;\n    width: 100%;\n    border-radius: 0;\n    padding: 12px 24px;\n  }\n  landing-page .announcement .message {\n    -ms-flex: 1;\n    flex: 1;\n  }\n  landing-page .announcement .cta {\n    -ms-flex: 0 0 70px;\n    flex: 0 0 70px;\n    padding-right: 0;\n  }\n}\nlanding-page .hero {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\nlanding-page .hero hgroup,\nlanding-page .hero .hero-illustration {\n  -ms-flex: 0 0 50%;\n  flex: 0 0 50%;\n}\nlanding-page .hero hgroup {\n  max-width: 490px;\n  padding-right: 60px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-pack: center;\n  justify-content: center;\n}\nlanding-page .hero hgroup h1 {\n  font-size: 36px;\n  color: #FFFFFF;\n  letter-spacing: -0.03em;\n  line-height: 48px;\n  font-weight: 500;\n  margin-top: -40px;\n}\nlanding-page .hero hgroup h3 {\n  font-size: 20px;\n  color: rgba(229, 238, 255, 0.8);\n  letter-spacing: -0.02em;\n  line-height: 29px;\n  margin-top: 18px;\n  font-weight: 400;\n}\nlanding-page .hero hgroup button {\n  margin-top: 32px;\n}\nlanding-page .hero hgroup h5 {\n  font-size: 10px;\n  color: #8C9CAA;\n  letter-spacing: 0.38px;\n  line-height: 29px;\n  text-transform: uppercase;\n  margin-bottom: 0;\n  margin-top: 26px;\n}\nlanding-page .hero hgroup img {\n  width: 141px;\n}\nlanding-page .hero .hero-illustration {\n  text-align: right;\n  padding-top: 60px;\n  padding-bottom: 40px;\n}\nlanding-page .hero .hero-illustration img {\n  width: 100%;\n  max-width: 506px;\n  min-width: 420px;\n  margin-right: -42px;\n  margin-top: -20px;\n}\n\@media screen and (max-width: 1120px) {\n  landing-page .hero .hero-illustration img {\n    margin-right: 0;\n  }\n}\n\@media screen and (max-width: 768px) {\n  landing-page .hero hgroup {\n    text-align: center;\n    margin: 0 auto;\n    padding: 60px 0;\n    -ms-flex: 0 0 100%;\n    flex: 0 0 100%;\n    -ms-flex-align: center;\n    align-items: center;\n  }\n  landing-page .hero hgroup h1 {\n    margin-top: 0;\n  }\n  landing-page .hero .hero-illustration {\n    display: none;\n  }\n}\n\@media screen and (max-width: 480px) {\n  landing-page .hero hgroup h1 {\n    font-size: 32px;\n    line-height: 43px;\n  }\n  landing-page .hero hgroup h3 {\n    font-size: 18px;\n    line-height: 26px;\n  }\n}\nlanding-page #get-started {\n  background: #4CAFFF;\n  color: white;\n}\nlanding-page #get-started:hover {\n  background: #33a4ff;\n}\nlanding-page #get-started:focus {\n  background: #1e9aff;\n  -webkit-transform: translateY(0px);\n  transform: translateY(0px);\n}\nlanding-page .points {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  margin-left: -2em;\n  margin-right: -2em;\n  margin-bottom: 60px;\n}\nlanding-page .points__item {\n  -ms-flex: 0 0 33.33%;\n  flex: 0 0 33.33%;\n  position: relative;\n  padding: 0px 2em;\n  margin-bottom: 60px;\n}\nlanding-page .points__item a {\n  color: #fff;\n  text-decoration: none;\n}\nlanding-page .points__item a:hover {\n  border-bottom-color: rgba(255, 255, 255, 0.3);\n}\nlanding-page .points__item h2 {\n  margin-top: 20px;\n  font-size: 16px;\n}\nlanding-page .points__item p {\n  margin-top: 10px;\n  font-weight: 400;\n  font-size: 15px;\n  letter-spacing: -0.02em;\n  line-height: 28px;\n  color: rgba(225, 241, 255, 0.8);\n}\nlanding-page .points__item:before {\n  content: \"\";\n  display: block;\n  background: url(/assets/img/feature-icon-sprite.png) no-repeat transparent;\n  width: 51px;\n  height: 51px;\n  background-size: 306px 51px;\n  margin-bottom: 0.3em;\n}\n\@media screen and (max-width: 768px) {\n  landing-page .points__item {\n    -ms-flex: 0 0 50%;\n    flex: 0 0 50%;\n  }\n}\n\@media screen and (max-width: 480px) {\n  landing-page .points__item {\n    margin-bottom: 20px;\n    -ms-flex: 0 0 100%;\n    flex: 0 0 100%;\n  }\n}\nlanding-page .points__item--nativeaccess:before {\n  background-position: -51px 0;\n}\nlanding-page .points__item--opensource:before {\n  background-position: -102px 0;\n}\nlanding-page .points__item--webnative:before {\n  background-position: -153px 0;\n}\nlanding-page .points__item--extensible:before {\n  background-position: -204px 0;\n}\nlanding-page .points__item--simple:before {\n  background-position: -255px 0;\n}\nlanding-page .footer-landing {\n  background: #151a23;\n  margin-top: 0;\n}"; }
}

class NewsletterSignup {
    render() {
        return (h("section", { class: "newsletter" },
            h("div", { class: "container" },
                h("hgroup", null,
                    h("h2", null, "Subscribe to our newsletter"),
                    h("p", null, "The latest Capacitor news and resources sent straight to your inbox.")),
                h("form", { action: "https://codiqa.createsend.com/t/t/s/flhuhj/", method: "post" },
                    h("div", { class: "input-with-button" },
                        h("input", { "aria-label": "Email address", type: "email", placeholder: "Email address", id: "fieldEmail", name: "cm-flhuhj-flhuhj", required: true }),
                        h("button", { type: "submit" }, "Subscribe"))))));
    }
    static get is() { return "newsletter-signup"; }
    static get style() { return ":root {\n  --color-woodsmoke: #16161D;\n  --color-dolphin: #626177;\n  --color-gunpowder: #505061;\n  --color-manatee: #8888A2;\n  --color-cadet-blue: #abb2bf;\n  --color-whisper: #EBEBF7;\n  --color-selago: #F4F4FD;\n  --color-white-lilac: #f8f8fc;\n  --color-white: #fff;\n  --color-green-haze: #00AB47;\n  --color-dodger-blue: #1d9aff;\n  --color-dodger-blue-hover: rgba(#1d9aff, 0.2);\n  --color-old-lace: #fdf5e4;\n  --color-wheatfield: #F1E3C5;\n  --color-pirate-gold: #9A6400;\n  --button-shadow: 0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);\n  --button-shadow-hover: 0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);\n  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\n.newsletter {\n  background-color: #eeeff1;\n  padding: 80px 0;\n}\n.newsletter .container {\n  display: -ms-flexbox;\n  display: flex;\n}\n.newsletter form {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n}\n.newsletter hgroup {\n  -ms-flex: 0 0 60%;\n  flex: 0 0 60%;\n  padding-right: 40px;\n}\n.newsletter hgroup h2 {\n  margin: 0 0 6px;\n}\n.newsletter hgroup p {\n  margin: 0;\n  line-height: 23px;\n}\n.newsletter form {\n  -ms-flex: 0 0 40%;\n  flex: 0 0 40%;\n}\n.newsletter form input {\n  padding: 5px 10px 5px 16px;\n  width: 200px;\n  min-height: calc(100% - 1px);\n  background-color: #fff;\n  border: none;\n  border-radius: 6px;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  font-size: 16px;\n  font-weight: 400;\n  color: #070D12;\n  letter-spacing: -0.22px;\n}\n.newsletter form button {\n  background-color: #5EB6FC;\n  color: white;\n  border-radius: 6px;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.newsletter form button:hover {\n  background: #33a4ff;\n}\n.newsletter form button:focus {\n  background: #1e9aff;\n}\n\@media screen and (max-width: 768px) {\n  .newsletter .container {\n    -ms-flex-direction: column;\n    flex-direction: column;\n    text-align: center;\n    -ms-flex-align: center;\n    align-items: center;\n    -ms-flex-pack: justify;\n    justify-content: space-between;\n  }\n  .newsletter hgroup,\n.newsletter form {\n    -ms-flex: 0 0 100%;\n    flex: 0 0 100%;\n  }\n  .newsletter hgroup {\n    padding: 0;\n  }\n  .newsletter form {\n    margin-top: 24px;\n    width: 100%;\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n}\n\n.landing-page .newsletter {\n  background-color: #102331;\n}"; }
}

export { LandingPage, NewsletterSignup };
