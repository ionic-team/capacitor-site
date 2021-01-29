import React from 'react';

import Image from '@theme/IdealImage';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement>{
  img: any;
  min: number;
  max: number;
}

const ResponsiveImage: React.FC<ImageProps> = ({ ...props }) => {
  if (process.env.NODE_ENV.toLowerCase() === 'production') {
    return <Image img={props.img} min={props.min} max={props.max}/>
  }
  const sanitizedProps = {...props, 
    min: undefined, 
    max: undefined, 
    img: undefined, 
    src: props.img
  };
  return <img {...sanitizedProps} />;

}

export default ResponsiveImage;