import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowDownUp,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { vehicles } from '@/data/vehicles'
import { useFavorites } from '@/features/favorites'
import { Container } from '@/shared/ui/Container'
import { VehicleCard } from '@/shared/ui/VehicleCard'

const selectClass =
  'h-12 w-full rounded-control border border-white/10 bg-ink px-4 text-sm text-white outline-none transition hover:border-white/20 focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/20'

export function CatalogPage() {
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [brand, setBrand] = useState(searchParams.get('brand') ?? 'Усі марки')
  const [bodyType, setBodyType] = useState(searchParams.get('bodyType') ?? 'Усі типи')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? 'Усі ціни')
  const [sort, setSort] = useState('newest')
  const { isFavorite, toggleFavorite } = useFavorites()

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const result = vehicles.filter((vehicle) => {
      const searchableName = `${vehicle.brand} ${vehicle.model}`.toLowerCase()

      const matchesSearch = searchableName.includes(normalizedSearch)
      const matchesBrand = brand === 'Усі марки' || vehicle.brand === brand
      const matchesBodyType = bodyType === 'Усі типи' || vehicle.bodyType === bodyType
      const matchesPrice = maxPrice === 'Усі ціни' || vehicle.price <= Number(maxPrice)

      return matchesSearch && matchesBrand && matchesBodyType && matchesPrice
    })

    switch (sort) {
      case 'price-ascending':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-descending':
        result.sort((a, b) => b.price - a.price)
        break
      case 'oldest':
        result.sort((a, b) => a.year - b.year)
        break
      default:
        result.sort((a, b) => b.year - a.year)
    }

    return result
  }, [search, brand, bodyType, maxPrice, sort])

  const resetFilters = () => {
    setSearch('')
    setBrand('Усі марки')
    setBodyType('Усі типи')
    setMaxPrice('Усі ціни')
    setSort('newest')
  }

  const hasActiveFilters =
    search !== '' ||
    brand !== 'Усі марки' ||
    bodyType !== 'Усі типи' ||
    maxPrice !== 'Усі ціни'

  return (
    <Container className="py-10 sm:py-12">
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-mist">
          <Link to="/" className="transition hover:text-white">
            Головна
          </Link>
          <span>/</span>
          <span className="font-semibold text-white">Каталог автомобілів</span>
        </div>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">AUTO MARKET</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Каталог автомобілів</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-mist">
              Обирай серед актуальних пропозицій та знаходь автомобіль, який відповідає твоїм потребам.
            </p>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-card border border-white/10 bg-panel px-4 py-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-lg font-black text-glow">
              $
            </span>
            <div>
              <p className="text-xs text-mist">Валюта оголошень</p>
              <p className="font-bold">Долар США (USD)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-card border border-white/10 bg-panel p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-glow">
              <SlidersHorizontal size={20} />
            </span>
            <div>
              <h2 className="font-bold">Пошук автомобіля</h2>
              <p className="text-xs text-mist">Налаштуй параметри пошуку</p>
            </div>
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center gap-1.5 rounded-control px-3 text-sm font-semibold text-glow transition hover:bg-white/5"
            >
              <X size={15} />
              Очистити фільтри
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Марка або модель</span>
            <span className="flex h-12 items-center gap-3 rounded-control border border-white/10 bg-ink px-4 transition focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/20">
              <Search size={18} className="shrink-0 text-mist" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Наприклад, BMW X5"
                className="min-w-0 w-full bg-transparent text-sm text-white outline-none placeholder:text-mist"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Очистити пошук"
                  className="text-mist transition hover:text-white"
                >
                  <X size={16} />
                </button>
              ) : null}
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Марка автомобіля</span>
            <select value={brand} onChange={(event) => setBrand(event.target.value)} className={selectClass}>
              <option>Усі марки</option>
              <option>BMW</option>
              <option>Mercedes-Benz</option>
              <option>Audi</option>
              <option>Volkswagen</option>
              <option>Toyota</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Тип кузова</span>
            <select value={bodyType} onChange={(event) => setBodyType(event.target.value)} className={selectClass}>
              <option>Усі типи</option>
              <option>Седан</option>
              <option>Позашляховик</option>
              <option>Купе</option>
              <option>Універсал</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Максимальна ціна</span>
            <select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className={selectClass}>
              <option>Усі ціни</option>
              <option value="20000">До $20 000</option>
              <option value="40000">До $40 000</option>
              <option value="60000">До $60 000</option>
              <option value="100000">До $100 000</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
          <p className="text-sm text-mist">Фільтри застосовуються автоматично</p>
          <label className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 font-semibold text-mist">
              <ArrowDownUp size={16} />
              Сортувати:
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 min-w-[210px] rounded-control border border-white/10 bg-ink px-3 text-sm font-semibold text-white outline-none focus-visible:border-accent"
            >
              <option value="newest">Спочатку новіші</option>
              <option value="oldest">Спочатку старіші</option>
              <option value="price-ascending">Від дешевих до дорогих</option>
              <option value="price-descending">Від дорогих до дешевих</option>
            </select>
          </label>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">Наші пропозиції</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Доступні автомобілі</h2>
            <p className="mt-2 text-sm text-mist">Знайдено пропозицій: {filteredVehicles.length}</p>
          </div>
          <span className="rounded-control border border-white/10 bg-panel px-4 py-2.5 text-sm font-bold text-glow">
            {filteredVehicles.length} авто
          </span>
        </div>

        {filteredVehicles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isFavorite={isFavorite(vehicle.id)}
                onToggleFavorite={toggleFavorite}
                action={
                  <button
                    type="button"
                    className="inline-flex h-11 items-center gap-2 rounded-control bg-accent/15 px-4 text-sm font-bold text-glow transition hover:bg-accent hover:text-white"
                  >
                    Детальніше
                    <ArrowRight size={16} />
                  </button>
                }
              />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-white/10 bg-panel px-6 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-glow">
              <Search size={24} />
            </span>
            <h3 className="mt-5 text-xl font-bold">Автомобілів не знайдено</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mist">
              За цими параметрами автомобілів поки немає. Спробуй змінити фільтри або очистити пошук.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex h-12 items-center rounded-control bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-strong"
            >
              Скинути фільтри
            </button>
          </div>
        )}
      </section>
    </Container>
  )
}
