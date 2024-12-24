import { ThemeProvider } from "@/components/theme-provider"

export default function Layout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}

