import { motion } from "framer-motion"
import styled from "styled-components"

const Wrapper = styled(motion.div)`
  position: absolute;
  width: 340px;
  display: flex;
  flex-direction: column;
  transform-origin: top center;
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

  /* Optional: Add a small "connector" curve if desired, but user asked for simple non-skewed first */
`

const CardBody = styled.div`
  background-color: #f0efe9;
  border-radius: 0 24px 24px 24px;
  border-top-left-radius: 24px;
  /* If the latch is on the left, we might want the top-left radius to be different or handled by the latch visual flow. 
     For a simple "tab" look, we can keep the card rounded. 
     But to make it look continuous, the latch usually sits on a straight edge or handles the corner.
     Let's assume the latch is an extension of the top edge. */
  border-radius: 24px;
  /* We need to flatten the part under the latch if we want it perfect, 
     but overlapping usually works if Latch is wide enough. 
     Let's stick to the requested "border goes around" look. */

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
  border: 3px solid #000; /* Optional: adds to the "bordered" aesthetic */

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

export function LogbookCard({ data, style, drag, onDragEnd, ...props }) {
  return (
    <Wrapper
      style={style}
      drag={drag}
      dragConstraints={{ left: -1000, right: 1000, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      {...props}
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
