//import useGlobalState from "@hooks/useGlobalState"
//import DemoPage from "@components/DemoPage"
import Gallery from "@components/Gallery"

export default function App() {
  //const { selectedCharacter, setSelectedCharacter } = useGlobalState()

  return (
    <>
      {/* <h1> Cheminova Frontend</h1>
      <p> Selected Character: {selectedCharacter ?? "none Selected"}</p>
      <button
        onClick={() =>
          setSelectedCharacter(selectedCharacter === "bob" ? "alice" : "bob")
        }
      >
        Set selected character to{" "}
        {selectedCharacter === "bob" ? "alice" : "bob"}
      </button> */}
      <Gallery />
    </>
  )
}
