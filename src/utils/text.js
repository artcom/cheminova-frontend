export const sanitizeRichText = (value, options = {}) => {
  const { trim = false } = options

  if (typeof value !== "string") {
    return ""
  }

  // Replace HTML tags with a space to prevent words from merging
  const withoutTags = value.replace(/<[^>]*>/g, " ")
  // Normalize multiple spaces into one and trim
  const normalized = withoutTags.replace(/\s+/g, " ")

  return trim ? normalized.trim() : normalized
}
