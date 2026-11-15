
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { vehicles } from '../../../data/vehicles'
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Fuel,
  Gauge,
  Heart,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

const formatMileage = (mileage: number) =>
  `${new Intl.NumberFormat('uk-UA').format(mileage)} км`

const selectClass =
  'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'

export function CatalogPage() {
    const [searchParams] = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('search') ?? '')
    const [brand, setBrand] = useState(searchParams.get('brand') ?? 'Усі марки')
    const [bodyType, setBodyType] = useState(
      searchParams.get('bodyType') ?? 'Усі типи',
    )
    const [maxPrice, setMaxPrice] = useState(
      searchParams.get('maxPrice') ?? 'Усі ціни',
    )
  const [sort, setSort] = useState('newest')
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const result = vehicles.filter((vehicle) => {
      const searchableName =
        `${vehicle.brand} ${vehicle.model}`.toLowerCase()

      const matchesSearch = searchableName.includes(normalizedSearch)
      const matchesBrand =
        brand === 'Усі марки' || vehicle.brand === brand
      const matchesBodyType =
        bodyType === 'Усі типи' || vehicle.bodyType === bodyType

      const matchesPrice =
        maxPrice === 'Усі ціни' ||
        vehicle.price <= Number(maxPrice)

      return (
        matchesSearch &&
        matchesBrand &&
        matchesBodyType &&
        matchesPrice
      )
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

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    )
  }

  const hasActiveFilters =
    search !== '' ||
    brand !== 'Усі марки' ||
    bodyType !== 'Усі типи' ||
    maxPrice !== 'Усі ціни'

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#e7edf6_0%,#f0f4fa_48%,#e5edf8_100%)] text-[#14243b]">
      {/* Шапка */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#102747] text-white shadow-[0_4px_20px_rgba(10,30,60,0.12)]">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="text-[25px] font-black tracking-tight"
          >
            AUTO<span className="text-blue-400">MARKET</span>
          </Link>

          <nav className="hidden items-center gap-9 text-sm font-medium text-slate-300 md:flex">
            <Link to="/" className="transition hover:text-white">
              Головна
            </Link>
            <Link
              to="/catalog"
              className="relative text-white after:absolute after:-bottom-[29px] after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-blue-400"
            >
              Каталог авто
            </Link>
          </nav>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">На головну</span>
            <span className="sm:hidden">Назад</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 pb-24 pt-12 sm:px-8">
        {/* Заголовок */}
        <section className="mb-9">
          <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="transition hover:text-blue-700">
              Головна
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-semibold text-[#243b5a]">
              Каталог автомобілів
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-700 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-blue-700 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                AUTO MARKET
              </div>

              <h1 className="text-4xl font-black tracking-tight text-[#102747] sm:text-5xl">
                Каталог автомобілів
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                Обирай серед актуальних пропозицій та знаходь автомобіль,
                який відповідає твоїм потребам.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-5 py-3.5 shadow-[0_6px_24px_rgba(20,45,80,0.06)] backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <span className="text-lg font-black">$</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Валюта оголошень</p>
                <p className="mt-0.5 font-bold text-[#102747]">
                  Долар США (USD)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Фільтри */}
        <section className="mb-10 rounded-2xl border border-white/90 bg-white/90 p-5 shadow-[0_12px_40px_rgba(24,48,80,0.08)] backdrop-blur sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <SlidersHorizontal size={20} />
              </div>

              <div>
                <h2 className="font-bold text-[#102747]">
                  Пошук автомобіля
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Налаштуй параметри пошуку
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
              >
                <X size={15} />
                Очистити фільтри
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#334965]">
                Марка або модель
              </span>

              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                <Search size={18} className="shrink-0 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Наприклад, BMW X5"
                  className="min-w-0 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Очистити пошук"
                    className="text-slate-400 transition hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#334965]">
                Марка автомобіля
              </span>

              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className={selectClass}
              >
                <option>Усі марки</option>
                <option>BMW</option>
                <option>Mercedes-Benz</option>
                <option>Audi</option>
                <option>Volkswagen</option>
                <option>Toyota</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#334965]">
                Тип кузова
              </span>

              <select
                value={bodyType}
                onChange={(event) => setBodyType(event.target.value)}
                className={selectClass}
              >
                <option>Усі типи</option>
                <option>Седан</option>
                <option>Позашляховик</option>
                <option>Купе</option>
                <option>Універсал</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#334965]">
                Максимальна ціна
              </span>

              <select
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className={selectClass}
              >
                <option>Усі ціни</option>
                <option value="20000">До $20 000</option>
                <option value="40000">До $40 000</option>
                <option value="60000">До $60 000</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-500">
              Фільтри застосовуються автоматично
            </p>

            <label className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-2 font-semibold text-slate-600">
                <ArrowDownUp size={16} />
                Сортувати:
              </span>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 min-w-[210px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500"
              >
                <option value="newest">Спочатку новіші</option>
                <option value="oldest">Спочатку старіші</option>
                <option value="price-ascending">
                  Від дешевих до дорогих
                </option>
                <option value="price-descending">
                  Від дорогих до дешевих
                </option>
              </select>
            </label>
          </div>
        </section>

        {/* Результати */}
        <section>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                Наші пропозиції
              </p>

              <h2 className="text-2xl font-black tracking-tight text-[#102747] sm:text-3xl">
                Доступні автомобілі
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Знайдено пропозицій: {filteredVehicles.length}
              </p>
            </div>

            <span className="rounded-xl border border-blue-100 bg-white/80 px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm">
              {filteredVehicles.length} авто
            </span>
          </div>

          {filteredVehicles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredVehicles.map((vehicle) => {
                const isFavorite = favorites.includes(vehicle.id)

                return (
                  <article
                    key={vehicle.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-[0_5px_22px_rgba(20,45,80,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(20,45,80,0.13)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

                      <span className="absolute left-4 top-4 rounded-lg border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-bold text-[#102747] shadow-sm backdrop-blur">
                        {vehicle.year} рік
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(vehicle.id)}
                        aria-label={
                          isFavorite
                            ? `Видалити ${vehicle.brand} ${vehicle.model} з обраного`
                            : `Додати ${vehicle.brand} ${vehicle.model} до обраного`
                        }
                        aria-pressed={isFavorite}
                        className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition ${
                          isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-slate-600 hover:text-red-500'
                        }`}
                      >
                        <Heart
                          size={19}
                          fill={isFavorite ? 'currentColor' : 'none'}
                        />
                      </button>

                      <span className="absolute bottom-4 left-4 text-xs font-semibold text-white drop-shadow">
                        {vehicle.bodyType}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-slate-400">
                          {vehicle.brand}
                        </p>

                        <h3 className="text-xl font-bold tracking-tight text-[#102747]">
                          {vehicle.model}
                        </h3>
                      </div>

                      <p className="mt-4 text-[27px] font-black tracking-tight text-blue-700">
                        {formatPrice(vehicle.price)}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <Gauge
                            size={17}
                            className="shrink-0 text-blue-500"
                          />
                          {formatMileage(vehicle.mileage)}
                        </span>

                        <span className="flex items-center gap-2">
                          <Fuel
                            size={17}
                            className="shrink-0 text-blue-500"
                          />
                          {vehicle.fuel}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                        <span className="text-xs font-medium text-slate-400">
                          Ціна вказана в USD
                        </span>

                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                        >
                          Детальніше
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-white bg-white/90 px-6 py-20 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <Search size={25} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#102747]">
                Автомобілів не знайдено
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                За цими параметрами автомобілів поки немає.
                Спробуй змінити фільтри або очистити пошук.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                Скинути фільтри
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Підвал */}
      <footer className="bg-[#102747] px-5 py-11 text-center text-slate-300 sm:px-8">
        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-white"
        >
          AUTO<span className="text-blue-400">MARKET</span>
        </Link>

        <p className="mt-3 text-sm text-slate-300">
          Твій наступний автомобіль починається тут.
        </p>

        <div className="mx-auto mt-7 h-px max-w-7xl bg-white/10" />

        <p className="mt-6 text-xs text-slate-400">
          © 2026 AUTO MARKET. Усі права захищені.
        </p>
      </footer>
    </div>
  )
}
