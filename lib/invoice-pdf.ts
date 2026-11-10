import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { PDFDocument, PageSizes, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { business } from '@/lib/business'
import type { Invoice } from '@/lib/invoice-types'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const date = (value: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
const color = (hex: string) => rgb(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255)

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line)
      line = word
    } else line = candidate
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

function drawWrapped(page: PDFPage, text: string, x: number, y: number, width: number, font: PDFFont, size: number, fill = rgb(0.1, 0.12, 0.16)) {
  const lines = wrap(text, font, size, width)
  lines.forEach((line, index) => page.drawText(line, { x, y: y - index * (size + 3), size, font, color: fill }))
  return y - lines.length * (size + 3)
}

export async function generateInvoicePdf(invoice: Invoice) {
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont('Helvetica')
  const bold = await pdf.embedFont('Helvetica-Bold')
  const primary = color(business.colors.primary)
  const dark = color(business.colors.dark)
  const muted = color(business.colors.muted)
  const light = color(business.colors.light)
  const [width, height] = PageSizes.Letter
  let page = pdf.addPage(PageSizes.Letter)
  let y = height - 52

  const logoBytes = await readFile(join(process.cwd(), business.logoPath))
  const logo = await pdf.embedPng(logoBytes)
  page.drawImage(logo, { x: 42, y: height - 104, width: 58, height: 58 })
  page.drawText(business.name, { x: 114, y: height - 66, size: 19, font: bold, color: dark })
  page.drawText(business.address, { x: 114, y: height - 84, size: 9, font: regular, color: muted })
  page.drawText(business.phone, { x: 114, y: height - 98, size: 9, font: regular, color: muted })
  page.drawText(business.email, { x: 114, y: height - 112, size: 9, font: regular, color: muted })
  page.drawText('INVOICE', { x: 406, y: height - 66, size: 26, font: bold, color: primary })
  page.drawText(invoice.invoiceNumber, { x: 407, y: height - 84, size: 10, font: bold, color: dark })
  page.drawText(`Invoice date: ${date(invoice.invoiceDate)}`, { x: 407, y: height - 101, size: 9, font: regular, color: muted })
  page.drawText(`Due date: ${date(invoice.dueDate)}`, { x: 407, y: height - 115, size: 9, font: regular, color: muted })

  y = height - 150
  page.drawRectangle({ x: 42, y: y - 56, width: width - 84, height: 56, color: light })
  page.drawText('BILL TO', { x: 56, y: y - 20, size: 8, font: bold, color: primary })
  page.drawText(invoice.customerName, { x: 56, y: y - 35, size: 11, font: bold, color: dark })
  let customerY = y - 48
  customerY = drawWrapped(page, invoice.customerAddress, 56, customerY, 260, regular, 8, muted)
  if (invoice.customerEmail) page.drawText(invoice.customerEmail, { x: 342, y: y - 35, size: 8, font: regular, color: muted })
  if (invoice.customerPhone) page.drawText(invoice.customerPhone, { x: 342, y: y - 48, size: 8, font: regular, color: muted })

  y -= 88
  const columns = { description: 56, quantity: 342, unit: 398, amount: 490 }
  page.drawRectangle({ x: 42, y: y - 24, width: width - 84, height: 24, color: dark })
  page.drawText('SERVICE', { x: columns.description, y: y - 16, size: 8, font: bold, color: rgb(1, 1, 1) })
  page.drawText('QTY', { x: columns.quantity, y: y - 16, size: 8, font: bold, color: rgb(1, 1, 1) })
  page.drawText('UNIT PRICE', { x: columns.unit, y: y - 16, size: 8, font: bold, color: rgb(1, 1, 1) })
  page.drawText('AMOUNT', { x: columns.amount, y: y - 16, size: 8, font: bold, color: rgb(1, 1, 1) })
  y -= 42

  for (const item of invoice.items) {
    const descriptionLines = wrap(item.description, regular, 9, 270)
    const rowHeight = Math.max(24, descriptionLines.length * 12 + 10)
    if (y - rowHeight < 95) {
      page = pdf.addPage(PageSizes.Letter)
      y = height - 54
    }
    page.drawLine({ start: { x: 42, y: y + 9 }, end: { x: width - 42, y: y + 9 }, thickness: 0.5, color: light })
    descriptionLines.forEach((line, index) => page.drawText(line, { x: columns.description, y: y - index * 12, size: 9, font: regular, color: dark }))
    page.drawText(String(item.quantity), { x: columns.quantity, y, size: 9, font: regular, color: dark })
    page.drawText(money.format(item.unitPrice), { x: columns.unit, y, size: 9, font: regular, color: dark })
    page.drawText(money.format(item.quantity * item.unitPrice), { x: columns.amount, y, size: 9, font: bold, color: dark })
    y -= rowHeight
  }

  const summaryY = Math.max(y - 12, 230)
  const summaryX = 360
  page.drawText('Subtotal', { x: summaryX, y: summaryY, size: 9, font: regular, color: muted })
  page.drawText(money.format(invoice.totals.subtotal), { x: 490, y: summaryY, size: 9, font: regular, color: dark })
  page.drawText('Discount', { x: summaryX, y: summaryY - 18, size: 9, font: regular, color: muted })
  page.drawText(`-${money.format(invoice.totals.discount)}`, { x: 490, y: summaryY - 18, size: 9, font: regular, color: dark })
  page.drawText('Tax', { x: summaryX, y: summaryY - 36, size: 9, font: regular, color: muted })
  page.drawText(money.format(invoice.totals.tax), { x: 490, y: summaryY - 36, size: 9, font: regular, color: dark })
  page.drawRectangle({ x: summaryX - 10, y: summaryY - 72, width: 160, height: 27, color: primary })
  page.drawText('TOTAL', { x: summaryX, y: summaryY - 62, size: 10, font: bold, color: rgb(1, 1, 1) })
  page.drawText(money.format(invoice.totals.total), { x: 490, y: summaryY - 62, size: 10, font: bold, color: rgb(1, 1, 1) })
  page.drawText(`Payment status: ${invoice.paymentStatus}`, { x: 56, y: summaryY - 18, size: 9, font: bold, color: dark })
  page.drawText(`Payment method: ${invoice.paymentMethod}`, { x: 56, y: summaryY - 36, size: 9, font: regular, color: muted })
  page.drawText('NOTES / TERMS', { x: 56, y: 126, size: 8, font: bold, color: primary })
  drawWrapped(page, invoice.notes || 'Thank you for choosing Havana Heating and Air.', 56, 110, 280, regular, 9, muted)
  page.drawText(business.website.replace(/^https?:\/\//, ''), { x: 42, y: 34, size: 8, font: regular, color: muted })

  return pdf.save()
}
