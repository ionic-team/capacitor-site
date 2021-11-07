import clsx from "clsx";
import { ComponentPropsWithRef } from "react";
import styled from "styled-components";

interface CustomBlockquoteProps {}

export type BlockquoteProps = CustomBlockquoteProps &
  ComponentPropsWithRef<"blockquote">;

const Blockquote: React.FC<BlockquoteProps> = ({ children, ...props }) => (
  <BlockquoteStyles
    {...props}
    className={clsx({
      "ui-blockquote": true,
      [props.className]: !!props.className,
    })}
  >
    {children}
    <svg
      version="1.0"
      className="ui-blockquote__quote-mark"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="30"
      viewBox="30.45 4 198.05 153.5"
    >
      <path d="M98.1 8.5C57.3 26.2 34.8 53.4 31 89.8c-3.2 29.6 7.7 54 28.6 64.3 6.6 3.3 7.3 3.4 18.4 3.4 10.4 0 12-.3 17.3-2.7 7-3.3 15.6-11.6 19.1-18.5 11-21.8-1.9-49.7-24.8-53.3-7-1.1-15.5.3-22.1 3.7-6.8 3.4-7.5 2.8-7.5-6.6 0-23 17.8-48.6 42.2-60.4l8.8-4.2V9.7c0-3.9-.4-5.7-1.2-5.7-.7 0-6 2.1-11.7 4.5zM211.2 7.4c-36.8 15.2-58.9 37.9-67.3 69.1-2.7 9.8-3.2 32.6-1 41.5 3.9 16.1 14.6 30 27.8 36.3 6.4 3 7.4 3.2 18.3 3.2 10.6 0 11.9-.2 17.4-2.9 7.4-3.6 15.6-11.8 19.2-19.2 2.6-5.4 2.9-6.9 2.9-16.4 0-8.7-.4-11.3-2.2-15.2-2.6-5.8-10.3-14.1-15.9-17.4-8.7-5.1-23.1-5-32.6.4-6.2 3.5-7.3 2.4-7.2-6.3.6-24.8 18.6-50.1 44-61.6L221 16v-6c0-3.3-.3-6-.7-6-.5 0-4.5 1.6-9.1 3.4z" />
    </svg>
  </BlockquoteStyles>
);

const BlockquoteStyles = styled.blockquote`
  position: relative;
  padding: clamp(1rem, 10vw, 2rem);
  background: ${({ theme }) => theme.colors.indigo["20"]};

  border-radius: ${({ theme }) => theme.radii["16"]};

  font-style: italic;
  color: ${({ theme }) => theme.colors.indigo["90"]};

  svg {
    width: 1rem;
    opacity: 0.3;

    position: absolute;
    left: calc(clamp(1rem, 10vw, 2rem) - 1rem);
    top: calc(clamp(1rem, 10vw, 2rem) - 1rem);
  }

  cite {
    color: ${({ theme }) => theme.colors.carbon["90"]};
    font-style: normal;
    display: inline-block;
    margin-block-start: 1rem;

    > span {
      margin-inline-start: 1rem;
      color: ${({ theme }) => theme.colors.indigo["80"]};
    }
  }
`;

export default Blockquote;
