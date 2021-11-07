import clsx from "clsx";
import { forwardRef } from "react";
import styled from "styled-components";
import { Component } from "./typeHelpers";
import { CustomGridProps } from "./Grid";

export interface CustomColProps {
  cols?: number | number[];
  offsets?: number | number[];
}

export interface ColStylesProps {
  $starts: number[];
  $ends: number[];
  $breakpoints: NonNullable<CustomGridProps["breakpoints"]>;
}

export type Col = Component<"div", CustomColProps>;

const Col = forwardRef(({ cols, offsets, ...props }, ref) => {
  return (
    <ColStyles
      {...props}
      cols={cols}
      ref={ref}
      className={clsx("col", props.className)}
    />
  );
}) as Col;

const ColStyles: any = styled.div<ColStylesProps>`
  ${({ $starts: starts, $ends: ends, $breakpoints: breakpoints }) => {
    if (!starts || !ends) return null;

    let prevStart: number | null = null;
    let prevEnd: number | null = null;

    const styles = breakpoints.map((breakpoint, i) => {
      const start = starts[i];
      const end = ends[i];
      const isSame = prevStart === start && prevEnd === end;

      const style =
        !isSame &&
        `@media(min-width: ${breakpoint}) {
                grid-column-start: ${starts[i]};
                grid-column-end: ${ends[i]};
              }`;

      prevStart = start;
      prevEnd = end;
      return style;
    });

    return styles;
  }}}
`;

export default Col;
