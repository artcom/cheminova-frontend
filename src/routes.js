import { index, route } from "@react-router/dev/routes"

export default [
  route("/", "./routes/AppRoot.jsx", [
    route("/", "./components/Welcome/WelcomeLayout.jsx", [
      index("./components/Welcome/Steps/WelcomeLanguage.jsx"),
      route("intro", "./components/Welcome/Steps/WelcomeIntro.jsx"),

      route("onboarding", "./components/Welcome/Steps/CharacterOnboarding.jsx"),
      route("characters", "./components/Welcome/Steps/CharacterSelection.jsx"),
    ]),
    route("imprint", "./components/UI/Imprint.jsx"),
    route("privacy", "./components/UI/Privacy.jsx"),
    route("characters/:characterId", "./routes/CharacterLayout.jsx", [
      index("./routes/CharacterIndex.jsx"),
      route("introduction", "./components/Introduction/Introduction.jsx"),
      route("photo-capture", "./components/PhotoCapture/PhotoCapture.jsx"),
      route("exploration", "./components/Exploration/Exploration.jsx"),
      route("perspective", "./components/Perspective/Perspective.jsx"),
      route("upload", "./components/Upload/Upload.jsx"),
      route("logbook-create", "./components/Logbook/LogbookCreate.jsx"),
      route("gallery", "./components/Gallery/Gallery.jsx"),
      route("timeline", "./components/FutureTimeline/FutureTimeline.jsx"),
      route("logbook", "./components/JanitorLogbook/JanitorLogbook.jsx"),
      route("ending", "./components/Ending/Ending.jsx"),
    ]),
  ]),
]
