import { getNextRoute } from "@/characterRoutesConfig"
import useCapturedImages from "@/hooks/useCapturedImages"
import usePhotoTasks from "@/hooks/usePhotoTasks"
import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import { useUploadImage } from "../Upload/useUploadImage"
import {
  Card,
  CharCount,
  CheckButton,
  Container,
  DateText,
  Footer,
  Header,
  Info,
  Input,
  TextArea,
  Thumbnail,
  Title,
} from "./styles"

const dataURLToFile = (dataURL, filename) => {
  const [metadata, base64Data] = dataURL.split(",")
  const mimeMatch = metadata.match(/:(.*?);/)
  const binaryString = atob(base64Data)
  const length = binaryString.length
  const u8arr = new Uint8Array(length)

  for (let i = 0; i < length; i++) {
    u8arr[i] = binaryString.charCodeAt(i)
  }

  return new File([u8arr], filename, { type: mimeMatch[1] })
}

export default function LogbookCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const { characterId } = useParams()
  // Use characterId as the slug since that's how it's passed in routes
  const characterSlug = characterId
  const { capturedImages } = useCapturedImages()
  const { tasks } = usePhotoTasks()
  const [description, setDescription] = useState("")
  const [userName, setUserName] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const uploadImageMutation = useUploadImage()
  const isUploading = uploadImageMutation.isPending

  // Get the selected task index from navigation state, default to 0
  const taskIndex = location.state?.taskIndex || 0

  // Get the specific image and task based on the index
  // We need to map the filtered "valid" images from Upload back to the original index if needed,
  // but here we assume capturedImages matches the tasks index directly.
  // However, in Upload.jsx we filtered for valid images.
  // Let's assume for now capturedImages is the source of truth and index aligns with tasks.
  const image = capturedImages ? capturedImages[taskIndex] : null
  const taskTitle = tasks ? tasks[taskIndex] : "Signs of wear or damage"

  const currentDate = new Date().toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const handleSave = async () => {
    if (!image || isUploading) return

    try {
      const file = dataURLToFile(
        image,
        `logbook-${characterSlug}-${taskIndex}.jpg`,
      )

      console.log("Uploading file:", file)
      console.log("File size:", file.size)
      console.log("File type:", file.type)

      await uploadImageMutation.mutateAsync({
        file,
        text: description,
        userName,
        title: taskTitle,
      })

      setIsSuccess(true)
    } catch (error) {
      console.error("Upload failed:", error)
      // In a real app, we'd show a toast or error message here
      alert("Failed to upload. Please try again.")
    }
  }

  // ...

  const handleContinue = () => {
    const nextRoute = getNextRoute(characterSlug, "logbook-create")
    navigate(`/characters/${characterSlug}/${nextRoute}`)
  }

  if (!image) {
    return (
      <Container>
        <Header>No image selected</Header>
        <Footer>
          <CheckButton onClick={handleContinue}>
            Proceed without photos
          </CheckButton>
        </Footer>
      </Container>
    )
  }

  return (
    <Container>
      <Header>Inspect this spot</Header>

      <Card>
        <Thumbnail src={image} alt={taskTitle} />
        <Info>
          <Title>{taskTitle}</Title>
          <DateText>{currentDate}</DateText>
        </Info>
      </Card>

      <TextArea
        placeholder="Add text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isUploading || isSuccess}
        maxLength={255}
      />
      <CharCount>{description.length} / 255</CharCount>

      <Input
        placeholder="Your name (optional)"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        disabled={isUploading || isSuccess}
        maxLength={150}
      />
      <CharCount>{userName.length} / 150</CharCount>

      <Footer>
        {isSuccess ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span style={{ color: "#4cd964", fontWeight: 600 }}>
              Upload Successful!
            </span>
            <CheckButton onClick={handleContinue} aria-label="Continue">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </CheckButton>
          </div>
        ) : (
          <CheckButton
            onClick={handleSave}
            aria-label="Save"
            disabled={isUploading}
            style={{ opacity: isUploading ? 0.5 : 1 }}
          >
            {isUploading ? (
              // Simple spinner or loading state
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </CheckButton>
        )}
      </Footer>
      {isUploading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              width: 48,
              height: 48,
              animation: "spin 1s linear infinite",
            }}
            className="animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span style={{ color: "white", marginTop: 16, fontSize: 18 }}>
            Uploading...
          </span>
          <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
        </div>
      )}
    </Container>
  )
}
