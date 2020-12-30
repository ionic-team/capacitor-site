import React from 'react';
import clsx from 'clsx';

import './heading.scss';

interface HeadingProps extends Partial<HTMLElement>{
  children: React.ReactNode;
  level?: number;
  poster?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  [key: string]: any;
}

const Heading = ({ children, className, level = 3, poster = false, as, ...props }: HeadingProps) => {
  const Tag = as ? as : (poster ? 'h1' : `h${level}`);
  const classes = [
    `ui-heading`,
    `${poster ? `ui-poster-${level}` : `ui-heading-${level}`}`
  ];
  return (
    <Tag
      className={clsx(classes, className)}
      {...props}
      // TODO(docusaurus):
      // ref={(e: HTMLElement) => observe(e)}
      >
      {children}
    </Tag>
  );
};

export default Heading;
