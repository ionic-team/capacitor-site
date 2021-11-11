import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import EnterpriseSubNavStyles from './EnterpriseSubNav.styles';

const EnterpriseSubNav = () => {
  const el = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let options = {
      rootMargin: '0px',
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      setVisible(entries[0].target.getBoundingClientRect().top < 0 ? true : false);
    }, options);

    if (el.current) {
      observer.current?.observe(el.current);

      return () => {
        if (el.current) {
          observer.current?.unobserve(el.current);
        }
      };
    }
  }, [el]);

  return (
    <EnterpriseSubNavStyles
      ref={el}
      className={clsx({
        visible,
      })}
    >
      <div className="wrapper heading-container">
        <span className="title">Enterprise</span>
        <div className="cta-row">
          <a href="#demo" className="btn-primary">
            Talk to sales
          </a>
        </div>
      </div>
    </EnterpriseSubNavStyles>
  );
};

export default EnterpriseSubNav;
