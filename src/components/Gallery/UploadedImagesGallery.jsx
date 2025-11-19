import { useState } from "react"
import { useTranslation } from "react-i18next"
import { styled } from "styled-components"

import { useGalleryImages } from "./useGalleryImages"

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
    data: galleryImages = [],
    isLoading,
    error,
  } = useGalleryImages({ enabled: true })

  const displayImages = Array.isArray(galleryImages) ? galleryImages : []

  const getTaskType = (item) => item?.task_type || item?.task || "unknown"

  const filterLabels = {
    all: t("gallery.all", "All"),
    la_nau: t("gallery.laNau", "La Nau"),
    surroundings: t("gallery.surroundings", "Surroundings"),
    special: t("gallery.special", "Special"),
  }

  const activeFilterLabel = filterLabels[filter] || filter

  // Filter images by type
  const filteredImages = displayImages.filter((item) => {
    if (filter === "all") return true
    return getTaskType(item) === filter
  })

  // Count images by type
  const taskCounts = displayImages.reduce(
    (accumulator, item) => {
      const taskType = getTaskType(item)

      accumulator.all += 1

      if (accumulator[taskType] !== undefined) {
        accumulator[taskType] += 1
      }

      return accumulator
    },
    { all: 0, la_nau: 0, surroundings: 0, special: 0, unknown: 0 },
  )

  const formatDate = (dateString) => {
    if (!dateString) {
      return t("gallery.unknownDate", "Unknown date")
    }

    const parsed = new Date(dateString)
    if (Number.isNaN(parsed.getTime())) {
      return t("gallery.unknownDate", "Unknown date")
    }

    return parsed.toLocaleDateString()
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
          {filterLabels.la_nau} ({taskCounts.la_nau})
        </FilterButton>
        <FilterButton
          active={filter === "surroundings"}
          onClick={() => setFilter("surroundings")}
        >
          {filterLabels.surroundings} ({taskCounts.surroundings})
        </FilterButton>
        <FilterButton
          active={filter === "special"}
          onClick={() => setFilter("special")}
        >
          {filterLabels.special} ({taskCounts.special})
        </FilterButton>
      </FilterButtons>

      {filteredImages.length === 0 ? (
        <NoImagesMessage>
          {filter === "all"
            ? t("gallery.noImages", "No images uploaded yet")
            : t("gallery.noImagesForFilter", {
                defaultValue: `No ${activeFilterLabel} images found`,
                filter: activeFilterLabel,
              })}
        </NoImagesMessage>
      ) : (
        <>
          <Subtitle>
            {filter === "all"
              ? t("gallery.allImages", "All Images")
              : activeFilterLabel}{" "}
            ({filteredImages.length})
          </Subtitle>

          <ImagesGrid>
            {filteredImages.map((item) => (
              <ImageCard
                key={item.id ?? item.file}
                onClick={() => setSelectedImage(item)}
              >
                <ImageWrapper>
                  <Image
                    src={item.file}
                    alt={item.title || t("gallery.imageAlt", "Uploaded image")}
                    loading="lazy"
                  />
                </ImageWrapper>
                <ImageInfo>
                  <ImageTitle>
                    {item.title ||
                      item.uploaded_text ||
                      t("gallery.untitledImage", "Untitled image")}
                  </ImageTitle>
                  <ImageDate>{formatDate(item.created_at)}</ImageDate>
                  <TaskBadge taskType={getTaskType(item)}>
                    {item.task_display ||
                      item.task_type ||
                      t("gallery.unknownTask", "Unknown task")}
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
            src={selectedImage.file}
            alt={selectedImage.title || t("gallery.imageAlt", "Uploaded image")}
            onClick={(e) => e.stopPropagation()}
          />
        </Modal>
      )}
    </GalleryContainer>
  )
}
