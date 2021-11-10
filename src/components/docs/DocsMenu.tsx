import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { docsVersionHref } from '../../../routing';
import { TableOfContents } from '../../markdown/types';
import { DocsTemplate } from '../../pages/docs/data';
import DocsMenuStyles from './DocsMenu.styles';
import VersionSelect from './VersionSelect';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  template: DocsTemplate;
  toc: TableOfContents;
  activePath: string;
}
const DocsMenu: React.FC<Props> = ({ template, toc, activePath }) => {
  const router = useRouter();

  const [expands, setExpands] = useState<{ [key: string]: number[] }>({
    docs: [],
    plugins: [2],
    cli: [1],
  });

  const [showOverlay, setShowOverlay] = useState(false);

  const toggleOverlayMenu = useCallback(() => {
    setShowOverlay(!showOverlay);
  }, [showOverlay]);

  useEffect(() => {
    expandActive();
  }, [template, activePath]);

  const expandActive = () => {
    if (toc?.root) {
      const activeIndex = toc.root.findIndex((t) => t.children && t.children.some((c) => c.url === activePath));
      if (activeIndex > -1 && !expands[template].includes(activeIndex)) {
        setExpands({
          ...expands,
          [template]: [...expands[template], activeIndex],
        });
      }
    }
  };

  const toggleParent = (itemNumber: number) => {
    return (e: MouseEvent) => {
      e.preventDefault();

      if (expands[template].includes(itemNumber)) {
        expands[template].splice(expands[template].indexOf(itemNumber), 1);
      } else {
        expands[template] = [...expands[template], itemNumber];
      }
      setExpands({ ...expands });
    };
  };

  return (
    <DocsMenuStyles
      className={clsx({
        'menu-overlay-visible': showOverlay,
      })}
    >
      <aside className="sticky">
        <div>
          <div className="menu-header">
            <Link href="/">
              <a className="menu-header__logo-link">{capacitorLogo()}</a>
            </Link>
            <Link href={docsVersionHref(router.pathname, '/docs')}>
              <a className="menu-header__docs-link">Docs</a>
            </Link>
            <VersionSelect />
          </div>
          <ul className="menu-list">
            {toc?.root.map((item, i) => {
              const isActive = item.url === activePath;
              const expanded = expands[template].includes(i);

              if (item.children && item.children.length > 0) {
                return (
                  <li className={clsx({ collapsed: !expanded })}>
                    <a
                      href={
                        /* href only for no-js, otherwise it'll toggle w/out navigating */
                        item.children[0].url
                      }
                      onClick={() => toggleParent(i)}
                    >
                      <ion-icon name={expanded ? 'chevron-down' : 'chevron-forward'} />
                      <span className="section-label">{item.text}</span>
                    </a>
                    <ul>
                      {item.children.map((childItem) => {
                        return (
                          <li>
                            {childItem.url ? (
                              <Link href={childItem.url}>
                                <a
                                  className={clsx({
                                    'link-active': childItem.url === activePath,
                                  })}
                                >
                                  <span className="bump-up">{childItem.text}</span>
                                </a>
                              </Link>
                            ) : (
                              <a rel="noopener" className="link--external" target="_blank" href="#">
                                {childItem.text}
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }

              return (
                <li>
                  {item.url ? (
                    <Link href={item.url}>
                      <a
                        className={clsx({
                          'section-active': isActive,
                        })}
                      >
                        <span className="section-active-indicator" />
                        <span className="section-label">{item.text}</span>
                      </a>
                    </Link>
                  ) : (
                    <a rel="noopener" className="link--external" target="_blank" href="#">
                      {item.text}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </DocsMenuStyles>
  );
};

const capacitorLogo = () => (
  <svg width="130" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M55.36 6.03v12.84h-3.22V17.3c-.8 1.17-2.26 1.86-4.08 1.86-3.73 0-5.92-2.99-5.92-6.7 0-3.73 2.19-6.72 5.92-6.72 1.82 0 3.26.69 4.08 1.87V6.04h3.22zM48.8 8.81c-1.94 0-3.17 1.56-3.17 3.64 0 2.09 1.23 3.65 3.17 3.65s3.16-1.56 3.16-3.65c.01-2.08-1.21-3.64-3.16-3.64zM60.1 23.2h-3.49V6.05h3.22v1.57c.8-1.17 2.26-1.87 4.08-1.87 3.73 0 5.92 3 5.92 6.71 0 3.73-2.19 6.71-5.92 6.71a4.73 4.73 0 01-3.8-1.66v5.7zm3.07-7.1c1.94 0 3.17-1.56 3.17-3.65 0-2.08-1.23-3.64-3.17-3.64S60 10.37 60 12.45c0 2.09 1.22 3.65 3.17 3.65zM83.76 6.03v12.84h-3.22V17.3c-.8 1.17-2.26 1.86-4.08 1.86-3.73 0-5.92-2.99-5.92-6.7 0-3.73 2.18-6.72 5.92-6.72 1.82 0 3.26.69 4.08 1.87V6.04h3.22zM77.2 8.81c-1.94 0-3.17 1.56-3.17 3.64 0 2.09 1.23 3.65 3.17 3.65s3.16-1.56 3.16-3.65c.01-2.08-1.21-3.64-3.16-3.64zM37.92 14.16c-.41 1.11-1.45 1.73-2.73 1.73a3.4 3.4 0 01-3.39-3.44 3.4 3.4 0 013.4-3.43c1.27 0 2.27.54 2.72 1.73h3.5a6.12 6.12 0 00-6.23-5c-3.7 0-6.66 3-6.66 6.7 0 3.71 2.95 6.71 6.66 6.71 3.12 0 5.82-2.19 6.24-5h-3.5zM93.86 14.16c-.41 1.11-1.45 1.73-2.73 1.73a3.4 3.4 0 01-3.38-3.44 3.4 3.4 0 013.38-3.43c1.28 0 2.29.54 2.74 1.73h3.5a6.12 6.12 0 00-6.24-5c-3.7 0-6.66 3-6.66 6.7 0 3.71 2.96 6.71 6.66 6.71 3.12 0 5.82-2.19 6.24-5h-3.5zM97.78 2.9c0-1.22.89-2.1 2.11-2.1 1.23 0 2.12.88 2.12 2.1 0 1.23-.89 2.08-2.12 2.08a2.02 2.02 0 01-2.1-2.08zm.37 3.13h3.49v12.84h-3.5V6.03zM102.95 6.03V2.85h3.49v3.18h2.68v2.84h-2.68v10h-3.5V8.79"
      fill="#000"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M115.34 15.9a3.44 3.44 0 100-6.89 3.44 3.44 0 000 6.88zm0 3.26a6.71 6.71 0 100-13.42 6.71 6.71 0 000 13.42z"
      fill="#000"
    />
    <path
      d="M129.96 9.2s-.36-.07-.67-.07c-2.02 0-3.06 1-3.06 3.36v6.4h-3.46V6.02h3.19V7.7c.46-.76 1.43-1.78 3.59-1.78l.41.03V9.2z"
      fill="#000"
    />
    <path d="M3.74 5.07L.03 8.8l5.72 5.73L0 20.3 3.7 24l5.76-5.77 5.72 5.73 3.71-3.71L3.74 5.07z" fill="#53B9FF" />
    <path d="M13.17 14.52l-3.71 3.71 5.72 5.73 3.71-3.71-5.72-5.73z" fill="#119EFF" />
    <path d="M13.17 14.52l-3.71 3.71 1.43 1.43 2.28-5.14z" fill="#000" fill-opacity=".2" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.24 9.47L24 3.7 20.29 0l-5.76 5.75L8.8.03 5.1 3.74l15.15 15.18 3.7-3.72-5.7-5.73z"
      fill="#53B9FF"
    />
    <path d="M10.81 9.47l3.72-3.72L8.8.03 5.1 3.74l5.71 5.73z" fill="#119EFF" />
    <path d="M10.81 9.47l3.72-3.72-1.43-1.42-2.29 5.14z" fill="#000" fill-opacity=".2" />
  </svg>
);

export default DocsMenu;
