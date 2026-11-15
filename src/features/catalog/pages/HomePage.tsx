
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Fuel,
  Gauge,
  Heart,
  Search,
} from 'lucide-react'
import { vehicles } from '../../../data/vehicles'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

const formatMileage = (mileage: number) =>
  new Intl.NumberFormat('uk-UA').format(mileage)

export default function HomePage() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<number[]>([])
  const [brand, setBrand] = useState('')
  const [bodyType, setBodyType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const params = new URLSearchParams()

    if (brand) params.set('brand', brand)
    if (bodyType) params.set('bodyType', bodyType)
    if (maxPrice) params.set('maxPrice', maxPrice)

    navigate(`/catalog${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#e7edf6_0%,#f0f4fa_48%,#e5edf8_100%)] text-[#14243b]">
      {/* Шапка */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#102747] text-white shadow-lg">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="text-2xl font-black tracking-tight">
            AUTO <span className="text-blue-400">MARKET</span>
          </Link>

          <nav className="hidden items-center gap-9 text-sm font-medium md:flex">
            <Link
              to="/"
              className="relative text-white after:absolute after:-bottom-[28px] after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-blue-400"
            >
              Головна
            </Link>
            <Link
              to="/catalog"
              className="text-slate-300 transition hover:text-white"
            >
              Каталог авто
            </Link>
            <a
              href="#about"
              className="text-slate-300 transition hover:text-white"
            >
              Про нас
            </a>
          </nav>

          <Link
            to="/catalog"
            className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-400"
          >
            Переглянути авто
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
        {/* Головний банер */}
        <section className="relative mt-7 min-h-[440px] overflow-hidden rounded-[28px] bg-[#102747] shadow-2xl shadow-slate-400/30 sm:mt-9 sm:min-h-[490px]">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=2000&q=90"
            alt="Автомобіль на дорозі"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1d35] via-[#102747]/85 to-[#102747]/20" />

          <div className="relative z-10 flex min-h-[440px] max-w-3xl flex-col justify-center px-7 py-16 text-white sm:min-h-[490px] sm:px-14 lg:px-16">
            <span className="mb-6 w-fit rounded-full border border-blue-300/30 bg-blue-400/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
              AUTO MARKET — автомобілі твоєї мрії
            </span>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Знайди автомобіль, який підходить саме тобі
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              Великий вибір автомобілів, зручний пошук та актуальні пропозиції.
              Твій наступний автомобіль починається тут.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-3 rounded-xl bg-blue-500 px-6 py-4 font-bold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Переглянути каталог
                <ArrowRight size={19} />
              </Link>

              <a
                href="#about"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Дізнатися більше
              </a>
            </div>
          </div>
        </section>

        {/* Пошук автомобіля */}
        <section className="relative z-20 -mt-7 px-0 sm:mx-8">
          <form
            onSubmit={handleSearch}
            className="grid gap-4 rounded-2xl border border-white bg-white p-5 shadow-xl shadow-slate-400/15 sm:grid-cols-2 sm:p-7 lg:grid-cols-4"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-[#14243b]">
                Марка автомобіля
              </label>
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              >
                <option value="">Усі марки</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Audi">Audi</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Toyota">Toyota</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#14243b]">
                Тип кузова
              </label>
              <select
                value={bodyType}
                onChange={(event) => setBodyType(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              >
                <option value="">Усі типи</option>
                <option value="Седан">Седан</option>
                <option value="Позашляховик">Позашляховик</option>
                <option value="Купе">Купе</option>
                <option value="Універсал">Універсал</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#14243b]">
                Максимальна ціна
              </label>
              <select
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              >
                <option value="">Будь-яка ціна</option>
                <option value="20000">До $20 000</option>
                <option value="40000">До $40 000</option>
                <option value="60000">До $60 000</option>
                <option value="100000">До $100 000</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                <Search size={18} />
                Знайти авто
              </button>
            </div>
          </form>
        </section>

        {/* Переваги */}
        <section className="mt-20 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: Search,
              title: 'Зручний пошук',
              description: 'Швидко знаходь автомобілі за потрібними параметрами.',
            },
            {
              icon: ShieldCheckIcon,
              title: 'Продуманий вибір',
              description: 'Порівнюй характеристики та обирай найкращу пропозицію.',
            },
            {
              icon: CarIcon,
              title: 'Різні марки авто',
              description: 'Відкривай для себе автомобілі різних класів і брендів.',
            },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white bg-white p-7 shadow-lg shadow-slate-300/20"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={23} />
                </div>
                <h3 className="text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            )
          })}
        </section>

        {/* Рекомендовані автомобілі */}
        <section className="mt-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Обрані пропозиції
              </p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Рекомендовані автомобілі
              </h2>
              <p className="mt-3 text-slate-500">
                Автомобілі, на які варто звернути увагу
              </p>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 font-bold text-blue-600 transition hover:text-blue-800"
            >
              Усі автомобілі
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="group overflow-hidden rounded-2xl border border-white bg-white shadow-lg shadow-slate-300/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-[#14243b] shadow">
                    {vehicle.year} рік
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(vehicle.id)}
                    aria-label="Додати до обраного"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow transition hover:text-red-500"
                  >
                    <Heart
                      size={19}
                      fill={favorites.includes(vehicle.id) ? 'currentColor' : 'none'}
                      className={
                        favorites.includes(vehicle.id) ? 'text-red-500' : ''
                      }
                    />
                  </button>

                  <span className="absolute bottom-4 left-4 rounded-lg bg-[#102747]/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    {vehicle.bodyType}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {vehicle.brand}
                  </p>

                  <h3 className="mt-1 text-xl font-extrabold text-[#14243b]">
                    {vehicle.model}
                  </h3>

                  <p className="mt-4 text-2xl font-black text-blue-600">
                    {formatPrice(vehicle.price)}
                  </p>

                  <div className="my-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Gauge size={17} className="text-blue-500" />
                      {formatMileage(vehicle.mileage)} км
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel size={17} className="text-blue-500" />
                      {vehicle.fuel}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-blue-500" />
                      {vehicle.year} рік
                    </div>
                  </div>

                  <Link
                    to="/catalog"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#102747] font-bold text-white transition hover:bg-blue-600"
                  >
                    Переглянути в каталозі
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Про нас */}
        <section
          id="about"
          className="mt-24 overflow-hidden rounded-[28px] bg-[#102747] px-7 py-14 text-white shadow-xl sm:px-12 lg:px-16"
        >
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              Про AUTO MARKET
            </p>

            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              Автомобіль твоєї мрії ближче, ніж здається
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              AUTO MARKET — зручний майданчик для пошуку автомобілів.
              Переглядай доступні пропозиції, порівнюй характеристики та
              знаходь авто, яке відповідає твоїм потребам.
            </p>

            <Link
              to="/catalog"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-blue-500 px-6 py-4 font-bold text-white transition hover:bg-blue-400"
            >
              Перейти до каталогу
              <ArrowRight size={19} />
            </Link>
          </div>
        </section>
      </main>

      {/* Підвал */}
      <footer className="bg-[#102747] text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/" className="text-2xl font-black tracking-tight">
              AUTO <span className="text-blue-400">MARKET</span>
            </Link>
            <p className="mt-2 text-sm text-slate-400">
              Знайди автомобіль, який підходить саме тобі.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-300">
            <Link to="/" className="transition hover:text-white">
              Головна
            </Link>
            <Link to="/catalog" className="transition hover:text-white">
              Каталог авто
            </Link>
            <a href="#about" className="transition hover:text-white">
              Про нас
            </a>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AUTO MARKET
          </p>
        </div>
      </footer>
    </div>
  )
}

function ShieldCheckIcon() {
  return <span className="text-2xl" style={{ lineHeight: 1 }}>✓</span>
}

function CarIcon() {
  return <span className="text-2xl" style={{ lineHeight: 1 }}>🚘</span>
}
