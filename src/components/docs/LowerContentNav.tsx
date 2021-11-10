import Link from 'next/link';
import styled from 'styled-components';
import { PageNavigation } from '../../markdown/types';

interface Props {
  navigation: PageNavigation;
}
const LowerContentNav: React.FC<Props> = ({ navigation }) => {
  if (!navigation) {
    return null;
  }
  return (
    <LowerContentNavStyles role="navigation">
      {navigation.previous?.url ? (
        <Link href={navigation.previous.url}>
          <a className="nav-previous link">
            <div className="direction">Previous</div>
            <div>
              <span className="arrow">&lt;- </span>
              <span>{navigation.previous.title}</span>
            </div>
          </a>
        </Link>
      ) : null}
      {navigation.next?.url ? (
        <Link href={navigation.next.url}>
          <a className="nav-next link">
            <div className="direction">Next</div>
            <div>
              <span>{navigation.next.title}</span>
              <span className="arrow"> -&gt;</span>
            </div>
          </a>
        </Link>
      ) : null}
    </LowerContentNavStyles>
  );
};

const LowerContentNavStyles = styled.div`
  display: block;
  overflow: hidden;
  border-color: var(--c-indigo-20);
  border-style: solid;
  border-width: 0px 0px 1px;
  display: flex;
  flex-wrap: wrap-reverse;

  padding: 20px 0;
  margin-block-start: 65px;

  a {
    border: 0;
    letter-spacing: -0.02em;
    font-weight: 500;
    font-size: 18px;
    line-height: 200%;
  }

  a:hover {
    text-decoration: none;
    border: 0;
    opacity: 0.7;
  }

  .nav-previous {
    max-width: 100%;
    overflow: hidden;
  }

  .nav-next {
    text-align: right;
    margin-left: auto;
    max-width: 100%;
    overflow: hidden;
  }

  .direction {
    font-size: 14px;
    color: var(--c-indigo-60);
    letter-spacing: -0.03em;
    line-height: 190.94%;
    padding-bottom: 4px;
  }
`;

export default LowerContentNav;
