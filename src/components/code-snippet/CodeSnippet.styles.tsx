import styled from "styled-components";

const CodeSnippetStyles = styled.div`
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
    background: #2d2d2d;
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
  min-width: 0;
  max-width: 100%;

  overflow-x: auto;
  border-radius: 16px;
  background: #00233a;

  .dollar-sign::before {
    content: "$ ";
    color: #4ebdfc;
  }

  :not(pre) > code[class*="language-"],
  pre[class*="language-"] {
    padding: 28px 32px;
    background: #00233a;
    margin: 0;
    width: fit-content;

    code {
      line-height: 1.8;
      display: block;
      font-family: "Roboto Mono", "Source Code Pro", monospace;
      font-size: 14px;
      color: var(--c-carbon-10);

      span {
        display: inline;
      }

      .token.selector,
      .token.important,
      .token.atrule,
      .token.keyword,
      .token.builtin {
        color: #4ebdfc;
      }

      .token.string,
      .token.char,
      .token.attr-value,
      .token.regex,
      .token.variable {
        color: #00e9ac;
      }
    }
  }

  pre.language-shell-session code {
    line-height: 200%;
  }

  // pre[class*="language-shell"] code::before {
  //   content: '$ '
  // }
`;

export default CodeSnippetStyles;
