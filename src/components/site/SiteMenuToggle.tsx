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

const SiteMenuToggleStyles = styled.div``;

export default SiteMenuToggle;
