import styled from 'styled-components';

interface Props {
  icon?: string;
  onMenuToggleClick?: () => void;
}
const SiteMenuToggle: React.FC<Props> = ({ icon = 'menu-outline', onMenuToggleClick }) => {
  return (
    <SiteMenuToggleStyles>
      <button className="menu-toggle-button" onClick={() => onMenuToggleClick?.()}>
        <ion-icon icon={icon}></ion-icon>
      </button>
    </SiteMenuToggleStyles>
  );
};

const SiteMenuToggleStyles = styled.div`
  display: none;
  top: 0px;
  left: 0px;

  .menu-toggle-button {
    display: flex;
    align-items: flex-start;
    justify-content: center;

    border: none;

    background: transparent;

    font-size: 28px;

    outline: none;

    &:hover ion-icon {
      opacity: 0.7;
    }

    &:active ion-icon {
      color: initial;
    }
  }

  ion-icon {
    transition: opacity 0.2s ease-out;
    opacity: 0.7;
    cursor: pointer;
  }

  &.left-sidebar-in {
    & > div {
      height: 100vh;
      padding-right: 50px;
    }
  }

  @media screen and (max-width: variables.$breakpoint-md) {
    app-menu-toggle {
      display: flex;
    }
  }
`;

export default SiteMenuToggle;
