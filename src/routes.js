import { index, layout, route } from "@react-router/dev/routes"

export default [
  route("/", "./routes/AppRoot.jsx", [
    index("./routes/ExperienceIndex.jsx"),
    layout("./routes/CharacterScope.jsx", [
      route("page/:pageId", "./routes/ExperiencePage.jsx"),
    ]),
    route("imprint", "./components/UI/Imprint.jsx"),
    route("privacy", "./components/UI/Privacy.jsx"),
  ]),
]
