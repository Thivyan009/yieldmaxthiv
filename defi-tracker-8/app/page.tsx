import { Suspense } from 'react'
import { YieldTable } from '@/components/yield-table'
import { StatsCards } from '@/components/stats-cards'
import { FilterBar } from '@/components/filter-bar'
import { Header } from '@/components/header'
import { Loading } from './loading'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<Loading />}>
          <StatsCards />
          <FilterBar />
          <YieldTable />
        </Suspense>
      </div>
    </main>
  )
}
