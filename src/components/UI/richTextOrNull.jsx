import { hasRichTextContent } from "@/utils/richText"

import RichText from "./RichText"

// For slots that take a node and must hide themselves when the CMS field is empty.
export const richTextOrNull = (html) =>
  hasRichTextContent(html) ? <RichText html={html} /> : null
