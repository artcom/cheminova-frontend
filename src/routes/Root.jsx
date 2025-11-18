import { loadCmsContent } from "@/utils/loaderHelpers"
import { Outlet } from "react-router-dom"
import { styled } from "styled-components"

import MobileOnlyGuard from "@ui/MobileOnlyGuard"

import ErrorPage from "./ErrorPage"

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
  position: relative;
`

const ErrorScreen = styled.div`
  width: 100dvw;
  height: 100dvh;
  background: ${({ theme }) => theme.colors.background.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`

export const id = "root"

export const clientLoader = async () => {
  const { locale, content } = await loadCmsContent()
  return {
    locale,
    hasContent: Array.isArray(content) && content.length > 0,
  }
}

export function ErrorBoundary() {
  return (
    <ErrorScreen>
      <ErrorPage />
    </ErrorScreen>
  )
}

export function AppLayout({ children }) {
  return (
    <MobileOnlyGuard>
      <AppContainer>{children ?? <Outlet />}</AppContainer>
    </MobileOnlyGuard>
  )
}

export default function Root() {
  return <AppLayout />
}
