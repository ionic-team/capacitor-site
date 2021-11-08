import "../styles/globals.scss";

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      {/*<GlobalStyle />*/}
      <Component {...pageProps} />
    </>
  );
};

/*
const GlobalStyle = createGlobalStyle`
  :root {
    --h-announcement-bar: 4.625rem;

    --h-site-header: 4rem;

    --h-site-subnav: 3.5rem;

    --h-products-subnav: 3.5rem;

    --h-resources-subnav: 3.375rem;

    --c-ionic-brand: ${tokens.colors.blue["80"]};
  }

  body {
    position: relative;

    font-family: ${tokens.fonts.pro};
    font-feature-settings: 'ss02', 'ss01';

    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;

    margin: 0;
    padding: 0;
    width: 100%;
  }

  body::before {
    content: '';
    position: absolute;
    z-index: 2000;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: black;
    opacity: 0;
    pointer-events: none;
  }
  body.backdrop-in::before {
    opacity: 0.4;
    pointer-events: all;
    cursor: pointer;
  }

  body.no-scroll {
    overflow: hidden;
  }

  main {
    overflow: visible;
    overflow: hidden;
    position: relative;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font: inherit;
  }

  .ds-button-blue.ds-button-blue.ds-button-fill {
    --c-background: ${({ theme }) => theme.colors.blue["90"]};
  }

  ul {
    padding: 0;
    margin: 0;
  }
  ul > li {
    list-style-type: none;
  }

  span,
  a,
  sup,
  small {
    display: inline-block;
  }

  img,
  svg {
    display: block;
  }

  a,
  button {
    cursor: pointer;

    text-decoration: none;
  }

  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }

  hr {
    border: none;
    height: 1px;
    background: ${tokens.colors.indigo["30"]};
    margin: ${tokens.space["32"]} 0;
  }

  .inter-arrow {
    display: inline-flex;
    letter-spacing: 0;
    white-space: pre;
  }

  .soehne-arrow {
    transform: translateY(5%);
    display: inline-flex;
    letter-spacing: 0;
    white-space: pre;
  }

  .link,
  p a {
    color: ${tokens.colors.blue["80"]};
    transition: opacity 0.2s ease-out;

    &:hover {
      opacity: 0.7;
    }
  }

  .no-scroll {
    overflow: hidden;
  }
`;
*/

export default MyApp;
