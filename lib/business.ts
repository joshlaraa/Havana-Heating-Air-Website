import { services } from '@/lib/services'

/**
 * Single source of truth for customer-facing business details and invoice defaults.
 * Set INVOICE_SERVICE_PRICES_JSON to override prices without changing the UI.
 *
 * Example:
 * {"air-conditioning":149,"heating":149,"mini-split-systems":199,
 *  "quiet-cool-installation":199,"service-repairs":129,"new-installations":0}
 */
const configuredPrices: Record<string, number> = (() => {
  try {
    const value = process.env.INVOICE_SERVICE_PRICES_JSON
    return value ? JSON.parse(value) : {}
  } catch {
    return {}
  }
})()

// These are editable starting prices for the catalog. Replace them with the
// company's actual rates in INVOICE_SERVICE_PRICES_JSON when deploying.
const defaultPrices: Record<string, number> = {
  'air-conditioning': 149,
  heating: 149,
  'mini-split-systems': 199,
  'quiet-cool-installation': 199,
  'service-repairs': 129,
  'new-installations': 0,
}

export const business = {
  name: 'Havana Heating and Air',
  address: 'Serving San Diego County & Surrounding Areas',
  phone: '909.235.0771',
  email: 'havanaheatingandair@gmail.com',
  website: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://havana-heating-air-website.vercel.app',
  logoPath: 'public/images/havana-logo.png',
  colors: {
    primary: '#c1121f',
    dark: '#0a1f3d',
    muted: '#6b7280',
    light: '#f5f5f5',
  },
} as const

export const invoiceServices = services.map((service) => ({
  id: service.id,
  label: service.label,
  price: configuredPrices[service.id] ?? defaultPrices[service.id] ?? 0,
}))

export function getInvoiceService(id: string) {
  return invoiceServices.find((service) => service.id === id)
}
