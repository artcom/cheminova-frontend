import { createElement, Fragment } from "react"

import { sanitizeRichText } from "./text"

const TEXT_NODE = 3
const ELEMENT_NODE = 1

// Tags the CMS may produce that we render. Everything else degrades to its
// text content, so no unexpected markup can reach the DOM.
const ALLOWED_ELEMENTS = {
  p: "p",
  br: "br",
  b: "strong",
  strong: "strong",
  i: "em",
  em: "em",
  u: "u",
  ul: "ul",
  ol: "ol",
  li: "li",
  a: "a",
}

// Wagtail embeds and anything script-like are dropped including their content.
const DROPPED_ELEMENTS = new Set([
  "embed",
  "script",
  "style",
  "iframe",
  "object",
])

const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/i
const EXTERNAL_HREF = /^https?:\/\//i

const parseBody = (html) =>
  new DOMParser().parseFromString(html, "text/html").body

// Wagtail stores internal links as <a linktype="page" id="7"> without an href.
// Those cannot be resolved in the frontend, so the link text is rendered plain.
const linkProps = (element) => {
  const href = element.getAttribute("href")

  if (!href || !SAFE_HREF.test(href)) {
    return null
  }

  return EXTERNAL_HREF.test(href)
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href }
}

const renderChildren = (node) =>
  Array.from(node.childNodes)
    .map((child, index) => renderNode(child, index))
    .filter((child) => child !== null && child !== "")

const renderNode = (node, key) => {
  if (node.nodeType === TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType !== ELEMENT_NODE) {
    return null
  }

  const tagName = node.tagName.toLowerCase()

  if (DROPPED_ELEMENTS.has(tagName)) {
    return null
  }

  const tag = ALLOWED_ELEMENTS[tagName]

  if (tag === "br") {
    return createElement("br", { key })
  }

  const children = renderChildren(node)

  if (!tag) {
    return children.length > 0
      ? createElement(Fragment, { key }, children)
      : null
  }

  if (tag === "a") {
    const props = linkProps(node)

    return props
      ? createElement("a", { key, ...props }, children)
      : createElement(Fragment, { key }, children)
  }

  return createElement(tag, { key }, children)
}

export const hasRichTextContent = (value) => {
  if (typeof value !== "string") {
    return false
  }

  if (typeof DOMParser === "undefined") {
    return sanitizeRichText(value, { trim: true }) !== ""
  }

  return (parseBody(value).textContent ?? "").replace(/\s+/g, "") !== ""
}

export const renderRichText = (value) => {
  // Wagtail keeps empty paragraphs in the stored HTML, so "no text at all"
  // has to be checked before anything is rendered.
  if (!hasRichTextContent(value)) {
    return null
  }

  if (typeof DOMParser === "undefined") {
    return sanitizeRichText(value, { trim: true }) || null
  }

  const children = renderChildren(parseBody(value))

  return children.length > 0 ? children : null
}
