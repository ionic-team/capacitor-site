import React from 'react';
import clsx from 'clsx';

import './paragraph.scss';

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  level?: number;
  leading?: 'body' | 'prose' | 'none';
}

const Paragraph = ({ children, className, level = 3, leading = 'body', ...props }: Props) => {
  const classes = [
    `ui-paragraph`,
    `ui-paragraph-${level}`,
    `ui-paragraph--${leading}`,
  ];
  return (
    <p className={clsx(classes, className)} {...props}>
      {children}
    </p>
  );
};

export default Paragraph;
