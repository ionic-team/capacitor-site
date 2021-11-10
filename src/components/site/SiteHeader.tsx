// import { DocsTemplate } from "src/data.server/models";
import { Translation } from '../../../icons';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { docsVersionHref } from '../../../routing';
import Button from '../ui/Button';
import SiteHeaderStyles from './SiteHeader.styles';
import SiteBackdrop from './SiteBackdrop';
import DocsSearch from '../docs-search/DocsSearch';
import SiteMenuToggle from './SiteMenuToggle';
import styled from 'styled-components';
import DocsDropdown from '../docs-dropdown/DocsDropdown';

const HEIGHT_ABOVE_BAR = 72;

interface SiteHeaderProps {
  theme?: 'light' | 'dark';
  sticky?: boolean;
  template?: any /* DocsTemplate */;
  includeLogo?: boolean;
  includeBurger?: boolean;
}
const SiteHeader: React.FC<SiteHeaderProps> = ({
  theme = 'light',
  sticky = true,
  template = null,
  includeLogo = true,
  includeBurger = false,
}) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const elm = useRef<HTMLDivElement | null>(null);

  // Could be an announcement banner or platform bar
  // private heightAboveBar = 72;

  useEffect(() => {
    if (!elm.current) {
      return;
    }

    const opts = {
      root: document.body,
      rootMargin: `-${HEIGHT_ABOVE_BAR + 1}px 0px 0px 0px`,
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      setScrolled(!(entries[0].intersectionRatio < 1));
    }, opts);

    observer.observe(elm.current);
  }, [elm.current]);

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  return (
    <SiteHeaderStyles
      ref={elm}
      className={clsx({
        'heading-container': true,
        scrolled: scrolled,
        [`theme--${theme}`]: true,
        sticky: sticky,
      })}
    >
      <SiteBackdrop visible={expanded} onClick={toggleExpanded} mobileOnly={true} />

      <header>
        {includeBurger ? <SiteMenuToggle /> : null}

        {includeLogo ? (
          <Link href="/" aria-label="homepage link">
            <a>{capacitorLogo()}</a>
          </Link>
        ) : null}

        <div className="jobs-wrapper">
          <a
            className="jobs"
            href="https://jobs.lever.co/Ionic/58c0188a-0566-44bb-9de9-38c9fb731165"
            target="_blank"
            rel="noopener"
          >
            <span className="start">
              <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)" fill="#D0FDFF">
                  <path d="M4.4 2.9a.65.65 0 011.22 0l.8 2.25c.07.18.22.33.4.4l2.25.8a.65.65 0 010 1.22l-2.25.8a.65.65 0 00-.4.4l-.8 2.25a.65.65 0 01-1.22 0l-.8-2.25a.65.65 0 00-.4-.4l-2.25-.8a.65.65 0 010-1.22l2.25-.8c.18-.07.33-.22.4-.4l.8-2.25zM9.04 1.2c.15-.4.72-.4.87 0l.29.81c.04.13.14.23.27.28l.8.29c.41.14.41.72 0 .87l-.8.28a.46.46 0 00-.27.28l-.3.8c-.14.41-.71.41-.86 0l-.29-.8a.46.46 0 00-.28-.28l-.8-.28a.46.46 0 010-.87l.8-.3a.46.46 0 00.28-.27l.29-.8zM1.5.48c.1-.3.5-.3.6 0l.24.65c.03.1.1.16.2.2l.65.23c.29.1.29.5 0 .61l-.65.24c-.1.03-.17.1-.2.2l-.23.65c-.1.28-.51.28-.62 0l-.23-.66a.32.32 0 00-.2-.2l-.65-.23a.32.32 0 010-.6l.65-.24c.1-.04.17-.1.2-.2l.23-.65z" />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <path fill="#fff" d="M0 0h12v12H0z" />
                  </clipPath>
                </defs>
              </svg>
              Ionic is hiring
            </span>
            <span className="end">
              Join the Capacitor team
              <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" width="14" height="12" viewBox="0 0 512 512">
                <title>Arrow Forward</title>
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="48"
                  d="M268 112l144 144-144 144M392 256H100"
                />
              </svg>
            </span>
          </a>
        </div>

        <div className="docs-search-wrapper desktop-only">
          <DocsSearch theme={theme} />
        </div>

        <Link href={docsVersionHref(router.pathname, '/docs')}>
          <a
            className={clsx({
              'ui-paragraph-4': true,
              active: template === 'docs',
            })}
          >
            Docs
          </a>
        </Link>
        <Link href={docsVersionHref(router.pathname, '/docs/plugins')}>
          <a
            className={clsx({
              'ui-paragraph-4': true,
              active: template === 'plugins',
            })}
          >
            Plugins
          </a>
        </Link>
        <Link href={docsVersionHref(router.pathname, '/docs/cli')}>
          <a
            className={clsx({
              'ui-paragraph-4': true,
              active: template === 'cli',
            })}
          >
            CLI
          </a>
        </Link>

        <div className="separator desktop-only"></div>

        <nav
          className={clsx({
            routes: true,
            expanded: expanded,
          })}
        >
          <div className="routes__header">
            <Link href="/">
              <a aria-label="homepage link" className="logo-wrapper">
                {capacitorLogo()}
              </a>
            </Link>
            <button className="close" aria-label="close">
              <svg onClick={toggleExpanded} width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 9L1 1M9 1L1 9"
                  stroke="#B2BECD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="docs-search-wrapper mobile-only">
            <DocsSearch />
          </div>
          <Link href="/community">
            <a
              className={clsx({
                'ui-paragraph-4': true,
                active: router.pathname === '/community',
              })}
            >
              Community
            </a>
          </Link>
          <a
            className={clsx({
              'ui-paragraph-4': true,
              active: router.pathname === '/blog',
            })}
          >
            Blog
          </a>
          <Link href="/enterprise">
            <a
              className={clsx({
                'ui-paragraph-4': true,
                active: router.pathname === '/enterprise',
              })}
            >
              Enterprise
            </a>
          </Link>
        </nav>

        <div className="separator desktop-only"></div>

        <MoreButton onClick={() => toggleExpanded()} />

        <div className="ctas">
          <DocsDropdown icon={Translation} align="right" className="label-sm-only">
            <section>
              <a href="https://capacitorjs.com/" className="link-active">
                English
                <svg viewBox="0 0 512 512" width="14">
                  <path d="M186.301 339.893L96 249.461l-32 30.507L186.301 402 448 140.506 416 110z"></path>
                </svg>
              </a>
              <a href="https://capacitorjs.jp/" target="_blank">
                日本語
              </a>
            </section>
          </DocsDropdown>

          <a href="https://github.com/ionic-team/capacitor" target="_blank" rel="noopener">
            <svg className="social" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7 0a7.1 7.1 0 00-7 7.18c0 3.17 2 5.86 4.79 6.8.04.02.08.02.12.02.26 0 .36-.2.36-.36l-.01-1.22a3.2 3.2 0 01-.71.09c-1.35 0-1.65-1.05-1.65-1.05-.32-.83-.78-1.05-.78-1.05-.61-.43 0-.44.04-.44.7.06 1.08.74 1.08.74.35.61.82.79 1.23.79.28 0 .55-.07.8-.2.07-.45.25-.77.45-.95-1.55-.18-3.19-.8-3.19-3.55 0-.78.27-1.42.72-1.92-.07-.18-.31-.91.07-1.9l.16-.02c.25 0 .82.1 1.76.76a6.5 6.5 0 013.51 0c.94-.66 1.52-.76 1.77-.76.05 0 .1 0 .16.02.38.99.14 1.72.06 1.9.45.5.72 1.14.72 1.92 0 2.76-1.64 3.37-3.2 3.54.26.23.48.66.48 1.33v1.97c0 .17.09.36.35.36a.6.6 0 00.12-.01A7.16 7.16 0 0014 7.18 7.1 7.1 0 007 0z"
                fill="#B2BECD"
              />
            </svg>
          </a>
          <a href="https://twitter.com/capacitorjs" target="_blank" rel="noopener">
            <svg
              className="social"
              width="17"
              height="14"
              viewBox="0 0 17 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 1.65885C15.91 1.93958 15.2794 2.12917 14.6149 2.21667C15.293 1.77917 15.8151 1.08646 16.0592 0.2625C15.4252 0.667187 14.7234 0.9625 13.974 1.11927C13.3739 0.430208 12.5195 0 11.5769 0C9.76298 0 8.29487 1.58229 8.29487 3.53281C8.29487 3.8099 8.322 4.07969 8.37963 4.33854C5.65024 4.19271 3.22939 2.78542 1.6121 0.645312C1.33068 1.16667 1.16794 1.77552 1.16794 2.42083C1.16794 3.64583 1.75111 4.72865 2.63266 5.36302C2.09017 5.34844 1.58159 5.18802 1.14081 4.92188V4.96562C1.14081 6.67917 2.27326 8.10469 3.77527 8.42917C3.50064 8.50938 3.20905 8.55313 2.91068 8.55313C2.70047 8.55313 2.49364 8.53125 2.2936 8.4875C2.71064 9.89114 3.92445 10.912 5.36205 10.9411C4.23978 11.8891 2.82253 12.4542 1.28322 12.4542C1.01875 12.4542 0.757682 12.4359 0.5 12.4031C1.94776 13.4167 3.67355 14 5.52479 14C11.5701 14 14.8725 8.6151 14.8725 3.94479C14.8725 3.79167 14.8691 3.63854 14.8624 3.48906C15.5032 2.98958 16.0592 2.36979 16.5 1.65885Z"
                fill="#B2BECD"
              />
            </svg>
          </a>
          <Button
            className="primary | ui-paragraph-4"
            anchor
            href="/docs/getting-started"
            kind="regular"
            color="cyan"
            buttonSize="md"
          >
            <svg width="10" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520.31">
              <path
                fill="#fff"
                d="M179.5 167.9l-.2 167.9-57.76-55.44-57.76-55.43-1.72 1.8L48.1 241.3c-6.73 7.03-12.13 13.03-12 13.34.41 1 163.29 157.08 163.92 157.08.62 0 163.46-156.09 163.88-157.09.13-.3-5.27-6.3-12-13.33l-13.96-14.58-1.72-1.8-57.76 55.44-57.76 55.44-.2-167.9L220.3 0h-40.6l-.2 167.9M0 479.69V500h400v-40.62H0v20.3"
                fillRule="evenodd"
              ></path>
            </svg>
            Install
          </Button>
        </div>
      </header>
    </SiteHeaderStyles>
  );
};

const capacitorLogo = (props?: any) => (
  <svg className="capacitor-logo" width="130" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M55.36 6.03v12.84h-3.22V17.3c-.8 1.17-2.26 1.86-4.08 1.86-3.73 0-5.92-2.99-5.92-6.7 0-3.73 2.19-6.72 5.92-6.72 1.82 0 3.26.69 4.08 1.87V6.04h3.22zM48.8 8.81c-1.94 0-3.17 1.56-3.17 3.64 0 2.09 1.23 3.65 3.17 3.65s3.16-1.56 3.16-3.65c.01-2.08-1.21-3.64-3.16-3.64zM60.1 23.2h-3.49V6.05h3.22v1.57c.8-1.17 2.26-1.87 4.08-1.87 3.73 0 5.92 3 5.92 6.71 0 3.73-2.19 6.71-5.92 6.71a4.73 4.73 0 01-3.8-1.66v5.7zm3.07-7.1c1.94 0 3.17-1.56 3.17-3.65 0-2.08-1.23-3.64-3.17-3.64S60 10.37 60 12.45c0 2.09 1.22 3.65 3.17 3.65zM83.76 6.03v12.84h-3.22V17.3c-.8 1.17-2.26 1.86-4.08 1.86-3.73 0-5.92-2.99-5.92-6.7 0-3.73 2.18-6.72 5.92-6.72 1.82 0 3.26.69 4.08 1.87V6.04h3.22zM77.2 8.81c-1.94 0-3.17 1.56-3.17 3.64 0 2.09 1.23 3.65 3.17 3.65s3.16-1.56 3.16-3.65c.01-2.08-1.21-3.64-3.16-3.64zM37.92 14.16c-.41 1.11-1.45 1.73-2.73 1.73a3.4 3.4 0 01-3.39-3.44 3.4 3.4 0 013.4-3.43c1.27 0 2.27.54 2.72 1.73h3.5a6.12 6.12 0 00-6.23-5c-3.7 0-6.66 3-6.66 6.7 0 3.71 2.95 6.71 6.66 6.71 3.12 0 5.82-2.19 6.24-5h-3.5zM93.86 14.16c-.41 1.11-1.45 1.73-2.73 1.73a3.4 3.4 0 01-3.38-3.44 3.4 3.4 0 013.38-3.43c1.28 0 2.29.54 2.74 1.73h3.5a6.12 6.12 0 00-6.24-5c-3.7 0-6.66 3-6.66 6.7 0 3.71 2.96 6.71 6.66 6.71 3.12 0 5.82-2.19 6.24-5h-3.5zM97.78 2.9c0-1.22.89-2.1 2.11-2.1 1.23 0 2.12.88 2.12 2.1 0 1.23-.89 2.08-2.12 2.08a2.02 2.02 0 01-2.1-2.08zm.37 3.13h3.49v12.84h-3.5V6.03zM102.95 6.03V2.85h3.49v3.18h2.68v2.84h-2.68v10h-3.5V8.79"
      fill="#000"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M115.34 15.9a3.44 3.44 0 100-6.89 3.44 3.44 0 000 6.88zm0 3.26a6.71 6.71 0 100-13.42 6.71 6.71 0 000 13.42z"
      fill="#000"
    />
    <path
      d="M129.96 9.2s-.36-.07-.67-.07c-2.02 0-3.06 1-3.06 3.36v6.4h-3.46V6.02h3.19V7.7c.46-.76 1.43-1.78 3.59-1.78l.41.03V9.2z"
      fill="#000"
    />
    <path d="M3.74 5.07L.03 8.8l5.72 5.73L0 20.3 3.7 24l5.76-5.77 5.72 5.73 3.71-3.71L3.74 5.07z" fill="#53B9FF" />
    <path d="M13.17 14.52l-3.71 3.71 5.72 5.73 3.71-3.71-5.72-5.73z" fill="#119EFF" />
    <path d="M13.17 14.52l-3.71 3.71 1.43 1.43 2.28-5.14z" fill="#000" fillOpacity=".2" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.24 9.47L24 3.7 20.29 0l-5.76 5.75L8.8.03 5.1 3.74l15.15 15.18 3.7-3.72-5.7-5.73z"
      fill="#53B9FF"
    />
    <path d="M10.81 9.47l3.72-3.72L8.8.03 5.1 3.74l5.71 5.73z" fill="#119EFF" />
    <path d="M10.81 9.47l3.72-3.72-1.43-1.42-2.29 5.14z" fill="#000" fillOpacity=".2" />
  </svg>
);

interface MoreButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
}
const MoreButton: React.FC<MoreButtonProps> = ({ icon = 'ellipsis-vertical' }) => (
  <MoreButtonStyles className="more-button">
    <button>
      <ion-icon icon={icon} />
    </button>
  </MoreButtonStyles>
);
const MoreButtonStyles = styled.div`
  height: 32px;
  width: 32px;

  button {
    height: 100%;
    width: 100%;

    font-size: 20px;

    background: transparent;
    border: none;
    outline: none;

    cursor: pointer;

    transition: opacity 0.2s ease-out;

    ion-icon {
      color: var(--color, black);
    }

    &:hover {
      opacity: 0.4;
    }
  }
`;

export default SiteHeader;
