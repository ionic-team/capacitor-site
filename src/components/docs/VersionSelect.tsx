import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const VersionSelect = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      setExpanded(false);
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const openSelect = useCallback(
    (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      setExpanded(!expanded);
    },
    [expanded]
  );

  const selectedVersion = router.pathname.includes('/v2') ? 2 : 3;
  return (
    <VersionSelectStyles role="navigation" aria-label="Documentation Version Selector">
      <Link href="/docs">
        <a aria-label={`Version ${selectedVersion}.x Docs`} className="version-selected" onClick={openSelect}>
          <span>v{selectedVersion}</span>
          <ion-icon name="chevron-down-outline" />
        </a>
      </Link>
      <div className="version-selector" hidden={!expanded}>
        <Link href="/docs/v2">
          <a aria-label="Version 2.x Docs" className={clsx({ selected: selectedVersion === 2 })}>
            <span>v2</span>
            {checkmark()}
          </a>
        </Link>
        <Link href="/docs">
          <a aria-label="Version 3.x Docs" className={clsx({ selected: selectedVersion === 3 })}>
            <span>v3</span>
            {checkmark()}
          </a>
        </Link>
        <a href="https://github.com/ionic-team/capacitor/releases" target="_blank" className="releases">
          <span>All Releases</span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.6875 7.5L7.25 0.5M7.25 0.5H2.98437M7.25 0.5V5.05"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>
    </VersionSelectStyles>
  );
};

const checkmark = () => (
  <svg width="12" height="8" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 0.5L4 8.5L1 5.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const VersionSelectStyles = styled.div`
  display: inline-block;
  position: relative;
  font-size: 12px;
  background: #f6f8fb;
  border-radius: 14px;
  padding: 3px 8px;
  margin-left: 12px;

  ion-icon {
    position: relative;
    top: 1px;
    left: 2px;
    font-size: 10px;
  }

  > a {
    display: flex;
    align-items: center;
  }

  a {
    color: #2d4665;
    padding: 2px;
    border: 0;
  }

  .version-selector {
    position: absolute;
    z-index: 99999;
    top: 30px;
    left: -70px;
    width: 120px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    background: white;
    overflow: hidden;
  }

  .version-selector a {
    display: block;
    padding: 8px 12px;
  }

  .version-selector a:hover {
    background-color: #f6f8fb;
  }

  .version-selector a span {
    width: 80px;
    display: inline-block;
  }

  .releases {
    border-top: 1px solid #e9edf3;
  }

  .selected {
    opacity: 0.4;
  }

  svg {
    display: none;
    stroke: #2d4665;
  }

  .selected svg {
    display: inline-block;
  }
`;

export default VersionSelect;
