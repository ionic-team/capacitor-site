import { forwardRef } from 'react';
import Image from 'next/image';
import { Component } from 'src/util/typeHelpers';

interface PrismicImage2xProps {
  render: {
    alt: string;
    url: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

type PrismicImage2x = Component<'div', PrismicImage2xProps>;

const PrismicImage2x = forwardRef(({ render, ...props }, ref) => {
  const {
    alt,
    url,
    dimensions: { width, height },
  } = render;

  const { origin, pathname } = new URL(url);

  return (
    <div className="prismic-image-wrapper" ref={ref}>
      <Image
        alt={alt}
        src={`${origin}${pathname}`}
        width={width / 2}
        height={height / 2}
        {...props}
      />
    </div>
  );
}) as PrismicImage2x;

export default PrismicImage2x;
