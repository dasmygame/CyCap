import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BackgroundBeams } from '@/components/BackgroundBeams'

export const metadata = {
  title: 'CYCAP - Community Trading Platform',
  description: 'Join verified trading communities, track performance, and execute trades with precision.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="relative min-h-screen overflow-hidden">
          <BackgroundBeams className="opacity-30" />
          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

