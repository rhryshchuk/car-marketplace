import type { ReactNode } from 'react'
import { CalendarDays, Fuel, Gauge, Heart } from 'lucide-react'
import type { Vehicle } from '@/data/vehicles'
import { formatMileage, formatPrice } from '@/shared/lib/format'

interface VehicleCardProps {
  vehicle: Vehicle
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
  action: ReactNode
}

export function VehicleCard({
  vehicle,
  isFavorite,
  onToggleFavorite,
  action,
}: VehicleCardProps) {
  const name = `${vehicle.brand} ${vehicle.model}`

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-white/10 bg-paper shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-accent/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink">
        <img
          src={vehicle.image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/80 to-transparent" />
        <span className="absolute left-3 top-3 rounded-lg bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          {vehicle.year}
        </span>
        <button
          type="button"
          onClick={() => onToggleFavorite(vehicle.id)}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Видалити ${name} з обраного`
              : `Додати ${name} до обраного`
          }
          className={`absolute right-3 top-3 flex size-11 items-center justify-center rounded-full shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow ${
            isFavorite
              ? 'bg-heart text-white'
              : 'bg-white/95 text-ink hover:text-heart'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <span className="absolute bottom-3 left-3 text-xs font-semibold text-white">
          {vehicle.bodyType}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">
          {vehicle.brand}
        </p>
        <h3 className="mt-1 text-lg font-bold tracking-tight text-white">
          {vehicle.model}
        </h3>
        <p className="mt-3 text-2xl font-extrabold tracking-tight text-white">
          {formatPrice(vehicle.price)}
        </p>
        <p className="mt-1 text-xs text-mist">Ціна вказана в USD</p>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-sm text-mist">
          <span className="flex items-center gap-2">
            <Gauge size={16} className="shrink-0 text-glow" />
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="flex items-center gap-2">
            <Fuel size={16} className="shrink-0 text-glow" />
            {vehicle.fuel}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays size={16} className="shrink-0 text-glow" />
            {vehicle.year}
          </span>
        </div>

        <div className="mt-auto pt-5">{action}</div>
      </div>
    </article>
  )
}
