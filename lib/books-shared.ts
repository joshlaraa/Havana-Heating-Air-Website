export const expenseCategories = [
  'Parts & materials', 'Equipment', 'Tools', 'Fuel', 'Vehicle maintenance', 'Permits & licenses',
  'Insurance', 'Advertising', 'Supplies', 'Subcontractor', 'Software & office', 'Meals', 'Other',
] as const
/** Categories where sales tax paid at the supplier is worth tracking. */
export const materialCategories = ['Parts & materials', 'Equipment', 'Tools', 'Supplies'] as const
export const paymentMethodsExpense = ['Card', 'Cash', 'Check', 'Bank transfer', 'Other'] as const
export const tripPurposes = ['Job site', 'Estimate visit', 'Supply run', 'Other'] as const

export type ExpenseRow = {
  id: string; expense_date: string; category: string; vendor: string; amount: number
  payment_method: string; notes: string; sales_tax_paid: number; gallons: number | null; odometer: number | null
  receipt_path: string | null; created_at: string
}
export type TripRow = {
  id: string; trip_date: string; start_odometer: number | null; end_odometer: number | null
  miles: number; purpose: string; customer_name: string; notes: string; created_at: string
}

export const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const isoDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime())

/** Average MPG from consecutive fill-ups that have odometer + gallons. */
export function fuelStats(rows: ExpenseRow[]) {
  const fills = rows.filter((r) => r.category === 'Fuel' && r.gallons && r.odometer).sort((a, b) => (a.odometer! - b.odometer!))
  let miles = 0, gallons = 0
  for (let i = 1; i < fills.length; i++) {
    const d = fills[i].odometer! - fills[i - 1].odometer!
    if (d > 0) { miles += d; gallons += fills[i].gallons! }
  }
  return { mpg: gallons ? miles / gallons : null }
}

