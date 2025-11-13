export const getCharacterPersonaFlags = (characterSlug) => {
  const normalizedSlug = characterSlug?.toLowerCase?.() ?? ""

  return {
    isArtist: normalizedSlug === "artist",
    isFuturePerson: normalizedSlug === "future",
    isJanitor: normalizedSlug === "janitor",
  }
}
