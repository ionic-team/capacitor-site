import styled from "styled-components";

const SiteModalStyles = styled.div`
  --modal-z-index: 1100;
  --modal-backdrop-z-index: 1090;
  --modal-width: 768px;
  --modal-padding: 48px;
  --modal-border-radius: 24px;

  site-modal {
    display: block;
    pointer-events: none;

    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: var(--modal-z-index);
  }

  .modal__backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--modal-backdrop-z-index);
    transition: opacity 300ms ease-in-out;
    background-color: #000;
    opacity: 0;

    &.in {
      opacity: 0.5;
    }
    &.out {
      opacity: 0;
    }
  }

  .modal__wrap {
    transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
    transform: translateY(-120%);

    &.in {
      transform: translate(0%);
    }
  }

  .modal__content {
    pointer-events: auto;
    max-width: var(--modal-width);
    margin: 76px auto;
    background: white;
    position: relative;

    border-radius: var(--modal-border-radius);

    .modal__close-button {
      position: absolute;
      top: -10px;
      right: -10px;
      background: #fff;
      color: var(--c-carbon-90);
      padding: 0;
      text-align: center;
      border: 0;
      border-radius: 100%;
      height: 30px;
      width: 30px;
      box-shadow: var(--elevation-2);
      outline: 0;

      ion-icon {
        vertical-align: middle;
        margin-top: -3px;
      }
    }
  }

  .modal__body {
    padding: var(--modal-padding);
    max-height: calc(100vh - 76px);
    overflow: auto;

    h1,
    h2,
    h3,
    h4,
    h5 {
      margin-top: 0;
    }
  }
`;

export default SiteModalStyles;
