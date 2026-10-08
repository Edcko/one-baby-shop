/**
 * Money helpers — the API speaks centavos (Int); only display converts.
 * MXN everywhere (Mexican store, prices always IVA-included per LFPC).
 */
export function formatMXN(cents) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(cents / 100)
}

/** IVA breakdown derived from an IVA-included price (never added on top). */
export function ivaFromGross(cents, ivaRatePercent = 16) {
  return Math.round(cents - cents / (1 + ivaRatePercent / 100))
}
