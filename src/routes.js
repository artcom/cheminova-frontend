import { index, route } from "@react-router/dev/routes"

export default [
  route("/", "./routes/Root.jsx", [
    index("./components/Welcome/Welcome.jsx"),
    route("characters/:characterId", "./routes/CharacterLayout.jsx", [
      index("./routes/CharacterIndex.jsx"),
      route("introduction", "./components/Introduction/Introduction.jsx"),
      route("photo-capture", "./components/PhotoCapture/PhotoCapture.jsx"),
      route("exploration", "./components/Exploration/Exploration.jsx"),
      route("perspective", "./components/Perspective/Perspective.jsx"),
      route("upload", "./components/Upload/Upload.jsx"),
      route("gallery", "./components/Gallery/Gallery.jsx"),
      route("ending", "./components/Ending/Ending.jsx"),
    ]),
  ]),
]
