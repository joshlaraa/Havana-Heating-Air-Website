import { supabase } from '@/lib/supabase'
import type { ExpenseRow, TripRow } from '@/lib/books-shared'


export const RECEIPT_BUCKET = 'receipts'

export async function listExpenses(year: number) {
  const { data, error } = await supabase().from('expenses').select('*')
    .gte('expense_date', `${year}-01-01`).lte('expense_date', `${year}-12-31`)
    .order('expense_date', { ascending: false }).order('created_at', { ascending: false }).limit(1000)
  if (error) throw error
  return (data ?? []).map((r) => ({ ...r, amount: Number(r.amount), sales_tax_paid: Number(r.sales_tax_paid) || 0, gallons: r.gallons == null ? null : Number(r.gallons), odometer: r.odometer == null ? null : Number(r.odometer) })) as ExpenseRow[]
}

export async function listTrips(year: number) {
  const { data, error } = await supabase().from('trips').select('*')
    .gte('trip_date', `${year}-01-01`).lte('trip_date', `${year}-12-31`)
    .order('trip_date', { ascending: false }).order('created_at', { ascending: false }).limit(2000)
  if (error) throw error
  return (data ?? []).map((r) => ({ ...r, miles: Number(r.miles), start_odometer: r.start_odometer == null ? null : Number(r.start_odometer), end_odometer: r.end_odometer == null ? null : Number(r.end_odometer) })) as TripRow[]
}

export async function lastOdometer() {
  const db = supabase()
  const [{ data: t }, { data: e }] = await Promise.all([
    db.from('trips').select('end_odometer').not('end_odometer', 'is', null).order('trip_date', { ascending: false }).order('created_at', { ascending: false }).limit(1),
    db.from('expenses').select('odometer').not('odometer', 'is', null).order('expense_date', { ascending: false }).order('created_at', { ascending: false }).limit(1),
  ])
  return Math.max(Number(t?.[0]?.end_odometer) || 0, Number(e?.[0]?.odometer) || 0) || null
}


/**
 * IRS standard mileage rate (USD per business mile). Rates change each year;
 * set MILEAGE_RATE in the environment to override and confirm with his CPA.
 */
/** Rough share of net profit to set aside for income and self-employment tax. Override with SET_ASIDE_RATE (e.g. 0.3). */
export const setAsideRate = Number(process.env.SET_ASIDE_RATE) || 0.25
export const mileageRate = Number(process.env.MILEAGE_RATE) || 0.7

