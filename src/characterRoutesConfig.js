export const CHARACTER_FLOWS = {
  janitor: [
    "introduction",
    "photo-capture",
    "exploration",
    "perspective",
    "upload",
    "logbook",
    "logbook-create",
    "ending",
  ],
  artist: [
    "introduction",
    "photo-capture",
    "exploration",
    "perspective",
    "upload",
    "gallery",
    "ending",
  ],
  future: [
    "introduction",
    "photo-capture",
    "exploration",
    "perspective",
    "upload",
    "logbook-create",
    "timeline",
    "ending",
  ],
}

export const getNextRoute = (characterSlug, currentStep) => {
  const flow = CHARACTER_FLOWS[characterSlug]
  if (!flow) return "ending"

  const currentIndex = flow.indexOf(currentStep)
  if (currentIndex === -1 || currentIndex === flow.length - 1) {
    return "ending"
  }

  return flow[currentIndex + 1]
}
