const storageKey = 'auto-market.favorites'

export function readFavoriteIds(): number[] {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw === null) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item): item is number => typeof item === 'number' && Number.isInteger(item))
  } catch (error) {
    if (error instanceof SyntaxError) return []
    throw error
  }
}

export function writeFavoriteIds(ids: readonly number[]): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids))
  } catch (error) {
    if (error instanceof DOMException) return
    throw error
  }
}
