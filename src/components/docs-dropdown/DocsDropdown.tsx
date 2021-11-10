import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { DownArrow } from '../../../icons';
import DocsDropdownStyles from './DocsDropdown.styles';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right' | 'center';
  icon?: (props: any) => ReactElement | null;
}

const DocsDropdown: React.FC<Props> = ({ align = 'left', icon, children }) => {
  const [isOpen, setOpen] = useState(false);
  const el = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    const handleClick = (e) => {
      const isNode = e.target instanceof Node;
      const isOurs = isNode && el.current.contains(e.target as Node);

      if (!isOurs) {
        close();
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [el]);

  const handleKeyup = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      toggle();
    }

    if (event.key === 'Escape') {
      close();
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, [isOpen]);

  const open = useCallback(() => {
    setOpen(true);
  }, [isOpen]);

  const toggle = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen]);

  /*
    hostData() {
      return {
        tabindex: '0',
        class: {
          Dropdown: true,
          [`Dropdown--${this.align}`]: true,
          'is-open': this.isOpen,
        },
      };
    }
    */

  const Icon = icon;

  return (
    <DocsDropdownStyles>
      <button
        tabIndex={-1}
        className="Dropdown-button"
        aria-haspopup="menu"
        aria-expanded={isOpen ? 'true' : 'false'}
        onClick={toggle}
      >
        {Icon ? <Icon className="Dropdown-icon" /> : null}
        <DownArrow className="Dropdown-arrow" />
      </button>

      <div role="menu" className="Dropdown-panel">
        {children}
      </div>
    </DocsDropdownStyles>
  );
};

export default DocsDropdown;
