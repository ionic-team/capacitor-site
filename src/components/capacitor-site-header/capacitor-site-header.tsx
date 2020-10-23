import {
  Element,
  Component,
  ComponentInterface,
  Host,
  Prop,
  State,
  h,  
} from '@stencil/core';
import { href } from '@stencil/router'
import Router, { docsVersionHref } from '../../router';
import { DocsTemplate } from '../../data.server/docs';
import { Button } from '@ionic-internal/ionic-ds';
import { JSXBase } from '@stencil/core/internal';

@Component({
  tag: 'site-header',
  styleUrl: 'capacitor-site-header.scss',
  scoped: true,
})
export class DocsHeader implements ComponentInterface {
  @Element() elm: HTMLElement;
  @Prop() template: DocsTemplate;
  @Prop() includeLogo = true;
  @Prop() includeBurger = false;

  @State() collapsed = false;
  @State() expanded = false;
  @State() scrolled = false;
  
  private links: { [key: string]: HTMLElement } = {};

  componentWillLoad() {
    this.handleActive(globalThis.location.pathname);
    this.createObserver();
  }

  componentWillUpdate() {
    this.handleActive(globalThis.location.pathname);
  }


  createObserver() {
    const opts = {
      root: document.body,
      rootMargin: '-45px 0px 0px 0px',
      threshold: 1.0
    }

    const observer = new IntersectionObserver((entries) => {
      this.scrolled = !(entries[0].intersectionRatio < 1);
    }, opts);

    observer.observe(this.elm);
  }

  handleActive = (path: string) => {
    const activeRoute = path.split('/')[1];

    if (this.links.hasOwnProperty(activeRoute)) {
      for (const [key, value] of Object.entries(this.links)) {
        if (key === activeRoute) {
          value.classList.add('active');
        } else {
          value.classList.remove('active');
        }
      }      
    }
  }

  isActive(path: string): boolean {
    const prefix = new RegExp('^' + path, 'gm');
    const regexRes = prefix.test(Router.path);

    return regexRes;
  }

  toggleExpanded = () => (this.expanded = !this.expanded);

  render() {
    const { expanded, template, includeLogo, includeBurger } = this;

    return (
      <Host
        class={{
          scrolled: this.scrolled,
        }}
      >
        <site-backdrop
          visible={expanded}
          onClick={() => this.toggleExpanded()}
          mobileOnly
        />

        <header>
          {includeLogo
          ? <a {...href('/')}>{capacitorLogo()}</a>
          : null}

          {includeBurger
          ? <app-menu-toggle />
          : null}
          

          <div class="docs-search-wrapper">
            <docs-search />
          </div>
                          
          <nav
            class={{
              routes: true,
              expanded: this.expanded,
            }}
          >
            <div class="routes__header">
              <a class="logo-wrapper" {...href('/')}>
                {capacitorLogo()}
              </a>
              <button class="close" aria-label="close">
                <svg onClick={this.toggleExpanded} width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 9L1 1M9 1L1 9" stroke="#B2BECD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>

            <a
              {...href(docsVersionHref('/docs'))}
              class={{
                'ui-paragraph-4': true,
                active: template === 'docs'
              }}
            >
              Docs
            </a>
            <a
              {...href(docsVersionHref('/docs/plugins'))}
              class={{
                'ui-paragraph-4': true,
                active: template === 'plugins'
              }}
            >
              Plugins
            </a>
            <a
              {...href(docsVersionHref('/docs/cli'))}
              class={{
                'ui-paragraph-4': true,
                active: template === 'cli'
              }}
            >
              CLI
            </a>
            <div class="separator"></div>
            <a
              {...href('/community')}
              class="ui-paragraph-4"
              ref={el => this.links.community = el}
            >Community</a>
            <a
              {...href('/blog')}
              class="ui-paragraph-4"
              ref={el => this.links.blog = el}
            >Blog</a>
            <a 
              class="external | ui-paragraph-4"
              target="_blank"
              href="https://ionicframework.com/native"
              rel="noopener"
            >
              Enterprise
              <svg width="8" height="9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M.5 8l7-7m0 0H2.95M7.5 1v4.55" stroke="#73849A" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </nav>               

          <div class="separator"></div>

          <more-button onClick={() => this.toggleExpanded()} />  

          <div class="ctas">    
            <a href="https://github.com/ionic-team/capacitor" target="_blank" rel="noopener">     
              <svg class="social" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0a7.1 7.1 0 00-7 7.18c0 3.17 2 5.86 4.79 6.8.04.02.08.02.12.02.26 0 .36-.2.36-.36l-.01-1.22a3.2 3.2 0 01-.71.09c-1.35 0-1.65-1.05-1.65-1.05-.32-.83-.78-1.05-.78-1.05-.61-.43 0-.44.04-.44.7.06 1.08.74 1.08.74.35.61.82.79 1.23.79.28 0 .55-.07.8-.2.07-.45.25-.77.45-.95-1.55-.18-3.19-.8-3.19-3.55 0-.78.27-1.42.72-1.92-.07-.18-.31-.91.07-1.9l.16-.02c.25 0 .82.1 1.76.76a6.5 6.5 0 013.51 0c.94-.66 1.52-.76 1.77-.76.05 0 .1 0 .16.02.38.99.14 1.72.06 1.9.45.5.72 1.14.72 1.92 0 2.76-1.64 3.37-3.2 3.54.26.23.48.66.48 1.33v1.97c0 .17.09.36.35.36a.6.6 0 00.12-.01A7.16 7.16 0 0014 7.18 7.1 7.1 0 007 0z" fill="#B2BECD"/>
              </svg>
            </a>   
            <a href="https://twitter.com/capacitorjs" target="_blank" rel="noopener">   
            <svg class="social" width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 1.65885C15.91 1.93958 15.2794 2.12917 14.6149 2.21667C15.293 1.77917 15.8151 1.08646 16.0592 0.2625C15.4252 0.667187 14.7234 0.9625 13.974 1.11927C13.3739 0.430208 12.5195 0 11.5769 0C9.76298 0 8.29487 1.58229 8.29487 3.53281C8.29487 3.8099 8.322 4.07969 8.37963 4.33854C5.65024 4.19271 3.22939 2.78542 1.6121 0.645312C1.33068 1.16667 1.16794 1.77552 1.16794 2.42083C1.16794 3.64583 1.75111 4.72865 2.63266 5.36302C2.09017 5.34844 1.58159 5.18802 1.14081 4.92188V4.96562C1.14081 6.67917 2.27326 8.10469 3.77527 8.42917C3.50064 8.50938 3.20905 8.55313 2.91068 8.55313C2.70047 8.55313 2.49364 8.53125 2.2936 8.4875C2.71064 9.89114 3.92445 10.912 5.36205 10.9411C4.23978 11.8891 2.82253 12.4542 1.28322 12.4542C1.01875 12.4542 0.757682 12.4359 0.5 12.4031C1.94776 13.4167 3.67355 14 5.52479 14C11.5701 14 14.8725 8.6151 14.8725 3.94479C14.8725 3.79167 14.8691 3.63854 14.8624 3.48906C15.5032 2.98958 16.0592 2.36979 16.5 1.65885Z" fill="#B2BECD"/>
            </svg>
            </a>   
            <Button
              class="primary | ui-paragraph-4"
              anchor
              {...href('/docs/getting-started')}
              kind="regular"
              color="cyan"
              size="md"
            >
              <svg width="10" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520.31">
                <path fill="#fff" d="M179.5 167.9l-.2 167.9-57.76-55.44-57.76-55.43-1.72 1.8L48.1 241.3c-6.73 7.03-12.13 13.03-12 13.34.41 1 163.29 157.08 163.92 157.08.62 0 163.46-156.09 163.88-157.09.13-.3-5.27-6.3-12-13.33l-13.96-14.58-1.72-1.8-57.76 55.44-57.76 55.44-.2-167.9L220.3 0h-40.6l-.2 167.9M0 479.69V500h400v-40.62H0v20.3" fill-rule="evenodd"></path>
              </svg>
              Install
            </Button>
          </div>  
        </header>
      </Host>
    );
  }
}

const capacitorLogo = (props?: JSXBase.SVGAttributes) => (
  <svg width="126" height="24" viewBox="0 0 126 24" class="capacitor-logo" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M30 11.8186C30 16.0223 33.0403 19.4133 37.4287 19.4133C41.8457 19.4133 44.0829 16.4147 44.4844 13.8083H41.0885C40.687 15.3777 39.2356 16.4707 37.4 16.4707C34.962 16.4707 33.2066 14.537 33.2066 11.8186C33.2066 9.07214 34.962 7.13842 37.4 7.13842C39.2356 7.13842 40.687 8.23139 41.0885 9.80078H44.4844C44.0829 7.19447 41.8457 4.1958 37.4287 4.1958C33.0403 4.1958 30 7.58682 30 11.8186Z" fill="black"/>
    <path d="M57.1749 7.67557V19.127H54.2309V17.7297C53.4928 18.7757 52.1612 19.3924 50.5007 19.3924C47.0834 19.3924 45.0859 16.7227 45.0859 13.4052C45.0859 10.0798 47.0834 7.41797 50.5007 7.41797C52.1612 7.41797 53.4848 8.02684 54.2309 9.08065V7.68337H57.1749V7.67557ZM51.1745 10.1501C49.4017 10.1501 48.2786 11.5474 48.2786 13.4052C48.2786 15.263 49.4017 16.6603 51.1745 16.6603C52.9474 16.6603 54.0704 15.263 54.0704 13.4052C54.0784 11.5474 52.9554 10.1501 51.1745 10.1501Z" fill="black"/>
    <path d="M61.7701 23H58.5774V7.68337H61.5214V9.08065C62.2594 8.03464 63.591 7.41797 65.2516 7.41797C68.6689 7.41797 70.6663 10.0876 70.6663 13.4052C70.6663 16.7305 68.6689 19.3924 65.2516 19.3924C63.591 19.3924 62.3798 18.6899 61.7701 17.9093V23ZM64.5777 16.6603C66.3506 16.6603 67.4736 15.263 67.4736 13.4052C67.4736 11.5474 66.3506 10.1501 64.5777 10.1501C62.8049 10.1501 61.6818 11.5474 61.6818 13.4052C61.6738 15.263 62.7969 16.6603 64.5777 16.6603Z" fill="black"/>
    <path d="M83.5107 7.67557V19.127H80.5667V17.7297C79.8287 18.7757 78.4971 19.3924 76.8366 19.3924C73.4193 19.3924 71.4219 16.7227 71.4219 13.4052C71.4219 10.0798 73.4193 7.41797 76.8366 7.41797C78.4971 7.41797 79.8207 8.02684 80.5667 9.08065V7.68337H83.5107V7.67557ZM77.5104 10.1501C75.7376 10.1501 74.6146 11.5474 74.6146 13.4052C74.6146 15.263 75.7376 16.6603 77.5104 16.6603C79.2833 16.6603 80.4063 15.263 80.4063 13.4052C80.4143 11.5474 79.2913 10.1501 77.5104 10.1501Z" fill="black"/>
    <path d="M90.3201 7.41797C93.978 7.41797 95.7107 9.93151 95.9353 11.8752H92.6544C92.4057 10.8916 91.4672 10.1735 90.296 10.1735C88.5874 10.1735 87.6007 11.4849 87.6007 13.4052C87.6007 15.3255 88.5874 16.6369 90.296 16.6369C91.4672 16.6369 92.4057 15.9187 92.6544 14.9352H95.9353C95.7107 16.8789 93.978 19.3924 90.3201 19.3924C86.9028 19.3924 84.416 16.8164 84.416 13.4052C84.416 9.99395 86.9028 7.41797 90.3201 7.41797Z" fill="black"/>
    <path d="M96.1829 4.88125C96.1829 3.78841 96.9931 3 98.1161 3C99.2392 3 100.049 3.78841 100.049 4.88125C100.049 5.97409 99.2392 6.73908 98.1161 6.73908C96.9931 6.73908 96.1829 5.97409 96.1829 4.88125ZM96.5198 7.6758H99.7125V19.1272H96.5198V7.6758Z" fill="black"/>
    <path d="M101.14 7.67635V4.83496H104.332V7.67635H106.787V10.2055H104.332V19.1356H101.14V10.1274" fill="black"/>
    <path d="M106.256 13.4052C106.256 10.1501 108.663 7.41797 112.433 7.41797C116.203 7.41797 118.61 10.1501 118.61 13.4052C118.61 16.6603 116.203 19.3924 112.433 19.3924C108.663 19.3924 106.256 16.6603 106.256 13.4052ZM112.433 16.6603C114.118 16.6603 115.417 15.4582 115.417 13.4052C115.417 11.3522 114.118 10.1501 112.433 10.1501C110.748 10.1501 109.449 11.3522 109.449 13.4052C109.449 15.4582 110.748 16.6603 112.433 16.6603Z" fill="black"/>
    <path d="M126 10.5015C126 10.5015 125.667 10.439 125.381 10.439C123.542 10.439 122.582 11.3367 122.582 13.4365V19.1427H119.426V7.67569H122.336V9.15883C122.756 8.47971 123.645 7.56641 125.619 7.56641C125.73 7.56641 126 7.58982 126 7.58982V10.5015Z" fill="black"/>
    <path d="M3.73712 5.07324L0.0291182 8.78592L5.74746 14.5214L0 20.2861L3.6964 24.0004L9.45544 18.2341L15.1833 23.9592L18.8913 20.2465L3.73712 5.07324Z" fill="#53B9FF"/>
    <path d="M13.1735 14.5215L9.45557 18.2341L15.1834 23.9593L18.8914 20.2466L13.1735 14.5215Z" fill="#119EFF"/>
    <path d="M13.1735 14.5215L9.45557 18.2341L10.8868 19.6574L13.1735 14.5215Z" fill="black" fill-opacity="0.2"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2409 9.46736L24 3.70106L20.2904 0L14.533 5.75471L8.80468 0.0291556L5.09668 3.74184L20.2509 18.9151L23.9589 15.2024L18.2409 9.46736Z" fill="#53B9FF"/>
    <path d="M10.815 9.46751L14.533 5.75485L8.80468 0.0292969L5.09668 3.74198L10.815 9.46751Z" fill="#119EFF"/>
    <path d="M10.8149 9.46738L14.5329 5.75473L13.1013 4.33105L10.8149 9.46738Z" fill="black" fill-opacity="0.2"/>
  </svg>
)
