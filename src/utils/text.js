export const sanitizeRichText = (value, options = {}) => {
  const { trim = false } = options

  if (typeof value !== "string") {
    return ""
  }

  const sanitized = value.replace(/<[^>]*>/g, "")
  return trim ? sanitized.trim() : sanitized
}

export const splitIntoParagraphs = (value) => {
  const sanitized = sanitizeRichText(value, { trim: true })

  if (!sanitized) {
    return []
  }

  return sanitized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
