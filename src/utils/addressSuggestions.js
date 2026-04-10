const norm = (value) => String(value || '').toLowerCase().trim()

const stripAccents = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const compact = (value) => stripAccents(norm(value)).replace(/\s+/g, ' ')

const tokenize = (value) => compact(value).split(/[\\/\s]+/).filter(Boolean)

const expandHierarchicalItems = (items) => {
  const acc = []

  for (const original of items) {
    const value = String(original || '').trim()
    if (!value) continue

    acc.push(value)

    const parts = value.split('\\').map((part) => part.trim()).filter(Boolean)
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i += 1) {
        acc.push(parts.slice(0, i).join('\\'))
      }
    }
  }

  return [...new Set(acc)]
}

export const buildAddressSuggestions = (items, query, limit = 8) => {
  const q = compact(query)
  const qTokens = tokenize(query)
  const unique = expandHierarchicalItems(items)

  if (!q) {
    return unique.slice(0, limit)
  }

  return unique
    .map((item) => {
      const n = compact(item)
      let score = 99
      if (n === q) score = -1
      else if (n.startsWith(q)) score = 0
      else {
        const nTokens = tokenize(n)
        const allTokensMatch = qTokens.every(
          (token) => nTokens.some((candidate) => candidate.startsWith(token)) || n.includes(token)
        )

        if (allTokensMatch) {
          const firstToken = qTokens[0]
          score = nTokens.some((candidate) => candidate.startsWith(firstToken)) ? 1 : 2
        }
      }

      return { item, score, len: n.length }
    })
    .filter((entry) => entry.score < 99)
    .sort((a, b) => a.score - b.score || a.len - b.len)
    .slice(0, limit)
    .map((entry) => entry.item)
}

const WINDOW_ALIASES = [
  {
    id: 'documents',
    terms: [
      'doc',
      'docs',
      'document',
      'documents',
      'documento',
      'documentos',
      'my documents',
      'mis documentos',
      'cv',
    ],
  },
  {
    id: 'internet-explorer',
    terms: [
      'inter',
      'internet',
      'internet explorer',
      'iexplore',
      'project',
      'projects',
      'proyecto',
      'proyectos',
      'browser',
    ],
  },
  { id: 'messenger', terms: ['msn', 'messenger', 'contact', 'contacto', 'mail', 'email'] },
  { id: 'music-player', terms: ['music', 'musica', 'player', 'reproductor', 'studio', 'estudio', 'audio', 'song'] },
  { id: 'games-folder', terms: ['game', 'games', 'juegos'] },
  { id: 'my-pc', terms: ['pc', 'my pc', 'mycomputer', 'my computer', 'computer', 'mi pc', 'about'] },
]

export const resolveWindowShortcut = (query) => {
  const q = compact(query)
  const qTokens = tokenize(query)
  if (!q) return null

  const isLikelyDocumentsPath =
    q.includes('documents') ||
    q.includes('documentos') ||
    q.includes('my documents') ||
    q.includes('mis documentos') ||
    q.endsWith('\\docs') ||
    q.endsWith('/docs')

  if (isLikelyDocumentsPath) {
    return 'documents'
  }

  for (const entry of WINDOW_ALIASES) {
    const matched = entry.terms.some((term) => {
      const t = compact(term)
      if (q === t || q.startsWith(`${t} `) || q.startsWith(`${t}\\`) || q.startsWith(`${t}/`)) {
        return true
      }

      const termTokens = tokenize(t)
      if (!termTokens.length) return false

      return termTokens.every((token) => qTokens.some((candidate) => candidate.startsWith(token)))
    })

    if (matched) {
      return entry.id
    }
  }

  return null
}
