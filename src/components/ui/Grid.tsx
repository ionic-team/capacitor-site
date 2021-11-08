/*
interface GridProps {
  bordered?: boolean;
  xsCols?: number | null;
  smCols?: number | null;
  mdCols?: number | null;
  lgCols?: number | null;
  cols?: number;
  [key: string]: any;
}
const getColClasses = (
  xsCols: number | null,
  smCols: number | null,
  mdCols: number | null,
  lgCols: number | null) => (
    [ ['xs', xsCols], ['sm', smCols], ['md', mdCols], ['lg', lgCols] ].reduce((str, c) => {
      const ct = c[0];
      const cn = c[1];
      if (cn) {
        return `${str} ui-grid-cols-${ct}-${cn}`;
      }
      return str;
    }, '')
  );
*/

import { applyProps } from "./common";

const Grid = ({ children, ...props }: any) => (
  <div {...applyProps(props, { className: `ui-grid` })}>{children}</div>
);

export default Grid;
