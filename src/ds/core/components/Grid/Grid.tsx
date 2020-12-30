import React from 'react';
import clsx from 'clsx';

import './grid.scss';

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

const Grid = ({ children, className, ...props }: any) => <div className={clsx(`ui-grid`, className)} {...props}>{children}</div>;

export default Grid;
