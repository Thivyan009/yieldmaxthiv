import { fetchYieldData } from '@/lib/api'
import { DataTable } from './data-table'
import { columns } from './columns'

export async function YieldTable() {
  const data = await fetchYieldData()
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
} 