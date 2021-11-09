// import { pixelize } from "src/utils/common";
// import ResizeObserver from "resize-observer-polyfill";
import { useCallback, useRef, useState } from "react";
import CodeTabsStyles from "./CodeTabs.styles";
import CodeSnippet from "../code-snippet/CodeSnippet";
import clsx from "clsx";

const CodeTabs = ({ data }) => {
  const [activeTab, setActiveTab] = useState<any | null>({
    index: 0,
    left: "0px",
    width: "0px",
  });
  const [codeLeft, setCodeLeft] = useState<any>(null);

  const tabsHandler = {
    set: (obj: any, prop: string, value: HTMLElement) => {
      if (prop === "0") {
        value.offsetWidth === 0 ? setResizeObserver(value) : setActive(value);
      }
      obj[prop] = value;
      return true;
    },
  };
  const tabs: any = new Proxy({}, tabsHandler);

  const elm = useRef<HTMLElement | null>(null);

  const setResizeObserver = (el: HTMLElement) => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setActive(el);
          resizeObserver.disconnect();
        }
      }
    });

    resizeObserver.observe(el);
  };

  const handleTabSelect = (ev: Event) => {
    const target = ev.target as HTMLElement;
    setActive(target);
  };

  const setActive = useCallback((target: HTMLElement) => {
    /*
    setActiveTab({
      ...activeTab,
      left: `${target.offsetLeft}px`,
      width: `${target.offsetWidth}px`,
    });
    */

    if (elm.current) {
      setCodeLeft(`-${elm.current.offsetWidth * activeTab.index}px`);
    }
  }, []);

  return (
    <CodeTabsStyles
      style={
        {
          "--tab-left": activeTab.left,
          "--tab-width": activeTab.width,
          "--code-left": codeLeft,
        } as any
      }
    >
      <nav>
        <div className="tabs-wrapper">
          {data.tabs.map((tab, i) => (
            <button
              key={i}
              className={clsx({
                active: activeTab.index === i,
              })}
              ref={(el) => !tabs.hasOwnProperty(i) && (tabs[i] = el)}
              onClick={(ev) => {
                activeTab.index = i;
                handleTabSelect(ev.nativeEvent);
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
              <CodeSnippet
                language={
                  data.languages.length === 1
                    ? data.languages[0]
                    : data.languages[i]
                }
                code={code}
              />
            </article>
          ))}
        </div>
      </div>
    </CodeTabsStyles>
  );
};

export default CodeTabs;
