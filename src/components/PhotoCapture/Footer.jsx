import { useLoaderData, useNavigate } from "react-router-dom"

import SmallButton from "../UI/SmallButton"
import { Footer, PaginationContainer, PaginationDot } from "./styles"

export default function FooterContainer({ taskMetadata, currentTaskIndex }) {
  const { characterSlug } = useLoaderData()
  const navigate = useNavigate()

  return (
    <Footer>
      <PaginationContainer>
        {taskMetadata.map((_, index) => (
          <PaginationDot key={index} $isActive={index === currentTaskIndex} />
        ))}
      </PaginationContainer>
      <SmallButton
        color="#FFF"
        onClick={() => navigate(`/characters/${characterSlug}/exploration`)}
      >
        {"Continue"}
      </SmallButton>
    </Footer>
  )
}
