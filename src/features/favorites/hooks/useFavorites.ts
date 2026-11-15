import { useContext } from 'react'
import { FavoritesContext } from '@/features/favorites/hooks/favorites-context'

export function useFavorites() {
  const value = useContext(FavoritesContext)
  if (value === null) {
    throw new Error('useFavorites має бути всередині FavoritesProvider')
  }
  return value
}
