import { motion } from "framer-motion"
import styled from "styled-components"

const Wrapper = styled(motion.div)`
  position: absolute;
  width: 340px;
  display: flex;
  flex-direction: column;
  transform-origin: top center;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`

const LatchContainer = styled.div`
  height: 30px;
  position: relative;
  z-index: 3; /* Sit on top of CardBody */
  margin-bottom: -2px; /* Overlap the border width */
  padding-left: 24px; /* Align with card padding or desired offset */
`

const Latch = styled.div`
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  height: 30px;
  width: 120px;
  background: #f0efe9;
  position: relative;
  border: 3px solid #000;
  border-bottom: none;
`

const CardBody = styled.div`
  background-color: #f0efe9;
  border-radius: 24px;
  border: 3px solid #000;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  position: relative;
  z-index: 2;
`

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
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
  gap: 12px;
  color: #1a1a1a;
`

const Title = styled.h2`
  font-family: "Bricolage Grotesque Variable", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
`

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  opacity: 0.8;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
  margin-top: 4px;
`

const Description = styled.p`
  font-size: 16px;
  line-height: 1.4;
  margin: 0;
  margin-top: 8px;
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
          <Title>{data.title}</Title>
          <Meta>
            <span>{data.date}</span>
          </Meta>
          <Description>{data.description}</Description>
        </Content>
      </CardBody>
    </Wrapper>
  )
}
