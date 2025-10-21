export const handleLanguageError = (error, context = "unknown") => {
  console.error(`❌ Language Error [${context}]:`, error.message)
}
