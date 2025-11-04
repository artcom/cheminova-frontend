import { isRouteErrorResponse, useRouteError } from "react-router-dom"
import { styled } from "styled-components"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
  gap: 1.5rem;
  text-align: center;
`

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
`

const Message = styled.p`
  font-size: 1rem;
  max-width: 28rem;
`

const ErrorDetails = styled.pre`
  margin-top: 1rem;
  text-align: left;
  width: 100%;
  max-width: 28rem;
  overflow: auto;
  white-space: pre-wrap;
`

export default function ErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <Wrapper>
        <Title>Something went wrong</Title>
        <Message>
          {error.status} {error.statusText}
        </Message>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Title>Unexpected application error</Title>
      <Message>
        {error instanceof Error ? error.message : "An unknown error occurred."}
      </Message>
      {error instanceof Error && <ErrorDetails>{error.stack}</ErrorDetails>}
      {console.log(error)}
    </Wrapper>
  )
}
