import { applyProps } from './common';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
  display?:
    | 'inline'
    | 'block'
    | 'inline-block'
    | 'flex'
    | 'inline-flex'
    | 'grid'
    | 'inline-grid'
    | 'table'
    | 'table-cell';
}

const Breakpoint = ({ xs, sm, md, lg, xl, display = 'block', children, ...props }: Props) => {
  const Tag = display === 'inline' ? 'span' : 'div';

  //cascade values up breakpoints
  xs = xs !== undefined ? xs : false;
  sm = sm !== undefined ? sm : xs;
  md = md !== undefined ? md : sm;
  lg = lg !== undefined ? lg : md;
  xl = xl !== undefined ? xl : lg;

  const breakpoints = [
    ['xs', xs],
    ['sm', sm],
    ['md', md],
    ['lg', lg],
    ['xl', xl],
  ];

  //Combine classes into string based on breakpoint values
  const className = breakpoints.reduce(
    (acc, cur) => `${acc} ${cur[1] ? `ui-breakpoint-${cur[0]}` : ``}`,
    'ui-breakpoint'
  );

  return (
    <Tag {...applyProps(props, { className })} style={{ '--display': display }}>
      {children}
    </Tag>
  );
};

export default Breakpoint;
