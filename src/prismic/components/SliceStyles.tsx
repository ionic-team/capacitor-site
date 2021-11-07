import { css } from 'styled-components';
import Breakpoints from '../../styles/breakpoints';

const SliceStyles = css`
  .ui-blockquote {
    clear: both;
  }

  .prismic-raw-html {
    width: 100%;
    overflow: auto;
    clear: both;

    table {
      overflow-x: auto;
      margin-right: -15px;
      padding-right: 15px;
      box-sizing: content-box;
      font-size: 13px;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 48px;

      td,
      th {
        text-align: left;
        min-width: 120px;
        padding-right: 12px;
        padding-top: 12px;
        padding-bottom: 12px;

        &:last-child {
          padding-right: 0;
        }
      }

      th,
      b {
        font-weight: 600;
      }

      tbody tr {
        td {
          border-top: 1px solid #dee3ea;
        }

        &:first-child td {
          border-top: none;
        }
      }

      > thead > tr > th {
        border-bottom: 1px solid #e9edf3;
        font-weight: 600;
      }
    }
  }

  .prismic-ad {
    display: block;
    margin: ${({ theme }) => theme.space['64']} 0
      ${({ theme }) => theme.space['80']};
    clear: both;

    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: ${({ theme }) => theme.space['32']} 368px
        ${({ theme }) => theme.space['32']} ${({ theme }) => theme.space['32']};
      border: ${({ theme }) => theme.borders.regular};
      border-color: ${({ theme }) => theme.colors.indigo['30']};
      border-radius: ${({ theme }) => theme.radii['8']};
      overflow: hidden;
      position: relative;
      min-height: 225px;
      transition: 0.2s box-shadow ease-out;

      .ds-paragraph {
        margin-bottom: 0;
      }

      .prismic-ad__image {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        max-width: 337px;
        object-fit: cover;
        z-index: -1;
      }

      &:hover {
        box-shadow: ${({ theme }) => theme.shadows['3']};
      }
    }

    .ds-heading {
      color: ${({ theme }) => theme.colors.indigo['100']};
      margin-bottom: ${({ theme }) => theme.space['12']};
    }

    @media (max-width: ${Breakpoints.screenMdMax}) {
      a {
        padding-right: ${({ theme }) => theme.space['32']};

        .prismic-ad__image {
          opacity: 0.25;
        }
      }
    }
  }

  .prismic-youtube-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
    clear: both;
  }
  .prismic-youtube-container iframe,
  .prismic-youtube-container object,
  .prismic-youtube-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .prismic-floating-image {
    display: flex;
    flex-direction: column;
    width: 50%;

    margin-block-start: 2rem;
    margin-block-end: 2rem;

    &.right {
      float: right;
      margin-inline-start: 2rem;
    }

    &.left {
      float: left;
      margin-inline-end: 2rem;
    }

    &.center {
      width: 100%;
      margin-block-end: 2rem;
    }

    img {
      border-radius: 8px;
    }

    caption {
      margin-block-start: 1rem;
    }

    @media (max-width: ${Breakpoints.screenMdMax}) {
      width: 100%;

      &.right {
        float: none;
        margin-inline-start: 0;
      }

      &.left {
        float: none;
        margin-inline-end: 0;
      }
    }
  }
`;

export default SliceStyles;
