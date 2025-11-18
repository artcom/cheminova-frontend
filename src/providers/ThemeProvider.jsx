import { theme } from "@providers/theme"
import { ThemeProvider } from "styled-components"

export default function AppThemeProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
