import { styled } from "styled-components"

export const GalleryContainer = styled.div`
  width: 100%;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background.dark};
  color: ${({ theme }) => theme.colors.text.inverse};
  min-height: 100vh;
`

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.inverse};
`

export const Subtitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

export const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`

export const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary.main : theme.colors.background.button};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.primary.dark : "#444"};
  }
`

export const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

export const ImageCard = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`

export const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #333;
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const ImageInfo = styled.div`
  padding: 0.75rem;
`

export const ImageTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.text.inverse};
`

export const ImageDate = styled.p`
  font-size: 0.8rem;
  color: #888;
  margin: 0;
`

export const TaskBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  background: #4a90e2;
  color: white;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
`

export const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  padding: 2rem;
`

export const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #ff6b6b;
  padding: 2rem;
`

export const Modal = styled.div`
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

export const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`

export const CloseButton = styled.button`
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

export const NoImagesMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #888;
  font-size: 1.1rem;
`
