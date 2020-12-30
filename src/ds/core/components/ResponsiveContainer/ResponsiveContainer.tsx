import React from 'react';
import clsx from 'clsx';

import './responsiveContainer.scss';

interface containerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'main';
  [key:string]: any;
}

const ResponsiveContainer = ({ children, className, as = 'div', ...props }: containerProps) => {
  const Tag = as;

  return <Tag className={clsx('ui-container', className)} {...props}>{children}</Tag>
};

export default ResponsiveContainer;
