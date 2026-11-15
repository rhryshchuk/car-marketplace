import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { VehicleForm, type VehiclePhotoDraft } from '@/features/admin/components/VehicleForm'
import type { VehicleInput } from '@/features/admin/model/vehicleDraft'
import {
  adminVehicleQueryKey,
  adminVehiclesQueryKey,
  createVehicle,
  getAdminVehicle,
  updateVehicle,
} from '@/features/admin/services/adminVehicles'
import { vehiclesQueryKey } from '@/services/vehicleService'
import { Container } from '@/shared/ui/Container'

export function AdminVehicleCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const save = useMutation({
    mutationFn: (payload: { input: VehicleInput; photos: VehiclePhotoDraft[] }) =>
      createVehicle(
        payload.input,
        payload.photos.flatMap((photo) => (photo.file ? [photo.file] : [])),
      ),
    onSuccess: async () => {
      await refreshInventory(queryClient)
      navigate('/admin', { replace: true, state: { notice: 'Автомобіль додано до складу.' } })
    },
    onError: async (cause) => {
      const message = cause instanceof Error ? cause.message : 'Не вдалося зберегти автомобіль.'
      if (message.includes('приховане')) {
        await refreshInventory(queryClient)
        navigate('/admin', { replace: true, state: { notice: message } })
        return
      }
      setFormError(message)
    },
  })

  return (
    <Container className="py-8 sm:py-10">
      <VehicleForm
        title="Новий автомобіль"
        submitLabel="Додати автомобіль"
        pending={save.isPending}
        formError={formError}
        onSubmit={(input, photos) => {
          setFormError(null)
          save.mutate({ input, photos })
        }}
      />
    </Container>
  )
}

export function AdminVehicleEditPage() {
  const { vehicleId } = useParams()
  const id = Number(vehicleId)
  const canLoad = Number.isInteger(id) && id > 0
  const vehicleQuery = useQuery({
    queryKey: adminVehicleQueryKey(canLoad ? id : 0),
    queryFn: () => getAdminVehicle(id),
    enabled: canLoad,
  })

  if (!canLoad) return <MissingVehicle />
  if (vehicleQuery.isPending) {
    return (
      <Container className="py-8">
        <p className="text-sm text-mist">Завантаження автомобіля…</p>
      </Container>
    )
  }
  if (vehicleQuery.isError) {
    return (
      <Container className="py-8">
        <p className="text-sm text-heart">{vehicleQuery.error.message}</p>
      </Container>
    )
  }
  if (!vehicleQuery.data) return <MissingVehicle />

  return <EditVehicle vehicle={vehicleQuery.data} />
}

function EditVehicle({
  vehicle,
}: {
  vehicle: NonNullable<Awaited<ReturnType<typeof getAdminVehicle>>>
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const save = useMutation({
    mutationFn: (payload: { input: VehicleInput; photos: VehiclePhotoDraft[] }) => {
      const kept = new Set(
        payload.photos.flatMap((photo) => (photo.existingId ? [photo.existingId] : [])),
      )
      const removed = vehicle.photos
        .filter((photo) => !kept.has(photo.id))
        .map((photo) => ({ id: photo.id, storagePath: photo.storagePath }))

      return updateVehicle(
        vehicle.id,
        payload.input,
        payload.photos.map((photo) => ({
          existingId: photo.existingId,
          storagePath: photo.storagePath,
          file: photo.file,
        })),
        removed,
      )
    },
    onSuccess: async () => {
      await refreshInventory(queryClient)
      await queryClient.invalidateQueries({ queryKey: adminVehicleQueryKey(vehicle.id) })
      navigate('/admin', { replace: true, state: { notice: 'Зміни збережено.' } })
    },
    onError: (cause) => {
      setFormError(cause instanceof Error ? cause.message : 'Не вдалося зберегти зміни.')
    },
  })

  return (
    <Container className="py-8 sm:py-10">
      <VehicleForm
        key={vehicle.id}
        title={`${vehicle.brand} ${vehicle.model}`}
        submitLabel="Зберегти зміни"
        pending={save.isPending}
        formError={formError}
        initialDraft={{
          brand: vehicle.brand,
          model: vehicle.model,
          year: String(vehicle.year),
          price: String(vehicle.price),
          mileage: String(vehicle.mileage),
          fuel: vehicle.fuel,
          bodyType: vehicle.bodyType,
          status: vehicle.status,
        }}
        initialPhotos={vehicle.photos.map((photo) => ({
          key: photo.id,
          name: 'Збережене фото',
          previewUrl: photo.previewUrl,
          existingId: photo.id,
          storagePath: photo.storagePath,
        }))}
        onSubmit={(input, photos) => {
          setFormError(null)
          save.mutate({ input, photos })
        }}
      />
    </Container>
  )
}

async function refreshInventory(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.invalidateQueries({ queryKey: adminVehiclesQueryKey })
  await queryClient.invalidateQueries({ queryKey: vehiclesQueryKey })
}

function MissingVehicle() {
  return (
    <Container className="py-10">
      <div className="rounded-card border border-white/10 bg-panel px-6 py-14 text-center">
        <h1 className="text-xl font-bold">Автомобіль не знайдено</h1>
        <Link
          to="/admin"
          className="mt-5 inline-flex h-11 items-center rounded-control bg-accent px-4 text-sm font-bold text-white"
        >
          До складу
        </Link>
      </div>
    </Container>
  )
}
