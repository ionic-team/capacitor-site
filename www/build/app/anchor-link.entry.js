const h = window.App.h;

/**
 * Used in the generated doc markup as well as the site, so don't remve this
 * even if it looks like no one is using it
 */
class AnchorLink {
    handleClick(_e) {
        if (document.location.hash !== '#' + this.to) {
            document.location.hash = this.to;
            let scrollTop = document.querySelector('html').scrollTop;
            // Update scroll top to clear the header bar
            window.scrollTo(0, scrollTop - 80);
        }
        else {
            document.location.hash = '';
            document.location.hash = this.to;
        }
    }
    render() {
        return (h("div", { onClick: this.handleClick.bind(this) },
            h("slot", null)));
    }
    static get is() { return "anchor-link"; }
    static get properties() { return {
        "to": {
            "type": String,
            "attr": "to"
        }
    }; }
    static get style() { return ":root {\n  --color-woodsmoke: #16161D;\n  --color-dolphin: #626177;\n  --color-gunpowder: #505061;\n  --color-manatee: #8888A2;\n  --color-cadet-blue: #abb2bf;\n  --color-whisper: #EBEBF7;\n  --color-selago: #F4F4FD;\n  --color-white-lilac: #f8f8fc;\n  --color-white: #fff;\n  --color-green-haze: #00AB47;\n  --color-dodger-blue: #1d9aff;\n  --color-dodger-blue-hover: rgba(#1d9aff, 0.2);\n  --color-old-lace: #fdf5e4;\n  --color-wheatfield: #F1E3C5;\n  --color-pirate-gold: #9A6400;\n  --button-shadow: 0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);\n  --button-shadow-hover: 0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);\n  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);\n}\n\nanchor-link {\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\nanchor-link.hover-anchor {\n  position: absolute;\n  margin-left: -25px;\n  color: #d6d1d1;\n}\n\n.anchor-link-relative {\n  position: relative;\n}\n\n.anchor-link-relative {\n  position: relative;\n}\n\n\@media screen and (max-width: 768px) {\n  anchor-link.hover-anchor {\n    margin-left: -18px;\n  }\n}"; }
}

export { AnchorLink };
