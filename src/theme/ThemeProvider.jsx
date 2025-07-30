import { ThemeProvider } from "styled-components"
import { theme } from "@theme"

export default function AppThemeProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
