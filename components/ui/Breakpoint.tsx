import clsx from "clsx";
import { forwardRef } from "react";
import styled from "styled-components";
import Breakpoints from "./Breakpoints";

// TODO: Strongly typed
type BreakpointProps = {
  cols: number | number[];
  offset: number | number[];
  [key: string]: any;
};

const Breakpoint = forwardRef(
  (
    { visible = [1, 1, 0, 0, 0], displayContents, ...props }: BreakpointProps,
    ref
  ) => {
    return (
      <BreakpointStyles
        {...props}
        className={clsx(props.className, "breakpoint")}
        $visible={visible}
        $displayContents={displayContents}
        ref={ref}
      />
    );
  }
);

const BreakpointStyles: any = styled.div`
  ${({ $displayContents: displayContents }: any) => {
    return displayContents ? "display: contents;" : "";
  }};

  ${({ $visible: visible }: any) => {
    const { screenXs, screenSm, screenMd, screenLg, screenXl } = Breakpoints;
    const siteBreakpoints = [
      { screenXs },
      { screenSm },
      { screenMd },
      { screenLg },
      { screenXl },
    ];

    return visible
      .map((isVisible, i) => {
        if (isVisible === 1) return;

        const [[key, val]] = Object.entries(siteBreakpoints[i]);

        return i !== visible.length - 1
          ? `@media (min-width: ${val}) and (max-width: ${
              Breakpoints[`${key}Max`]
            }) { display: none !important; }`
          : `@media (min-width: ${val}) { display: none !important; }`;
      })
      .filter((n) => n);
  }}
`;

export default Breakpoint;
