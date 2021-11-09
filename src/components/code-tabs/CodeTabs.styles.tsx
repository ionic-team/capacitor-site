import styled from "styled-components";

const CodeTabsStyles = styled.div`
  /**
 * prism.js tomorrow night eighties for JavaScript, CoffeeScript, CSS and HTML
 * Based on https://github.com/chriskempson/tomorrow-theme
 * @author Rose Pritchard
 */

  code[class*="language-"],
  pre[class*="language-"] {
    color: #ccc;
    background: none;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  /* Code blocks */
  pre[class*="language-"] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
  }

  :not(pre) > code[class*="language-"],
  pre[class*="language-"] {
  }

  /* Inline code */
  :not(pre) > code[class*="language-"] {
    padding: 0.1em;
    border-radius: 0.3em;
    white-space: normal;
  }

  .token.comment,
  .token.block-comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #999;
  }

  .token.punctuation {
    color: #ccc;
  }

  .token.tag,
  .token.attr-name,
  .token.namespace,
  .token.deleted {
    color: #e2777a;
  }

  .token.function-name {
    color: #6196cc;
  }

  .token.boolean,
  .token.number,
  .token.function {
    color: #f08d49;
  }

  .token.property,
  .token.class-name,
  .token.constant,
  .token.symbol {
    color: #f8c555;
  }

  .token.selector,
  .token.important,
  .token.atrule,
  .token.keyword,
  .token.builtin {
    color: #cc99cd;
  }

  .token.string,
  .token.char,
  .token.attr-value,
  .token.regex,
  .token.variable {
    color: #7ec699;
  }

  .token.operator,
  .token.entity,
  .token.url {
    color: #67cdcc;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .token.inserted {
    color: green;
  }

  display: block;
  max-width: 560px;
  min-width: 0;

  nav {
    padding: 16px;
  }

  code-snippet {
    height: 100%;
  }

  .tabs-wrapper {
    overflow: auto;
    position: relative;
    display: flex;

    button {
      color: var(--c-indigo-90);
      font-weight: 500;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: -0.02em;

      cursor: pointer;
      background: transparent;
      border-radius: 1000px;
      padding: 10px 12px;
      height: 34px;

      border: none;
      font-family: inherit;

      + button {
        margin-inline-start: 6px;
      }

      transition: color 0.2s ease-out, opacity 0.2s ease-out;

      &:active,
      &:focus {
        outline: 2px solid rgba(0, 0, 0, 0);
      }

      &:hover {
        opacity: 0.7;
      }
    }
    button.active {
      color: #fff;

      &:hover {
        opacity: 1;
      }
    }

    &::after {
      content: "";
      z-index: -1;
      background: var(--c-capacitor-blue);
      position: absolute;
      left: var(--tab-left);
      height: 34px;
      width: var(--tab-width);
      border-radius: 1000px;

      transition: width 0.2s cubic-bezier(0.22, 0.62, 0.04, 0.93),
        left 0.2s cubic-bezier(0.22, 0.62, 0.04, 0.93);
    }
  }

  .background {
    overflow: hidden;
    border-radius: 16px;
    background: #00233a;
  }

  .code-wrapper {
    display: flex;
    background: #00233a;

    position: relative;
    left: var(--code-left);

    transition: left 500ms cubic-bezier(0.4, 0, 0.2, 1);

    article {
      min-width: 100%;
    }
  }
`;

export default CodeTabsStyles;
