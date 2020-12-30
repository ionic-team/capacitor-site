import React from 'react';
import { applyProps } from '../../../core/components/common';
import { JSXBase } from '@stencil/core/internal';

interface Props extends JSXBase.ImgHTMLAttributes<HTMLImageElement> {
  image: any,
  params?: { [key: string]: string }
}

const PrismicResponsiveImage = ({ image, params, ...props }: Props) => {
  if (!props.loading) props.loading = 'lazy';

  if (!params) {
    params = {
      q: '65'
    }
  } else if (!params.q) {
    params.q = '65';
  }

  const { width, height } = props;

  if (!image.url) return;
  const paramString = params ?
    Object.entries(params).reduce((acc, cur) => {
      const regex = new RegExp(`\\?.*${cur[0]}=`);

      if (!image.url.match(regex)) {
        return `${acc}${acc.match(/^\?$/) ? '' : '&' }${cur.join('=')}`;
      }      
      return acc;
    }, image.url.match(/\?/) ? '' : '?'): '';

  const imageUrl = new URL(image.url + paramString);  
  const dimensions = {
    'width': width ? width : imageUrl.searchParams.get('w'),
    'height': height ? height : imageUrl.searchParams.get('h'),
  }

  return (
    <img
      {...applyProps(props)}
      src={`${imageUrl}`}
      {...{'srcSet': image['2x'] ? `${imageUrl} 1x, ${image['2x'].url}${paramString} 2x` : undefined}}
      {...dimensions}
      alt={image.alt}
    /> )
};

export default PrismicResponsiveImage;
