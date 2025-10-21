import { useGalleryImages } from "@/hooks/useGallery"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { styled } from "styled-components"

const GalleryContainer = styled.div`
  width: 100%;
  padding: 20px;
  background: #1a1a1a;
  color: white;
  min-height: 100vh;
`

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #ffffff;
`

const Subtitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #cccccc;
`

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ active }) => (active ? "#6c5ce7" : "#333")};
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: ${({ active }) => (active ? "#5b4bd7" : "#444")};
  }
`

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const ImageCard = styled.div`
  background: #2a2a2a;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #333;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ImageInfo = styled.div`
  padding: 0.75rem;
`

const ImageTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
`

const ImageDate = styled.p`
  font-size: 0.8rem;
  color: #888;
  margin: 0;
`

const TaskBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  background: #4a90e2;
  color: white;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
`

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  padding: 2rem;
`

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #ff6b6b;
  padding: 2rem;
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

const NoImagesMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #888;
  font-size: 1.1rem;
`

export default function UploadedImagesGallery() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState("all")
  const [selectedImage, setSelectedImage] = useState(null)

  // Fetch all gallery images
  const {
    data: allImages,
    isLoading,
    error,
  } = useGalleryImages({ enabled: true })

  const displayImages = allImages?.images || []

  // Filter images by type
  const filteredImages = displayImages.filter((item) => {
    if (filter === "all") return true
    return item.task_type === filter
  })

  // Count images by type
  const taskCounts = {
    all: displayImages.length,
    la_nau: displayImages.filter((item) => item.task_type === "la_nau").length,
    surroundings: displayImages.filter(
      (item) => item.task_type === "surroundings",
    ).length,
    special: displayImages.filter((item) => item.task_type === "special")
      .length,
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <GalleryContainer>
        <LoadingMessage>
          {t("gallery.loading", "Loading images...")}
        </LoadingMessage>
      </GalleryContainer>
    )
  }

  if (error) {
    return (
      <GalleryContainer>
        <ErrorMessage>
          {t("gallery.error", "Error loading images")}: {error.message}
        </ErrorMessage>
      </GalleryContainer>
    )
  }

  return (
    <GalleryContainer>
      <Title>{t("gallery.uploadedImages", "Uploaded Images")}</Title>

      <FilterButtons>
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          {t("gallery.all", "All")} ({taskCounts.all})
        </FilterButton>
        <FilterButton
          active={filter === "la_nau"}
          onClick={() => setFilter("la_nau")}
        >
          La Nau ({taskCounts.la_nau})
        </FilterButton>
        <FilterButton
          active={filter === "surroundings"}
          onClick={() => setFilter("surroundings")}
        >
          {t("gallery.surroundings", "Surroundings")} ({taskCounts.surroundings}
          )
        </FilterButton>
        <FilterButton
          active={filter === "special"}
          onClick={() => setFilter("special")}
        >
          {t("gallery.special", "Special")} ({taskCounts.special})
        </FilterButton>
      </FilterButtons>

      {filteredImages.length === 0 ? (
        <NoImagesMessage>
          {filter === "all"
            ? t("gallery.noImages", "No images uploaded yet")
            : t("gallery.noImagesForFilter", `No ${filter} images found`)}
        </NoImagesMessage>
      ) : (
        <>
          <Subtitle>
            {filter === "all" && t("gallery.allImages", "All Images")}
            {filter === "la_nau" && "La Nau"}
            {filter === "surroundings" &&
              t("gallery.surroundings", "Surroundings")}
            {filter === "special" && t("gallery.special", "Special")} (
            {filteredImages.length})
          </Subtitle>

          <ImagesGrid>
            {filteredImages.map((item) => (
              <ImageCard
                key={item.image.id}
                onClick={() => setSelectedImage(item.image)}
              >
                <ImageWrapper>
                  <Image
                    src={item.image.image}
                    alt={item.image.title}
                    loading="lazy"
                  />
                </ImageWrapper>
                <ImageInfo>
                  <ImageTitle>{item.image.title}</ImageTitle>
                  <ImageDate>{formatDate(item.image.created_at)}</ImageDate>
                  <TaskBadge taskType={item.task_type}>
                    {item.task_display}
                  </TaskBadge>
                </ImageInfo>
              </ImageCard>
            ))}
          </ImagesGrid>
        </>
      )}

      {selectedImage && (
        <Modal onClick={() => setSelectedImage(null)}>
          <CloseButton onClick={() => setSelectedImage(null)}>×</CloseButton>
          <ModalImage
            src={selectedImage.image}
            alt={selectedImage.title}
            onClick={(e) => e.stopPropagation()}
          />
        </Modal>
      )}
    </GalleryContainer>
  )
}
