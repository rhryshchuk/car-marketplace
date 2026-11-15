import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Heart } from 'lucide-react'
import { favoriteVehicles } from '@/features/favorites/model/favorites'
import { useFavorites } from '@/features/favorites/hooks/useFavorites'
import { getVehicles, vehiclesQueryKey } from '@/services/vehicleService'
import { Container } from '@/shared/ui/Container'
import { VehicleCard } from '@/shared/ui/VehicleCard'

export function FavoritesPage() {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites()
  const vehiclesQuery = useQuery({
    queryKey: vehiclesQueryKey,
    queryFn: getVehicles,
  })
  const saved = vehiclesQuery.data ? favoriteVehicles(vehiclesQuery.data, favoriteIds) : []

  return (
    <Container className="py-10 sm:py-12">
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-mist">
          <Link to="/" className="transition hover:text-white">
            Головна
          </Link>
          <span>/</span>
          <span className="font-semibold text-white">Обране</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">AUTO MARKET</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Обране</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-mist">
          Автомобілі, які ти зберіг. Список лишається після оновлення сторінки.
        </p>
      </section>

      {vehiclesQuery.isPending ? (
        <div className="rounded-card border border-white/10 bg-panel px-6 py-16 text-center">
          <h2 className="text-xl font-bold">Завантаження обраного…</h2>
        </div>
      ) : vehiclesQuery.isError ? (
        <div className="rounded-card border border-white/10 bg-panel px-6 py-16 text-center">
          <h2 className="text-xl font-bold">Не вдалося завантажити обране</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mist">{vehiclesQuery.error.message}</p>
          <button
            type="button"
            onClick={() => void vehiclesQuery.refetch()}
            className="mt-6 inline-flex h-12 items-center rounded-control bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-strong"
          >
            Спробувати ще
          </button>
        </div>
      ) : saved.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isFavorite={isFavorite(vehicle.id)}
              onToggleFavorite={toggleFavorite}
              action={
                <button
                  type="button"
                  onClick={() => toggleFavorite(vehicle.id)}
                  className="inline-flex h-11 items-center gap-2 rounded-control bg-accent/15 px-4 text-sm font-bold text-glow transition hover:bg-accent hover:text-white"
                >
                  Прибрати з обраного
                  <ArrowRight size={16} />
                </button>
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-white/10 bg-panel px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-glow">
            <Heart size={24} />
          </span>
          <h2 className="mt-5 text-xl font-bold">В обраному поки порожньо</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mist">
            Натисни серце на картці автомобіля, і він з’явиться тут.
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex h-12 items-center rounded-control bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-strong"
          >
            Перейти до каталогу
          </Link>
        </div>
      )}
    </Container>
  )
}
