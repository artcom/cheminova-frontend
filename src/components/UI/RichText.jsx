import { renderRichText } from "@/utils/richText"

export default function RichText({ html, as: Component = "div", className }) {
  const content = renderRichText(html)

  if (!content) {
    return null
  }

  return <Component className={className}>{content}</Component>
}
