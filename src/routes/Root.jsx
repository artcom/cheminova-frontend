import { allContentQuery } from "@/api/queries"
import useGlobalState from "@/hooks/useGlobalState"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { Outlet } from "react-router-dom"
import { styled } from "styled-components"

import Imprint from "@ui/Imprint"
import MobileOnlyGuard from "@ui/MobileOnlyGuard"
import Privacy from "@ui/Privacy"

import ErrorPage from "./ErrorPage"

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
  position: relative;
`

const ScrollContainer = styled(AppContainer)`
  overflow: auto;
`

export const id = "root"

export async function clientLoader() {
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const data = await queryClient.ensureQueryData(query)
  return { locale, hasContent: Array.isArray(data) && data.length > 0 }
}

export function ErrorBoundary() {
  return (
    <AppLayout>
      <ErrorPage />
    </AppLayout>
  )
}

export function AppLayout({ children }) {
  const { showModal } = useGlobalState()

  if (showModal === "privacy") {
    return (
      <ScrollContainer>
        <Privacy />
      </ScrollContainer>
    )
  }

  if (showModal === "imprint") {
    return (
      <ScrollContainer>
        <Imprint />
      </ScrollContainer>
    )
  }

  return (
    <MobileOnlyGuard>
      <AppContainer>{children ?? <Outlet />}</AppContainer>
    </MobileOnlyGuard>
  )
}

export default function Root() {
  return <AppLayout />
}
