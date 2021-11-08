import { applyProps } from "./common";

export interface ColProps {
  /**
   * The number of cols to take on xs breakpoint
   */
  xs?: number;
  /**
   * The number of cols to take on sm breakpoint
   */
  sm?: number;
  /**
   * The number of cols to take on md breakpoint
   */
  md?: number;
  /**
   * The number of cols to take on lg breakpoint
   */
  lg?: number;
  /**
   * The number of cols to take regardless of breakpoints (not responsive)
   */
  cols?: number;

  class?:
    | string
    | {
        [className: string]: boolean;
      };

  [key: string]: any;
}

const applyClasses = (
  cols: number | undefined,
  xs: number | undefined,
  sm: number | undefined,
  md: number | undefined,
  lg: number | undefined
) => {
  const classes = [];

  // General class, doesn't apply column behavior but
  // can be useful for selectors
  classes.push("ui-col");

  if (cols) {
    classes.push(`ui-col-${cols}`);
  } else {
    // If no "cols" is specified, add a default 12 to make content go full width
    // in the smallest viewport sizes
    classes.push(`ui-col-12`);
  }

  if (xs) {
    classes.push(`ui-col-xs-${xs}`);
  }
  if (sm) {
    classes.push(`ui-col-sm-${sm}`);
  }
  if (md) {
    classes.push(`ui-col-md-${md}`);
  }
  if (lg) {
    classes.push(`ui-col-lg-${lg}`);
  }
  return classes.join(" ");
};

const Col = ({ cols, xs, sm, md, lg, children, ...props }: ColProps) => (
  <div
    {...applyProps(props, { className: applyClasses(cols, xs, sm, md, lg) })}
  >
    {children}
  </div>
);

export default Col;
