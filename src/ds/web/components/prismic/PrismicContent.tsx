import { h } from '@stencil/core';

import { PrismicBodySlice } from './PrismicSlice';

const PrismicContent = ({ content }: { content: any }) =>
  content.map((c: any, i: number) => <PrismicBodySlice slice={c} key={i} />);

export { PrismicContent };
