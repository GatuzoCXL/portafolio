const withLeadingSlashRemoved = (value) => value.replace(/^\/+/, '')

export const assetUrl = (path) => {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${withLeadingSlashRemoved(path)}`
}

export const normalizeAppAssetPath = (value) => {
  if (!value || typeof value !== 'string') return value
  if (value.startsWith('/icons/') || value.startsWith('/wallpapers/')) {
    return assetUrl(value)
  }
  return value
}

export const normalizeStoragePublicUrl = (url) => {
  if (!url || typeof url !== 'string') return ''

  const marker = '/storage/v1/object/public/'
  if (!url.includes(marker)) return url

  const [prefix, suffix] = url.split(marker)
  if (!prefix || !suffix) return url

  return `${prefix}/api/storage/buckets/${suffix.replace(/^\/+/, '')}`.replace('/buckets/public/', '/buckets/')
}

export const isSupabaseStorageUrl = (url) =>
  !!(url && typeof url === 'string' && url.includes('/storage/v1/object/public/'))

export const extractRawSupabaseUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  const marker = '/storage/v1/object/public/'
  if (!url.includes(marker)) return ''
  const parts = url.split(marker)
  return parts.length === 2 ? `https://${parts[0].replace(/^\/+/, '').replace(/\/+$/, '')}${marker}${parts[1]}` : ''
}

const BACKEND_PROXY_URL = 'https://backrepositorio.onrender.com'

export const pdfProxyUrl = (rawUrl) => {
  if (!rawUrl) return ''
  try {
    const encoded = encodeURIComponent(rawUrl)
    return `${BACKEND_PROXY_URL}/api/proxy/pdf?url=${encoded}`
  } catch {
    return ''
  }
}

export const downloadUrl = (url) => {
  if (!url) return ''
  return url.includes('?') ? `${url}&download=1` : `${url}?download=1`
}

export const isPdfUrl = (url) => /\.pdf($|\?)/i.test(url || '')
export const isImageUrl = (url) => /\.(png|jpe?g|webp|gif|svg)($|\?)/i.test(url || '')
