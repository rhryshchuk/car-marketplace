import { useEffect, useState, type ReactNode } from 'react'
import { FavoritesContext } from '@/features/favorites/hooks/favorites-context'
import { readFavoriteIds, writeFavoriteIds } from '@/features/favorites/services/favoriteStorage'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(readFavoriteIds)

  useEffect(() => {
    writeFavoriteIds(favoriteIds)
  }, [favoriteIds])

  const toggleFavorite = (id: number) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const isFavorite = (id: number) => favoriteIds.includes(id)

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
