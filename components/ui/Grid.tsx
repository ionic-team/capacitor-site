import clsx from "clsx";
import {
  cloneElement,
  forwardRef,
  useRef,
  Children,
  useContext,
  useCallback,
} from "react";

import styled, { ThemeContext, ThemeProvider } from "styled-components";
import { Component } from "./typeHelpers";
import Breakpoints from "./Breakpoints";

export interface CustomGridProps {
  columnGap?: number | number[];
  rowGap?: number | number[];
  breakpoints?: string[];
  columns?: number;
}

export interface GridStylesProps {
  $columns: NonNullable<CustomGridProps["columns"]>;
  $rowGap: NonNullable<CustomGridProps["rowGap"]>;
  $columnGap: NonNullable<CustomGridProps["columnGap"]>;
  $breakpoints: NonNullable<CustomGridProps["breakpoints"]>;
}
export type Grid = Component<"div", CustomGridProps>;

const Grid = forwardRef(
  ({ columnGap, rowGap, breakpoints, columns, ...props }, ref) => {
    const { dsGrid, dsCol } = useContext(ThemeContext) || {};

    const themeBreakpoints = dsGrid?.breakpoints;
    const themeColumns = dsGrid?.columns;
    const themeColumnGap = dsGrid?.columnGap;
    const themeRowGap = dsGrid?.rowGap;
    const themeCols = dsCol?.cols;
    const themeOffsets = dsCol?.offsets;

    //TODO: Split defaults into separate file
    const theme = {
      dsGrid: {
        columns: columns || themeColumns || 12,
        columnGap: columnGap || themeColumnGap || [1, 1, 1.5, 2, 2],
        rowGap: rowGap || themeRowGap || 4,
        breakpoints: breakpoints ||
          themeBreakpoints || [
            Breakpoints.screenXs,
            Breakpoints.screenSm,
            Breakpoints.screenMd,
            Breakpoints.screenLg,
            Breakpoints.screenXl,
          ],
      },
      dsCol: {
        cols: themeCols || [12, 6, 6, 4, 4],
        offsets: themeOffsets || 0,
      },
    };

    const breakpointCount = theme.dsGrid.breakpoints.length;
    let colsStarts = Array(breakpointCount).fill(1);

    const alterChild = useCallback(
      (child, i) => {
        let { cols = theme.dsCol.cols, offsets = theme.dsCol.offsets } =
          child.props;

        if (typeof cols === "number") cols = Array(breakpointCount).fill(cols);
        if (typeof offsets === "number")
          offsets = Array(breakpointCount).fill(offsets);

        const starts = colsStarts.map((col, i) =>
          col + offsets[i] + cols[i] > theme.dsGrid.columns + 1
            ? 1 + offsets[i]
            : col + offsets[i]
        );
        const ends = starts.map((col, i) => col + cols[i]);
        colsStarts = ends;

        return cloneElement(child, {
          key: i,
          $breakpoints: theme.dsGrid.breakpoints,
          ...child.props,
          $starts: starts,
          $ends: ends,
        });
      },
      [props.children]
    );

    return (
      <ThemeProvider theme={theme}>
        <GridStyles
          {...props}
          $columnGap={theme.dsGrid.columnGap}
          $rowGap={theme.dsGrid.rowGap}
          $breakpoints={theme.dsGrid.breakpoints}
          $columns={theme.dsGrid.columns}
          className={clsx("grid", props.className)}
          ref={ref}
        >
          {Children.map(Children.toArray(props.children), alterChild)}
        </GridStyles>
      </ThemeProvider>
    );
  }
) as Grid;

const GridStyles = styled.div<GridStylesProps>`
  display: grid;

  ${({ $columns }) =>
    `grid-template-columns: repeat(${$columns}, minmax(0, 1fr));`};

  ${({ $columnGap: columnGap, $breakpoints: breakpoints }) => {
    if (Array.isArray(columnGap)) {
      let prevGap: number | null = null;

      const styles = breakpoints.map((breakpoint, i) => {
        const style =
          columnGap[i] === prevGap
            ? null
            : `@media(min-width: ${breakpoint}) { column-gap: ${columnGap[i]}rem; }`;
        prevGap = columnGap[i];
        return style;
      });

      return styles;
    } else {
      return `column-gap: ${columnGap}rem;`;
    }
  }}

  ${({ $rowGap: rowGap, $breakpoints: breakpoints }) => {
    if (Array.isArray(rowGap)) {
      let prevGap: number | null = null;

      const styles = breakpoints.map((breakpoint, i) => {
        const style =
          rowGap[i] !== prevGap &&
          `@media(min-width: ${breakpoint}) { row-gap: ${rowGap[i]}rem; }`;
        prevGap = rowGap[i];
        return style;
      });

      return styles;
    } else {
      return `row-gap: ${rowGap}rem;`;
    }
  }}
`;

export default Grid;
