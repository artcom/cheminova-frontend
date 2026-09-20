import { css } from "styled-components"

// Shared block spacing for CMS rich text, which renders real <p>/<ul>/<a>
// elements inside layouts that were built for a single text run.
export const richTextStyles = css`
  p {
    margin: 0 0 0.75em;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 0 0 0.75em;
    padding-left: 1.25em;
  }

  ul:last-child,
  ol:last-child {
    margin-bottom: 0;
  }

  li {
    margin: 0 0 0.25em;
  }

  a {
    color: inherit;
    text-decoration: underline;
  }
`
