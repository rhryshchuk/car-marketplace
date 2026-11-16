import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ChevronLeft, ChevronRight, Fuel, Gauge, Heart } from 'lucide-react'
import { useFavorites } from '@/features/favorites'
import { getVehicleById, vehicleQueryKey, type VehicleView } from '@/services/vehicleService'
import { formatMileage, formatPrice } from '@/shared/lib/format'
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle'
import { Container } from '@/shared/ui/Container'

export function VehicleDetailsPage() {
  const { vehicleId } = useParams()
  const id = Number(vehicleId)
  const canLoad = Number.isInteger(id) && id > 0
  const vehicleQuery = useQuery({
    queryKey: vehicleQueryKey(canLoad ? id : 0),
    queryFn: () => getVehicleById(id),
    enabled: canLoad,
  })

  if (!canLoad || (vehicleQuery.isSuccess && !vehicleQuery.data)) {
    return (
      <Status
        title="Автомобіль не знайдено"
        text="Оголошення з таким номером відсутнє або вже зняте з каталогу."
      />
    )
  }

  if (vehicleQuery.isPending) {
    return <Status title="Завантаження автомобіля…" text="Отримуємо дані з каталогу компанії." />
  }

  if (vehicleQuery.isError) {
    return (
      <Status
        title="Не вдалося завантажити автомобіль"
        text={vehicleQuery.error.message}
        onRetry={() => void vehicleQuery.refetch()}
      />
    )
  }

  if (!vehicleQuery.data) {
    return (
      <Status
        title="Автомобіль не знайдено"
        text="Оголошення з таким номером відсутнє або вже зняте з каталогу."
      />
    )
  }

  return <VehicleDetails vehicle={vehicleQuery.data} />
}

function Status({
  title,
  text,
  onRetry,
}: {
  title: string
  text: string
  onRetry?: () => void
}) {
  useDocumentTitle(`${title} — AUTO MARKET`)

  return (
    <Container className="py-10 sm:py-12">
      <div className="rounded-card border border-white/10 bg-panel px-6 py-16 text-center">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mist">{text}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex h-12 items-center rounded-control bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-strong"
          >
            Спробувати ще
          </button>
        ) : (
          <Link
            to="/catalog"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-control bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-strong"
          >
            <ArrowLeft size={16} />
            До каталогу
          </Link>
        )}
      </div>
    </Container>
  )
}

const statusLabels: Record<NonNullable<VehicleView['status']>, string> = {
  available: 'В наявності',
  expected: 'Очікується',
  sold: 'Продано',
}

function VehicleDetails({ vehicle }: { vehicle: VehicleView }) {
  useDocumentTitle(`${vehicle.brand} ${vehicle.model} — AUTO MARKET`)
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(vehicle.id)
  const description = `${vehicle.brand} ${vehicle.model}, ${vehicle.year} рік. ${vehicle.bodyType}, паливо: ${vehicle.fuel.toLowerCase()}, пробіг ${formatMileage(vehicle.mileage)}.`

  return (
    <Container className="py-10 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-mist">
        <Link to="/" className="transition hover:text-white">
          Головна
        </Link>
        <span>/</span>
        <Link to="/catalog" className="transition hover:text-white">
          Каталог
        </Link>
        <span>/</span>
        <span className="font-semibold text-white">
          {vehicle.brand} {vehicle.model}
        </span>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Gallery name={`${vehicle.brand} ${vehicle.model}`} photos={vehicle.photos} />

        <div className="rounded-card border border-white/10 bg-panel p-5 sm:p-7 lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">{vehicle.brand}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{vehicle.model}</h1>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-mist">Ціна</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight">{formatPrice(vehicle.price)}</p>
          <p className="mt-1 text-xs text-mist">Ціна вказана в USD</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm">
            <Spec label="Марка" value={vehicle.brand} />
            <Spec label="Модель" value={vehicle.model} />
            <Spec label="Рік" value={String(vehicle.year)} />
            <Spec label="Кузов" value={vehicle.bodyType} />
            {vehicle.status ? <Spec label="Статус" value={statusLabels[vehicle.status]} /> : null}
            <Spec
              label="Пробіг"
              value={
                <span className="inline-flex items-center gap-2">
                  <Gauge size={16} className="text-glow" />
                  {formatMileage(vehicle.mileage)}
                </span>
              }
            />
            <Spec
              label="Паливо"
              value={
                <span className="inline-flex items-center gap-2">
                  <Fuel size={16} className="text-glow" />
                  {vehicle.fuel}
                </span>
              }
            />
          </dl>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to={`/contacts?vehicleId=${vehicle.id}`}
              className="inline-flex h-12 w-full items-center justify-center rounded-control bg-accent px-4 text-sm font-bold text-white transition hover:bg-accent-strong"
            >
              Залишити заявку щодо авто
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalog"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control border border-white/15 px-4 text-sm font-bold text-white transition hover:bg-white/10 sm:flex-1"
            >
              <ArrowLeft size={16} />
              До каталогу
            </Link>
            <button
              type="button"
              onClick={() => toggleFavorite(vehicle.id)}
              aria-pressed={saved}
              className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-control px-4 text-sm font-bold transition sm:flex-1 ${
                saved ? 'bg-heart text-white' : 'bg-accent text-white hover:bg-accent-strong'
              }`}
            >
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'В обраному' : 'Додати до обраного'}
            </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
      <section className="rounded-card border border-white/10 bg-panel p-5 sm:p-7">
        <h2 className="text-xl font-extrabold">Про автомобіль</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-mist">{description}</p>
      </section>

      <section className="rounded-card border border-white/10 bg-panel p-5 sm:p-7">
        <h2 className="text-xl font-extrabold">Компанія</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-mist">
          Це авто належить AUTO MARKET. Питання щодо покупки можна залишити у формі заявки.
        </p>
        <Link
          to={`/contacts?vehicleId=${vehicle.id}`}
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-control border border-white/15 px-4 text-sm font-bold text-white transition hover:bg-white/10 sm:w-auto"
        >
          Контакти компанії
        </Link>
      </section>
      </div>
    </Container>
  )
}

function Gallery({ name, photos }: { name: string; photos: string[] }) {
  const [active, setActive] = useState(0)
  const safeIndex = active < photos.length ? active : 0
  const current = photos[safeIndex]

  if (!current) return null

  const showPrevious = () => setActive((safeIndex - 1 + photos.length) % photos.length)
  const showNext = () => setActive((safeIndex + 1) % photos.length)

  return (
    <div>
      <div className="relative overflow-hidden rounded-card border border-white/10 bg-ink">
        <img
          key={current}
          src={current}
          alt={name}
          className="aspect-[16/10] w-full object-cover motion-safe:animate-[photo-in_280ms_ease]"
          decoding="async"
        />
        {photos.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Попереднє фото"
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/75 text-white shadow-md backdrop-blur transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Наступне фото"
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/75 text-white shadow-md backdrop-blur transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
            >
              <ChevronRight size={22} />
            </button>
          </>
        ) : null}
      </div>
      {photos.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <li key={`${photo}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Фото ${index + 1}`}
                aria-pressed={index === safeIndex}
                className={`overflow-hidden rounded-control border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow ${
                  index === safeIndex ? 'border-accent' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img src={photo} alt="" className="aspect-[16/10] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function Spec({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-mist">{label}</dt>
      <dd className="mt-1 font-semibold text-white">{value}</dd>
    </div>
  )
}
