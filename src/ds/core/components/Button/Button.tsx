import React from 'react';
import clsx from 'clsx';

import './button.scss';

interface ButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  kind?: 'display' | 'regular' | 'round';
  color?: 'blue' | 'indigo' | 'green' | 'red' | 'yellow' | 'orange' | 'cyan' | 'lavender';
  variation?: 'fill' | 'muted' | 'light' | 'ghost';
  anchor?: boolean
}
interface RegularButtonProps extends ButtonProps, Omit<JSXBase.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {};
interface AnchorButtonProps extends ButtonProps, Omit<JSXBase.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {};

const Button: FunctionalComponent<RegularButtonProps | AnchorButtonProps> = ({ children, className, size = 'lg', kind = 'display', color = 'blue', variation = 'fill', anchor = false, ...props }) => {
  const Tag = anchor ? 'a' : 'button';
  
  let classes = [
    'ui-button',
    `ui-button-${size}`,
    `ui-button-${kind}`,
    `ui-button-${color}`,
    `ui-button-${variation}`,
  ];

  return (
    <Tag
      tabIndex={ anchor ? '0' : undefined }
      className={clsx(classes, className)}
      {...props}>
      {children}
    </Tag>
  );
};

export default Button;
