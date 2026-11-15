import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CarFront, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { useFavorites } from '@/features/favorites'
import { getVehicles, vehiclesQueryKey } from '@/services/vehicleService'
import { VehicleCard } from '@/shared/ui/VehicleCard'
import { formatPrice } from '@/shared/lib/format'
import { Container } from '@/shared/ui/Container'

const fieldClass =
  'h-12 w-full rounded-control border border-white/10 bg-ink px-4 text-sm text-white outline-none transition focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/20'

const benefits = [
  {
    icon: Search,
    title: 'Зручний пошук',
    description: 'Швидко знаходь автомобілі за потрібними параметрами.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Продуманий вибір',
    description: 'Порівнюй характеристики та обирай найкращу пропозицію.',
  },
  {
    icon: CarFront,
    title: 'Різні марки авто',
    description: 'Відкривай для себе автомобілі різних класів і брендів.',
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [brand, setBrand] = useState('')
  const [bodyType, setBodyType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const vehiclesQuery = useQuery({
    queryKey: vehiclesQueryKey,
    queryFn: getVehicles,
  })
  const vehicles = vehiclesQuery.data ?? []

  const spotlight = vehicles[0]
  const brands = [...new Set(vehicles.map((vehicle) => vehicle.brand))]
  const lowestPrice = vehicles.length > 0 ? Math.min(...vehicles.map((vehicle) => vehicle.price)) : null

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const params = new URLSearchParams()

    if (brand) params.set('brand', brand)
    if (bodyType) params.set('bodyType', bodyType)
    if (maxPrice) params.set('maxPrice', maxPrice)

    navigate(`/catalog${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=2000&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/92 to-canvas/35" />

        <Container className="relative grid items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-glow">
              <ShieldCheck size={14} />
              AUTO MARKET
            </p>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Знайди автомобіль,
              <span className="mt-1 block text-glow">який підходить саме тобі</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-mist sm:text-lg">
              Великий вибір автомобілів, зручний пошук та актуальні пропозиції. Твій наступний автомобіль починається тут.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex h-12 items-center gap-2 rounded-control bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
              >
                Переглянути каталог
                <ArrowRight size={18} />
              </Link>
              <a
                href="#about"
                className="inline-flex h-12 items-center rounded-control border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
              >
                Дізнатися більше
              </a>
            </div>
          </div>

          {spotlight ? (
            <Link
              to={`/catalog?brand=${encodeURIComponent(spotlight.brand)}`}
              className="group relative hidden overflow-hidden rounded-card border border-white/15 bg-ink/40 shadow-2xl shadow-black/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow lg:block"
            >
              <img
                src={spotlight.image}
                alt={`${spotlight.brand} ${spotlight.model}`}
                className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas via-canvas/80 to-transparent p-5 pt-16">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">Пропозиція на головній</p>
                <p className="mt-1 text-2xl font-extrabold">
                  {spotlight.brand} {spotlight.model}
                </p>
                <p className="mt-1 text-lg font-bold text-white">{formatPrice(spotlight.price)}</p>
              </div>
            </Link>
          ) : null}
        </Container>
      </section>

      <Container className="relative z-10 -mt-8 pb-4">
        <form
          onSubmit={handleSearch}
          className="rounded-card border border-white/10 bg-panel/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Пошук автомобіля</h2>
            <p className="text-xs text-mist">Ціни в USD</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Марка автомобіля</span>
              <select value={brand} onChange={(event) => setBrand(event.target.value)} className={fieldClass}>
                <option value="">Усі марки</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Audi">Audi</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Toyota">Toyota</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Тип кузова</span>
              <select value={bodyType} onChange={(event) => setBodyType(event.target.value)} className={fieldClass}>
                <option value="">Усі типи</option>
                <option value="Седан">Седан</option>
                <option value="Позашляховик">Позашляховик</option>
                <option value="Купе">Купе</option>
                <option value="Універсал">Універсал</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Максимальна ціна</span>
              <select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className={fieldClass}>
                <option value="">Будь-яка ціна</option>
                <option value="20000">До $20 000</option>
                <option value="40000">До $40 000</option>
                <option value="60000">До $60 000</option>
                <option value="100000">До $100 000</option>
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
              >
                <Search size={18} />
                Знайти авто
              </button>
            </div>
          </div>
        </form>
      </Container>

      <Container className="py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-card border border-white/10 bg-panel p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-glow">
                  <Icon size={20} />
                </span>
                <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-mist">{item.description}</p>
              </div>
            )
          })}
        </div>
      </Container>

      <Container className="pb-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">Обрані пропозиції</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Рекомендовані автомобілі</h2>
            <p className="mt-2 text-sm text-mist">Автомобілі, на які варто звернути увагу</p>
          </div>
          <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-glow hover:text-white">
            Усі автомобілі
            <ArrowRight size={16} />
          </Link>
        </div>
        {vehiclesQuery.isPending ? (
          <div className="rounded-card border border-white/10 bg-panel px-6 py-16 text-center">
            <h3 className="text-xl font-bold">Завантаження автомобілів…</h3>
          </div>
        ) : vehiclesQuery.isError ? (
          <div className="rounded-card border border-white/10 bg-panel px-6 py-16 text-center">
            <h3 className="text-xl font-bold">Не вдалося завантажити автомобілі</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mist">{vehiclesQuery.error.message}</p>
            <button
              type="button"
              onClick={() => void vehiclesQuery.refetch()}
              className="mt-6 inline-flex h-12 items-center rounded-control bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-strong"
            >
              Спробувати ще
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-card border border-white/10 bg-panel px-6 py-16 text-center">
            <h3 className="text-xl font-bold">У каталозі поки немає автомобілів</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mist">
              Рекомендовані пропозиції з’являться тут після додавання авто.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isFavorite={isFavorite(vehicle.id)}
                onToggleFavorite={toggleFavorite}
                action={
                  <Link
                    to="/catalog"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-white text-sm font-bold text-ink transition hover:bg-glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
                  >
                    Переглянути в каталозі
                    <ArrowRight size={16} />
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </Container>

      <Container className="pb-16">
        <section id="about" className="scroll-mt-24 overflow-hidden rounded-card border border-white/10 bg-panel">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-glow">Про AUTO MARKET</p>
              <h2 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">
                Автомобіль твоєї мрії ближче, ніж здається
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-mist">
                AUTO MARKET — зручний майданчик для пошуку автомобілів. Переглядай доступні пропозиції, порівнюй характеристики та знаходь авто, яке відповідає твоїм потребам.
              </p>
              <Link
                to="/catalog"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-control bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong"
              >
                Перейти до каталогу
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-3 border-t border-white/10 lg:border-t-0 lg:border-l">
              <Stat
                value={vehiclesQuery.isSuccess ? String(vehicles.length) : '…'}
                label="авто в каталозі"
              />
              <Stat value={vehiclesQuery.isSuccess ? String(brands.length) : '…'} label="марок" />
              <Stat
                value={lowestPrice === null ? '—' : formatPrice(lowestPrice)}
                label="найнижча ціна"
              />
            </div>
          </div>
        </section>
      </Container>

      <Container className="pb-20">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold">Марки в каталозі</h2>
          <Link to="/catalog" className="text-sm font-bold text-glow hover:text-white">
            Усі авто
          </Link>
        </div>
        {vehiclesQuery.isError ? (
          <p className="text-sm text-mist">Марки з’являться, коли каталог завантажиться.</p>
        ) : vehiclesQuery.isSuccess && brands.length === 0 ? (
          <p className="text-sm text-mist">У каталозі поки немає марок.</p>
        ) : (
          <ul className="flex flex-wrap gap-3">
            {brands.map((item) => (
              <li key={item}>
                <Link
                  to={`/catalog?brand=${encodeURIComponent(item)}`}
                  className="inline-flex h-12 items-center rounded-full border border-white/10 bg-panel px-5 text-sm font-bold transition hover:border-accent/50 hover:text-glow"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col justify-center px-3 py-6 text-center sm:px-4">
      <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs leading-5 text-mist">{label}</p>
    </div>
  )
}
