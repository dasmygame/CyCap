import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CreateTraceForm } from './_components/create-trace-form'
import { PageContainer } from '@/components/page-container'

export default async function CreateTracePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Your Trace</h1>
          <p className="mt-2 text-muted-foreground">
            Share your trading journey and build a community around your strategy.
          </p>
        </div>
        <CreateTraceForm userId={session.user.id} />
      </div>
    </PageContainer>
  )
} 