import Button from "@ui/Button"
import Headline from "@ui/Headline"
import SubHeadline from "@ui/SubHeadline"
import IconButton from "@ui/IconButton"

export default function DemoPage() {
  return (
    <div
      style={{
        backgroundColor: "lightgray",
      }}
    >
      <Headline> Demo Page</Headline>
      <SubHeadline>This is a demo page</SubHeadline>
      <Button onClick={() => console.log("Button clicked!")}>Click Me!</Button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <IconButton
          variant="arrowDown"
          onClick={() => console.log("Arrow Down clicked!")}
        />
        <IconButton
          disabled
          variant="arrowDown"
          onClick={() => console.log("Arrow Down clicked!")}
        />
        <IconButton
          variant="camera"
          onClick={() => console.log("Camera clicked!")}
        />
        <IconButton
          disabled
          variant="camera"
          onClick={() => console.log("Camera clicked!")}
        />
      </div>
    </div>
  )
}
