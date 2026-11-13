import AdminShell, { requireAdmin } from '@/components/admin-shell'
import TripManager from '@/components/trip-manager'
import { isSupabaseConfigured } from '@/lib/supabase'
import { lastOdometer, listExpenses, listTrips, mileageRate } from '@/lib/books'
import { fuelStats } from '@/lib/books-shared'

export const dynamic = 'force-dynamic'

export default async function MileagePage() {
  await requireAdmin()
  const year = new Date().getFullYear()
  let body: React.ReactNode
  if (!isSupabaseConfigured()) body = <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Database is not configured.</p>
  else {
    try {
      const [trips, expenses, odo] = await Promise.all([listTrips(year), listExpenses(year), lastOdometer()])
      const fuelCost = expenses.filter((e) => e.category === 'Fuel').reduce((s, e) => s + e.amount, 0)
      body = <TripManager rows={trips} year={year} rate={mileageRate} lastOdometer={odo} fuelCost={fuelCost} mpg={fuelStats(expenses).mpg} />
    } catch {
      body = <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">Could not load trips. Run the latest supabase/schema.sql in the Supabase SQL editor.</p>
    }
  }
  return <AdminShell active="mileage" title="Mileage" subtitle="Log business trips for the company vehicle. Start odometer fills in from your last entry.">{body}</AdminShell>
}
