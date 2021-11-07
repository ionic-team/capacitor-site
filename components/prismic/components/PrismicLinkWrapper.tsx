import clsx from 'clsx';
import Link from 'next/link';
import { forwardRef, PropsWithRef } from 'react';
import styled from 'styled-components';
import { BASE_URL } from '../../util/common';

interface CustomPrismicLinkProps {
  data: any;
  arrow?: 'ligature' | 'unicode';
}

type PrismicLinkProps = CustomPrismicLinkProps &
  Partial<PropsWithRef<HTMLAnchorElement>>;

const PrismicLinkWrapper = forwardRef(
  ({ data, arrow, ...props }: PrismicLinkProps, ref) => {
    const { text, spans } = data[0];
    const {
      data: { target, url },
    } = spans[0];

    const sameSite = url.includes(`${BASE_URL}/`);
    const ligature = arrow === 'ligature';

    const Core = forwardRef((props: any, ref) => (
      <PrismicLinkWrapperStyles
        {...props}
        ref={ref}
        className={clsx({
          [props.className || '']: true,
          'prismic-link': true,
          'link': true,
        })}
        target={target}
      >
        {text}{' '}
        {arrow && (
          <span className={ligature ? 'inter-arrow' : 'soehne-arrow'}>
            {ligature ? '->' : ' →'}
          </span>
        )}
      </PrismicLinkWrapperStyles>
    ));

    if (sameSite) {
      const relativeUrl = url.split(`${BASE_URL}/`)[1];

      return (
        <Link passHref href={`/${relativeUrl}`}>
          <Core {...props} ref={ref} />
        </Link>
      );
    } else {
      return <Core {...props} href={url} ref={ref} rel="noopener" />;
    }
  },
);

const PrismicLinkWrapperStyles = styled.a`
  white-space: pre;
`;
export default PrismicLinkWrapper;
