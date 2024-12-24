import { Metadata } from 'next'
import DashboardPage from '@/components/DashboardPage'

export const metadata: Metadata = {
  title: 'Broker Analytics Dashboard',
  description: 'Track and analyze your Webull and Robinhood account performance',
}

export default function Home() {
  return (
    <main>
      <DashboardPage />
    </main>
  )
}

