import { isRouteErrorResponse, useRouteError } from "react-router-dom"
import { styled } from "styled-components"

const Page = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  padding: 0;
  color: rgba(255, 255, 255, 0.92);
`

const Content = styled.div`
  width: min(540px, 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem;
  gap: 1rem;
  text-align: left;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
`

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`

const Message = styled.p`
  font-size: 1rem;
  max-width: 28rem;
  margin: 0;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
`

const ErrorDetails = styled.pre`
  margin-top: 1rem;
  text-align: left;
  width: 100%;
  max-width: 28rem;
  overflow: auto;
  white-space: pre-wrap;
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.85rem;
  height: 100%;
`

export default function ErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <Page>
        <Content>
          <Title>Something went wrong</Title>
          <Message>
            {error.status} {error.statusText}
          </Message>
        </Content>
      </Page>
    )
  }

  return (
    <Page>
      <Content>
        <Title>Unexpected application error</Title>
        <Message>
          {error instanceof Error
            ? error.message
            : "An unknown error occurred."}
        </Message>
        {error instanceof Error && <ErrorDetails>{error.stack}</ErrorDetails>}
      </Content>
    </Page>
  )
}
