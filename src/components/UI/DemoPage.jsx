import Button from "@ui/Button"
import Header from "@ui/Header"
import IconButton from "@ui/IconButton"

export default function DemoPage() {
  return (
    <div
      style={{
        backgroundColor: "lightgray",
      }}
    >
      <Header headline="Demo Page" subheadline="This is a demo page" />
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
