import { motion } from "framer-motion"
import styled from "styled-components"

const Wrapper = styled(motion.div)`
  position: absolute;
  width: min(21.25rem, 90vw);
  display: flex;
  flex-direction: column;
  transform-origin: top center;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`

const LatchContainer = styled.div`
  height: 1.875rem;
  position: relative;
  z-index: 3; /* Sit on top of CardBody */
  margin-bottom: -2px; /* Overlap the border width */
  padding-left: 1.5rem; /* Align with card padding or desired offset */
`

const Latch = styled.div`
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  height: 1.875rem;
  width: 7.5rem;
  background: #f0efe9;
  position: relative;
  border: 3px solid #000;
  border-bottom: none;
`

const CardBody = styled.div`
  background-color: #f0efe9;
  border-radius: 1.5rem;
  border: 3px solid #000;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
  position: relative;
  z-index: 2;
`

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 1rem;
  overflow: hidden;
  background-color: #ddd;
  border: 3px solid #000;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: #1a1a1a;
`

const Title = styled.h2`
  font-family: "Bricolage Grotesque Variable", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
`

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
  opacity: 0.8;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 0.75rem;
  margin-top: 0.25rem;
`

const variants = {
  top: { zIndex: 3, y: 0, scale: 1, opacity: 1, x: 0, rotate: 0 },
  middle: { zIndex: 2, y: 15, scale: 0.95, opacity: 1, x: 0, rotate: 0 },
  bottom: { zIndex: 1, y: 30, scale: 0.9, opacity: 1, x: 0, rotate: 0 },
  back: { zIndex: 0, y: 45, scale: 0.85, opacity: 0, x: 0, rotate: 0 },
}

export function LogbookCard({ data, index, onSwipe }) {
  const isTop = index === 0
  const variant = index === 0 ? "top" : index === 1 ? "middle" : "bottom"

  return (
    <Wrapper
      variants={variants}
      initial="back"
      animate={variant}
      exit="back"
      drag={isTop ? "x" : false}
      dragSnapToOrigin
      onDragEnd={(e, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onSwipe()
        }
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <LatchContainer>
        <Latch />
      </LatchContainer>
      <CardBody>
        <ImageContainer>
          <img src={data.image} alt={data.title} />
        </ImageContainer>
        <Content>
          <Title>{data.uploaded_text || data.title}</Title>
          <Meta>
            {data.uploaded_user_name && <span>{data.uploaded_user_name}</span>}
            <span>{data.date}</span>
          </Meta>
        </Content>
      </CardBody>
    </Wrapper>
  )
}
