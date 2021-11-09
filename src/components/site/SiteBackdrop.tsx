import clsx from "clsx";
import styled from "styled-components";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  mobileOnly: boolean;
}

const SiteBackdrop: React.FC<Props> = ({
  visible = false,
  mobileOnly = false,
}) => {
  return (
    <SiteBackdropStyles
      tabIndex={-1}
      className={clsx({
        "site-backdrop--visible": visible,
        "site-backdrop--mobile-only": mobileOnly,
      })}
    />
  );
};

const SiteBackdropStyles = styled.div`
  position: fixed;
  top: 0;
  height: 100vh;
  left: 0;
  right: 0;
  background: rgb(0, 26, 58, 0.08);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: 0.4s opacity, 0.4s visibility step-end;
  visibility: hidden;
  outline: 2px solid rgba(0, 0, 0, 0);
  z-index: 0;
  &.site-backdrop--visible:not(.site-backdrop--mobile-only) {
    opacity: 1;
    pointer-events: all;
    visibility: visible;
    transition: 0.4s opacity, 0.4s visibility step-start;
  }

  @media screen and (max-width: 768px) {
    &.site-backdrop--visible.site-backdrop--mobile-only {
      opacity: 1;
      pointer-events: all;
      visibility: visible;
      transition: 0.4s opacity, 0.4s visibility step-start;
    }
  }
`;

export default SiteBackdrop;
