import type { Vehicle } from '@/data/vehicles'
import { supabase } from '@/lib/supabase'

const publicStatuses = ['available', 'expected', 'sold'] as const

export type PublicStatus = (typeof publicStatuses)[number]

export type VehicleView = Vehicle & {
  status: PublicStatus | null
  photos: string[]
}

const vehicleColumns =
  'id, brand, model, year, price, mileage, fuel, body_type, image, vehicle_photos(url, storage_path, sort_order)'

export const vehiclesQueryKey = ['vehicles'] as const

export function vehicleQueryKey(id: number) {
  return ['vehicles', id] as const
}

type PhotoRow = {
  url: string
  storagePath: string
  sortOrder: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readPhotos(value: unknown): PhotoRow[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.url !== 'string' || typeof item.storage_path !== 'string') {
      return []
    }

    const sortOrder = Number(item.sort_order)
    return [
      {
        url: item.url,
        storagePath: item.storage_path,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    ]
  })
}

function readVehicleFields(value: unknown) {
  if (!isRecord(value)) {
    throw new Error('Не вдалося прочитати дані автомобіля.')
  }

  const id = Number(value.id)
  const year = Number(value.year)
  const price = Number(value.price)
  const mileage = Number(value.mileage)

  if (
    !Number.isInteger(id) ||
    !Number.isInteger(year) ||
    !Number.isFinite(price) ||
    !Number.isInteger(mileage) ||
    typeof value.brand !== 'string' ||
    typeof value.model !== 'string' ||
    typeof value.fuel !== 'string' ||
    typeof value.body_type !== 'string' ||
    typeof value.image !== 'string'
  ) {
    throw new Error('Не вдалося прочитати дані автомобіля.')
  }

  return {
    id,
    brand: value.brand,
    model: value.model,
    year,
    price,
    mileage,
    fuel: value.fuel,
    bodyType: value.body_type,
    image: value.image,
    photos: readPhotos(value.vehicle_photos),
  }
}

function isHttpUrl(value: string) {
  return /^https?:\/\//.test(value)
}

async function mainImage(image: string, photos: PhotoRow[]) {
  const [photo] = [...photos].sort((left, right) => left.sortOrder - right.sortOrder)

  if (photo && isHttpUrl(photo.url)) return photo.url
  if (isHttpUrl(image)) return image
  if (!photo?.storagePath) return image

  const { data, error } = await supabase.storage
    .from('vehicle-photos')
    .createSignedUrl(photo.storagePath, 60 * 60)

  if (error || !data?.signedUrl) return image
  return data.signedUrl
}

function isPublicStatus(value: string): value is PublicStatus {
  return publicStatuses.some((status) => status === value)
}

async function photoUrls(photos: PhotoRow[], fallback: string) {
  const sorted = [...photos].sort((left, right) => left.sortOrder - right.sortOrder)
  const stored = sorted.filter((photo) => !isHttpUrl(photo.url))
  const signed = new Map<string, string>()

  if (stored.length > 0) {
    const { data } = await supabase.storage
      .from('vehicle-photos')
      .createSignedUrls(
        stored.map((photo) => photo.storagePath),
        60 * 60,
      )

    for (const item of data ?? []) {
      if (item.path && item.signedUrl && !item.error) signed.set(item.path, item.signedUrl)
    }
  }

  const urls = sorted.flatMap((photo) => {
    if (isHttpUrl(photo.url)) return [photo.url]
    const url = signed.get(photo.storagePath)
    return url ? [url] : []
  })

  if (urls.length > 0) return urls
  return fallback ? [fallback] : []
}

async function toVehicle(value: unknown): Promise<Vehicle> {
  const fields = readVehicleFields(value)

  return {
    id: fields.id,
    brand: fields.brand,
    model: fields.model,
    year: fields.year,
    price: fields.price,
    mileage: fields.mileage,
    fuel: fields.fuel,
    bodyType: fields.bodyType,
    image: await mainImage(fields.image, fields.photos),
  }
}

function queryError() {
  return new Error('Не вдалося завантажити автомобілі. Перевір з’єднання і спробуй ще раз.')
}

export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select(vehicleColumns)
    .in('status', [...publicStatuses])
    .order('created_at', { ascending: false })

  if (error) throw queryError()
  return Promise.all((data ?? []).map((row) => toVehicle(row)))
}

export async function getVehicleById(id: number): Promise<VehicleView | null> {
  if (!Number.isInteger(id)) return null

  const { data, error } = await supabase
    .from('vehicles')
    .select(`${vehicleColumns}, status`)
    .eq('id', id)
    .in('status', [...publicStatuses])
    .maybeSingle()

  if (error) throw queryError()
  if (!data) return null

  const vehicle = await toVehicle(data)
  const fields = readVehicleFields(data)
  const status = isRecord(data) && typeof data.status === 'string' && isPublicStatus(data.status) ? data.status : null

  return {
    ...vehicle,
    status,
    photos: await photoUrls(fields.photos, vehicle.image),
  }
}
