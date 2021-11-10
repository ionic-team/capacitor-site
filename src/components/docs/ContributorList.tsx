import styled from 'styled-components';
import Button from '../ui/Button';

interface Props {
  contributors: string[];
  editUrl: string;
  editApiUrl: string;
}
const ContributorList: React.FC<Props> = ({ contributors, editUrl, editApiUrl }) => {
  const c = contributors;

  return (
    <ContributorListStyles>
      {c?.length > 0 && (
        <ul className="img-list">
          {c.reverse().map((contributor) => (
            <li key={contributor}>
              <a className="contributor-img" target="_blank" href={`https://github.com/${contributor}`}>
                <img
                  src={`https://github.com/${contributor}.png?size=90`}
                  title={`Contributor ${contributor}`}
                  loading="lazy"
                />
              </a>
            </li>
          ))}
        </ul>
      )}
      {editUrl && (
        <Button
          anchor
          href={editUrl}
          target="_blank"
          rel="noopener"
          buttonSize="md"
          kind="round"
          color="cyan"
          variation="muted"
        >
          Contribute
          <span className="arrow"> -&gt;</span>
        </Button>
      )}
    </ContributorListStyles>
  );
};

const ContributorListStyles = styled.div`
  display: flex;
  align-items: center;
  padding-block-start: var(--space-6);
  padding-block-end: var(--space-6);

  ul.img-list {
    display: inline-flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    list-style: none;
    margin: 0 1rem 0 0;
    padding: 0;
  }

  li:last-child {
    margin-left: 0 !important;
  }

  li:not(:last-child) {
    margin-left: -10px;
  }

  img {
    border: solid 2px var(--background);
    border-radius: 50%;
    height: 32px;
    width: 32px;
    border: 2px solid #fff;
  }

  a.contributor-img {
    display: block;
    border: none;
    /* transition: transform 200ms cubic-bezier(0.32, 0.72, 0, 1); */
  }

  @media (hover: hover) {
    li a:hover {
      opacity: 1;
      transform: scale(1.125);
      z-index: 1;
    }
  }
`;

export default ContributorList;
