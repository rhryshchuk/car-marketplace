import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { statusLabels } from '@/features/admin/model/vehicleDraft'
import {
  adminVehiclesQueryKey,
  deleteVehicle,
  getAdminVehicles,
  type AdminVehicle,
} from '@/features/admin/services/adminVehicles'
import { vehiclesQueryKey } from '@/services/vehicleService'
import { formatMileage, formatPrice } from '@/shared/lib/format'
import { Container } from '@/shared/ui/Container'

const statusClass: Record<AdminVehicle['status'], string> = {
  available: 'bg-accent/15 text-glow',
  expected: 'bg-white/10 text-white',
  sold: 'bg-white/5 text-mist',
  hidden: 'bg-heart/15 text-heart',
}

export function AdminDashboardPage() {
  const location = useLocation()
  const queryClient = useQueryClient()
  const vehiclesQuery = useQuery({
    queryKey: adminVehiclesQueryKey,
    queryFn: getAdminVehicles,
  })
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const remove = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminVehiclesQueryKey })
      await queryClient.invalidateQueries({ queryKey: vehiclesQueryKey })
    },
    onError: (cause) => {
      setDeleteError(cause instanceof Error ? cause.message : 'Не вдалося видалити автомобіль.')
    },
  })

  const vehicles = vehiclesQuery.data ?? []
  const notice = readNotice(location.state)

  const removeVehicle = (vehicle: AdminVehicle) => {
    const confirmed = window.confirm(
      `Видалити ${vehicle.brand} ${vehicle.model}? Фото у сховищі також буде видалено.`,
    )
    if (!confirmed) return
    setDeleteError(null)
    remove.mutate(vehicle.id)
  }

  return (
    <Container className="py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">Склад</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Автомобілі компанії</h1>
        </div>
        <Link
          to="/admin/vehicles/new"
          className="inline-flex h-12 items-center rounded-control bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong"
        >
          Додати автомобіль
        </Link>
      </div>

      {notice ? <p className="mt-5 text-sm text-glow">{notice}</p> : null}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Усього" value={countLabel(vehiclesQuery, vehicles.length)} />
        <Stat label="В наявності" value={countLabel(vehiclesQuery, countStatus(vehicles, 'available'))} />
        <Stat label="Очікується" value={countLabel(vehiclesQuery, countStatus(vehicles, 'expected'))} />
        <Stat label="Продано" value={countLabel(vehiclesQuery, countStatus(vehicles, 'sold'))} />
      </section>

      <section className="mt-6">
        {vehiclesQuery.isPending ? (
          <Panel title="Завантаження складу…" text="Отримуємо автомобілі компанії." />
        ) : vehiclesQuery.isError ? (
          <Panel title="Не вдалося завантажити склад" text={vehiclesQuery.error.message}>
            <button
              type="button"
              onClick={() => void vehiclesQuery.refetch()}
              className="mt-5 inline-flex h-11 items-center rounded-control bg-accent px-4 text-sm font-bold text-white"
            >
              Спробувати ще
            </button>
          </Panel>
        ) : vehicles.length === 0 ? (
          <Panel title="Склад порожній" text="Додайте перший автомобіль компанії." />
        ) : (
          <div className="overflow-x-auto rounded-card border border-white/10 bg-panel">
            {deleteError ? <p className="px-4 pt-4 text-sm text-heart">{deleteError}</p> : null}
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 text-mist">
                <tr>
                  <th className="px-4 py-3 font-semibold">Фото</th>
                  <th className="px-4 py-3 font-semibold">Авто</th>
                  <th className="px-4 py-3 font-semibold">Рік</th>
                  <th className="px-4 py-3 font-semibold">Ціна</th>
                  <th className="px-4 py-3 font-semibold">Пробіг</th>
                  <th className="px-4 py-3 font-semibold">Статус</th>
                  <th className="px-4 py-3 font-semibold">Дії</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-white/10 last:border-0">
                    <td className="px-4 py-3">
                      {vehicle.imageUrl ? (
                        <img
                          src={vehicle.imageUrl}
                          alt=""
                          className="h-14 w-20 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-xs text-mist">Немає фото</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {vehicle.brand} {vehicle.model}
                    </td>
                    <td className="px-4 py-3">{vehicle.year}</td>
                    <td className="px-4 py-3">{formatPrice(vehicle.price)}</td>
                    <td className="px-4 py-3">{formatMileage(vehicle.mileage)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${statusClass[vehicle.status]}`}>
                        {statusLabels[vehicle.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/vehicles/${vehicle.id}`}
                          className="inline-flex h-9 items-center rounded-control bg-white/10 px-3 text-xs font-bold hover:bg-white/15"
                        >
                          Редагувати
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeVehicle(vehicle)}
                          disabled={remove.isPending}
                          className="inline-flex h-9 items-center rounded-control px-3 text-xs font-bold text-heart hover:bg-white/5 disabled:opacity-50"
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Container>
  )
}

function countStatus(vehicles: AdminVehicle[], status: AdminVehicle['status']) {
  return vehicles.filter((vehicle) => vehicle.status === status).length
}

function countLabel(query: { isSuccess: boolean }, value: number) {
  return query.isSuccess ? String(value) : '…'
}

function readNotice(state: unknown) {
  if (typeof state !== 'object' || state === null || !('notice' in state)) return null
  return typeof state.notice === 'string' ? state.notice : null
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-white/10 bg-panel px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">{label}</p>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </div>
  )
}

function Panel({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="rounded-card border border-white/10 bg-panel px-6 py-14 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-mist">{text}</p>
      {children}
    </div>
  )
}
