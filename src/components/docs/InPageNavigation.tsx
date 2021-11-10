import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { HeadingData } from '../../markdown/types';
import Heading from '../ui/Heading';
import InternalAd from './InternalAd';

interface ItemOffset {
  id: string;
  topOffset: number;
}

interface Props {
  headings: HeadingData[];
  editUrl: string;
  editApiUrl: string;
  url: string;
}

const InPageNavigtion: React.FC<Props> = ({ headings = [], editUrl = '', editApiUrl = '', url = '' }) => {
  const [itemOffsets, setItemOffsets] = useState<ItemOffset[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isPluginPage = url.includes('/v3/apis/');

  const hs = headings.filter((heading) => heading.level !== 1);
  const h1 = headings.find((heading) => heading.level === 1);

  const submitEditLinks = (
    <div className="submit-edit">
      <div className="submit-edit__title">{ghIcon()} Submit an edit:</div>
      <ul className="edit-links">
        {editUrl && (
          <li>
            <a target="_blank" rel="noopener" href={editUrl}>
              Readme
            </a>
          </li>
        )}
        {editApiUrl && (
          <li>
            <a target="_blank" rel="noopener" href={editApiUrl}>
              API
            </a>
          </li>
        )}
      </ul>
    </div>
  );

  const submitEditLink = editUrl ? (
    <div className="submit-edit">
      <a className="submit-edit__title link" rel="noopener" target="_blank" href={editUrl}>
        {ghIcon()} Submit an edit
      </a>
    </div>
  ) : null;

  const className = clsx({
    sticky: true,
    'plugin-page': isPluginPage,
  });

  if (hs.length === 0) {
    return (
      <nav className={className}>
        {isPluginPage ? submitEditLinks : submitEditLink}
        <InternalAd />
      </nav>
    );
  }

  return (
    <InPageNavigationStyles className={className}>
      {h1 ? (
        <a href={`#${h1.id}`}>
          <Heading level={6} className="title">
            Contents
          </Heading>
        </a>
      ) : (
        <Heading level={6} className="title">
          Contents
        </Heading>
      )}

      <ul className="heading-links">
        {hs.map((heading, i) => (
          <li
            key={i}
            className={clsx({
              'heading-link': true,
              [`size-h${heading.level}`]: true,
              selected: selectedId === heading.id,
            })}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
      {isPluginPage ? submitEditLinks : submitEditLink}
      <InternalAd />
    </InPageNavigationStyles>
  );
};

const ghIcon = () => (
  <svg id="icon-github" viewBox="0 0 512 512" width="100%" height="100%">
    <path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9 1.4.3 2.6.4 3.8.4 8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1-8.4 1.9-15.9 2.7-22.6 2.7-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1 10.5 0 20-3.4 25.6-6 2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8 0 0 1.6-.5 5-.5 8.1 0 26.4 3.1 56.6 24.1 17.9-5.1 37-7.6 56.1-7.7 19 .1 38.2 2.6 56.1 7.7 30.2-21 48.5-24.1 56.6-24.1 3.4 0 5 .5 5 .5 12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5 1.2 0 2.6-.1 4-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"></path>
  </svg>
);

const InPageNavigationStyles = styled.nav`
  flex: 0 0 240px;
  padding-top: 26px;
  padding-left: 16px;
  letter-spacing: 0;

  .internal-ad {
    visibility: hidden;
  }

  .sticky {
    position: sticky;
    top: 100px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .title {
    margin-block-end: var(--space-1);
    color: var(--c-indigo-50);
    font-size: 10px;
    font-weight: 600;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.08em;
    font-family: var(--f-family-text);
  }

  h5 a {
    color: #a0aec0;
    text-decoration: none;
    border: none !important;
  }

  .heading-links {
    --indent-size: 12px;

    list-style: none;
    line-height: 1;
    padding: 0;
    margin: 0;
    margin-left: calc(var(--indent-size) * -2);
  }

  .heading-links li {
    width: 188px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .heading-links li:hover a {
    opacity: 0.7;
  }

  .heading-links a {
    font-weight: 400;
    color: var(--color-gunpowder);
    font-size: 13px;
    line-height: 18px;
    font-weight: 500;
    border: none;
    text-decoration: none;
    border: none !important;
    transition: 0.2s color ease-out, 0.2s opacity ease-out;
  }

  .heading-links a:hover {
    opacity: 1;
  }

  .heading-links a:hover {
    border: none;
  }

  .heading-links .heading-link:hover,
  .heading-links .heading-link.selected {
    border-bottom: none;
    transform: translateX(calc(var(--indent-size) * 1 + 2px));
    font-weight: 500;
  }

  li.heading-link {
    padding: 2px 11px 6px;
    margin-top: 0;
    margin-left: 0;
    border-left: 2px solid transparent;
    transition: 0.2s transform ease;
  }

  li.heading-link.selected {
    border-left: 2px solid var(--color-dodger-blue);
  }

  li.heading-link.selected a {
    color: var(--color-dodger-blue);
    font-weight: 600;
  }

  li.size-h2 {
    transform: translateX(calc(var(--indent-size) * 1));
  }

  li.size-h3 {
    transform: translateX(calc(var(--indent-size) * 2));
  }

  li.size-h4 {
    transform: translateX(calc(var(--indent-size) * 3));
  }

  li.size-h3 a,
  li.size-h4 a {
    font-weight: 400;
    color: #6c6c8b;
  }

  li.size-h3:hover a,
  li.size-h4:hover a {
    color: var(--color-gunpowder);
  }

  li.heading-link.size-h3:hover,
  li.heading-link.size-h3.selected {
    transform: translateX(calc(var(--indent-size) * 2 + 2px));
  }

  li.heading-link.size-h4:hover,
  li.heading-link.size-h4.selected {
    transform: translateX(calc(var(--indent-size) * 3 + 2px));
  }

  li.heading-link stencil-route-link {
    margin-top: 4px;
  }

  .submit-edit {
    margin: 2rem 0;
  }

  .submit-edit__title {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    color: var(--c-cyan-100);
  }

  .submit-edit__title svg {
    width: 16px;
    margin-inline-end: 0.5rem;
    fill: currentColor;
  }

  .edit-links {
    margin: 0.75rem 0 0 0;
    list-style: none;
    padding-inline-start: 1.5rem;
  }

  .edit-links li {
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    color: var(--c-cyan-100);
  }

  .edit-links li a {
    display: flex;
    align-items: center;
  }

  .edit-links li a::before {
    content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwLjA4IDEuNWExLjcxIDEuNzEgMCAxMTIuNDIgMi40Mkw0LjMzIDEyLjEgMSAxM2wuOS0zLjMzIDguMTgtOC4xN3pNOSAzbDIgMiIgc3Ryb2tlPSIjNDZCMUZGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=');
    display: inline-block;
    margin: 0.25rem 0.5rem 0 0;
  }

  .edit-links li + li {
    margin-block-start: 0.375rem;
  }

  .heading-links + .title {
    margin-top: 28px;
    border-bottom: none;
  }

  .plugin-page .submit-edit__title {
    color: var(--indigo-90);
  }
  .plugin-page .submit-edit__title svg {
    color: var(--c-indigo-80);
  }

  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

export default InPageNavigtion;
