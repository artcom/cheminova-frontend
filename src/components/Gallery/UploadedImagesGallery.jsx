import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  CloseButton,
  ErrorMessage,
  FilterButton,
  FilterButtons,
  GalleryContainer,
  Image,
  ImageCard,
  ImageDate,
  ImageInfo,
  ImagesGrid,
  ImageTitle,
  ImageWrapper,
  LoadingMessage,
  Modal,
  ModalImage,
  NoImagesMessage,
  Subtitle,
  TaskBadge,
  Title,
} from "./UploadedImagesGallery.styles"
import { useGalleryFilter } from "./useGalleryFilter"
import { useGalleryImages } from "./useGalleryImages"

export default function UploadedImagesGallery() {
  const { t } = useTranslation()
  const [selectedImage, setSelectedImage] = useState(null)

  // Fetch all gallery images
  const {
    data: galleryImages = [],
    isLoading,
    error,
  } = useGalleryImages({ enabled: true })

  const displayImages = Array.isArray(galleryImages) ? galleryImages : []

  const {
    filter,
    setFilter,
    filteredImages,
    taskCounts,
    filterLabels,
    activeFilterLabel,
    getTaskType,
  } = useGalleryFilter(displayImages)

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
