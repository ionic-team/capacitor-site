import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import SiteModalStyles, { GlobalSiteModalStyles } from './SiteModalStyles';

const OPEN_DELAY = 500;
const CLOSE_DELAY = 500;

const SiteModal = ({ open, onModalClose, children }) => {
  const [visible, setVisible] = useState(false);
  const backdropEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    checkBackdrop();
  }, []);

  useEffect(() => {
    if (open && !backdropEl.current) {
      openBackdrop();
    } else if (!open && backdropEl.current) {
      hideBackdrop();
    }

    requestAnimationFrame(() => {
      setVisible(open);
    });
  }, [open, backdropEl]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [open]);

  const close = useCallback(() => {
    setVisible(false);

    hideBackdrop();

    setTimeout(() => {
      onModalClose?.();
    }, CLOSE_DELAY);
  }, []);

  const openBackdrop = useCallback(() => {
    const backdrop = document.createElement('div');

    backdrop.className = 'modal__backdrop';
    document.body.appendChild(backdrop);

    initBackdrop(backdrop);

    backdropEl.current = backdrop;

    requestAnimationFrame(() => {
      backdrop.classList.add('in');
    });
  }, []);

  const hideBackdrop = useCallback(() => {
    if (!backdropEl.current) {
      return;
    }

    backdropEl.current.classList.add('out');

    setTimeout(() => {
      document.body.removeChild(backdropEl.current!);
      backdropEl.current = null;

      onModalClose?.();
    }, CLOSE_DELAY);
  }, []);

  const checkBackdrop = () => {};

  const initBackdrop = (el: HTMLDivElement) => {
    el.addEventListener('click', (_e) => {
      close();
    });
  };

  return (
    <SiteModalStyles
      className="site-modal"
      style={{
        display: open ? 'block' : 'none',
      }}
    >
      <GlobalSiteModalStyles />
      <div className={`modal__wrap${visible ? ` in` : ``}`}>
        <div className={`modal__content`}>
          <Button className="modal__close-button" onClick={close}>
            {/*<ion-icon name="close" />*/}
          </Button>
          <div className="modal__body">{children}</div>
        </div>
      </div>
    </SiteModalStyles>
  );
};

export default SiteModal;
