// import { pixelize } from "src/utils/common";
// import ResizeObserver from "resize-observer-polyfill";
import { useCallback, useEffect, useRef, useState } from 'react';
import CodeTabsStyles from './CodeTabs.styles';
import CodeSnippet from '../code-snippet/CodeSnippet';
import clsx from 'clsx';

interface Tab {
  index: number;
  left: string;
  width: string;
  el?: HTMLElement;
}
const CodeTabs = ({ data }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [codeLeft, setCodeLeft] = useState<any>(null);
  const [hasTabs, setHasTabs] = useState(false);

  const tabs = useRef<Tab[]>(null);

  useEffect(() => {
    tabs.current = data.tabs.map((t, i) => ({
      index: i,
      left: '0px',
      width: '0px',
    }));
    setHasTabs(true);
  }, []);

  const setTabRef = useCallback(
    (tabIndex: number, refEl: HTMLElement) => {
      if (!refEl || !tabs.current || !hasTabs) {
        return;
      }
      console.log('Setting tab ref', tabs, tabIndex, refEl, refEl?.offsetLeft, refEl?.offsetWidth);
      tabs.current = tabs.current.map((t, i) => {
        if (i === tabIndex) {
          return {
            ...t,
            left: `${refEl.offsetLeft}px`,
            width: `${refEl.offsetWidth}px`,
            el: refEl,
          };
        }
        return t;
      });

      if (!activeTab && tabs.current[0]) {
        //setActiveTab(tabs.current[0]);
        setActive(tabs.current[0].el, tabs.current[0], 0);
      }
    },
    [activeTab, tabs, hasTabs]
  );

  /*
  const tabsHandler = {
    set: (obj: any, prop: string, value: HTMLElement) => {
      if (prop === '0') {
        value.offsetWidth === 0 ? setResizeObserver(value) : setActive(value, activeTab, activeTab.index);
      }
      obj[prop] = value;
      return true;
    },
  };
  const tabs: any = new Proxy({}, tabsHandler);
  */

  /*
  const setResizeObserver = (el: HTMLElement) => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setActive(el, activeTab, activeTab.index);
          resizeObserver.disconnect();
        }
      }
    });

    resizeObserver.observe(el);
  };
  */

  const handleTabSelect = useCallback(
    (ev: Event, tabIndex: number) => {
      const target = ev.target as HTMLElement;
      setActive(target, activeTab, tabIndex);
    },
    [activeTab]
  );

  const setActive = useCallback((target: HTMLElement, activeTab, tabIndex: number) => {
    const newActiveTab = {
      ...activeTab,
      index: tabIndex,
      left: `${target.offsetLeft}px`,
      width: `${target.offsetWidth}px`,
    };
    setActiveTab(newActiveTab);

    console.log('Set active tab', target.offsetWidth, el.current.offsetWidth, newActiveTab.index);

    if (el.current) {
      setCodeLeft(`-${el.current.offsetWidth * newActiveTab.index}px`);
    }
  }, []);

  return (
    <CodeTabsStyles
      ref={el}
      style={
        {
          '--tab-left': activeTab?.left ?? 0,
          '--tab-width': activeTab?.width ?? 0,
          '--code-left': codeLeft,
        } as any
      }
    >
      <nav>
        <div className="tabs-wrapper">
          {data.tabs.map((tab, i) => (
            <button
              key={i}
              className={clsx({
                active: activeTab?.index === i,
              })}
              //ref={(el) => !tabs.hasOwnProperty(i) && (tabs[i] = el)}
              ref={(el) => setTabRef(i, el)}
              onClick={(ev) => {
                handleTabSelect(ev.nativeEvent, i);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>
      <div className="background">
        <div className="code-wrapper">
          {data.code.map((code, i) => (
            <article key={i}>
              <CodeSnippet language={data.languages.length === 1 ? data.languages[0] : data.languages[i]} code={code} />
            </article>
          ))}
        </div>
      </div>
    </CodeTabsStyles>
  );
};

export default CodeTabs;
