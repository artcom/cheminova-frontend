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

export const id = "root"

export async function clientLoader() {
  const { locale, content } = await loadCmsContent()
  return {
    locale,
    hasContent: Array.isArray(content) && content.length > 0,
  }
}

export function ErrorBoundary() {
  return (
    <AppLayout>
      <ErrorPage />
    </AppLayout>
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
