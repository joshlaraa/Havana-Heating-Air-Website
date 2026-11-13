import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'
import { RECEIPT_BUCKET } from '@/lib/books'
import { expenseCategories, isoDate, materialCategories, paymentMethodsExpense } from '@/lib/books-shared'

const optNum = (v: FormDataEntryValue | null) => {
  if (v === null || String(v).trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : NaN
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const form = await request.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Invalid form.' }, { status: 400 })
  const date = form.get('date')
  const category = String(form.get('category') ?? '')
  const method = String(form.get('paymentMethod') ?? 'Card')
  const amount = Number(form.get('amount'))
  const gallons = optNum(form.get('gallons'))
  const odometer = optNum(form.get('odometer'))
  if (!isoDate(date)) return NextResponse.json({ error: 'Enter a valid date.' }, { status: 400 })
  if (!(expenseCategories as readonly string[]).includes(category)) return NextResponse.json({ error: 'Choose a category.' }, { status: 400 })
  if (!(paymentMethodsExpense as readonly string[]).includes(method)) return NextResponse.json({ error: 'Invalid payment method.' }, { status: 400 })
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10_000_000) return NextResponse.json({ error: 'Enter an amount greater than zero.' }, { status: 400 })
  const salesTax = optNum(form.get('salesTax')) ?? 0
  if (Number.isNaN(salesTax) || salesTax > amount) return NextResponse.json({ error: 'Sales tax cannot be more than the total amount.' }, { status: 400 })
  if (Number.isNaN(gallons) || Number.isNaN(odometer)) return NextResponse.json({ error: 'Gallons and odometer must be numbers.' }, { status: 400 })

  const db = supabase()
  let receiptPath: string | null = null
  const file = form.get('receipt')
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith('image/') || file.size > 4_000_000) return NextResponse.json({ error: 'Receipt must be an image under 4 MB.' }, { status: 400 })
    await db.storage.createBucket(RECEIPT_BUCKET, { public: false }).catch(() => null)
    receiptPath = `${date.slice(0, 4)}/${crypto.randomUUID()}.jpg`
    const { error } = await db.storage.from(RECEIPT_BUCKET).upload(receiptPath, await file.arrayBuffer(), { contentType: file.type })
    if (error) return NextResponse.json({ error: 'Could not upload the receipt.' }, { status: 500 })
  }
  const { error } = await db.from('expenses').insert({
    expense_date: date, category, vendor: String(form.get('vendor') ?? '').trim().slice(0, 120), amount,
    payment_method: method, notes: String(form.get('notes') ?? '').trim().slice(0, 500),
    sales_tax_paid: (materialCategories as readonly string[]).includes(category) ? salesTax : 0,
    gallons: category === 'Fuel' ? gallons : null, odometer, receipt_path: receiptPath,
  })
  if (error) {
    if (receiptPath) await db.storage.from(RECEIPT_BUCKET).remove([receiptPath])
    console.error(error)
    return NextResponse.json({ error: 'Could not save the expense.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
