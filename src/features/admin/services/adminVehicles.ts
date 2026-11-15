import { supabase } from '@/lib/supabase'
import {
  isVehicleStatus,
  type VehicleInput,
  type VehicleStatus,
} from '@/features/admin/model/vehicleDraft'

const bucket = 'vehicle-photos'
const vehicleColumns =
  'id, brand, model, year, price, mileage, fuel, body_type, status, image, vehicle_photos(id, url, storage_path, sort_order)'

export const adminVehiclesQueryKey = ['admin-vehicles'] as const

export function adminVehicleQueryKey(id: number) {
  return ['admin-vehicle', id] as const
}

export type AdminVehicle = {
  id: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  bodyType: string
  status: VehicleStatus
  imageUrl: string
  photos: AdminPhoto[]
}

export type AdminPhoto = {
  id: string
  storagePath: string
  sortOrder: number
  previewUrl: string
}

export type PhotoChange = {
  existingId?: string
  storagePath?: string
  file?: File
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function fail(message: string): never {
  throw new Error(message)
}

function readStatus(value: unknown): VehicleStatus {
  if (typeof value !== 'string' || !isVehicleStatus(value)) {
    fail('Не вдалося прочитати статус автомобіля.')
  }
  return value
}

function readPhotos(value: unknown) {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.storage_path !== 'string') {
      return []
    }

    const sortOrder = Number(item.sort_order)
    return [
      {
        id: item.id,
        storagePath: item.storage_path,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    ]
  })
}

function readVehicle(value: unknown) {
  if (!isRecord(value)) fail('Не вдалося прочитати автомобіль.')

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
    fail('Не вдалося прочитати автомобіль.')
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
    status: readStatus(value.status),
    image: value.image,
    photos: readPhotos(value.vehicle_photos).sort((left, right) => left.sortOrder - right.sortOrder),
  }
}

function readId(value: unknown) {
  if (!isRecord(value) || !Number.isInteger(Number(value.id))) {
    fail('Не вдалося зберегти автомобіль.')
  }
  return Number(value.id)
}

function readPhotoId(value: unknown) {
  if (!isRecord(value) || typeof value.id !== 'string') {
    fail('Не вдалося зберегти фото.')
  }
  return value.id
}

function fileExtension(file: File) {
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return 'jpg'
}

function isHttpUrl(value: string) {
  return /^https?:\/\//.test(value)
}

async function signedUrls(paths: string[]) {
  const unique = [...new Set(paths.filter((path) => path !== ''))]
  const urls = new Map<string, string>()
  if (unique.length === 0) return urls

  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(unique, 60 * 60)
  if (error || !data) return urls

  for (const item of data) {
    if (item.path && item.signedUrl && !item.error) {
      urls.set(item.path, item.signedUrl)
    }
  }

  return urls
}

function withPreview(
  vehicle: ReturnType<typeof readVehicle>,
  urls: Map<string, string>,
): AdminVehicle {
  const photos = vehicle.photos.map((photo) => ({
    id: photo.id,
    storagePath: photo.storagePath,
    sortOrder: photo.sortOrder,
    previewUrl: urls.get(photo.storagePath) ?? '',
  }))
  const main = photos[0]

  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    fuel: vehicle.fuel,
    bodyType: vehicle.bodyType,
    status: vehicle.status,
    imageUrl: main?.previewUrl || (isHttpUrl(vehicle.image) ? vehicle.image : ''),
    photos,
  }
}

async function present(rows: unknown[]) {
  const vehicles = rows.map((row) => readVehicle(row))
  const urls = await signedUrls(vehicles.flatMap((vehicle) => vehicle.photos.map((photo) => photo.storagePath)))
  return vehicles.map((vehicle) => withPreview(vehicle, urls))
}

export async function getAdminVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select(vehicleColumns)
    .order('created_at', { ascending: false })

  if (error) fail('Не вдалося завантажити склад автомобілів.')
  return present(data ?? [])
}

export async function getAdminVehicle(id: number) {
  if (!Number.isInteger(id)) return null

  const { data, error } = await supabase
    .from('vehicles')
    .select(vehicleColumns)
    .eq('id', id)
    .maybeSingle()

  if (error) fail('Не вдалося завантажити автомобіль.')
  if (!data) return null

  const [vehicle] = await present([data])
  return vehicle ?? null
}

async function uploadFile(vehicleId: number, file: File) {
  const path = `${vehicleId}/${crypto.randomUUID()}.${fileExtension(file)}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })

  if (error) fail('Не вдалося завантажити фото.')
  return path
}

async function insertPhoto(vehicleId: number, path: string, sortOrder: number) {
  const { data, error } = await supabase
    .from('vehicle_photos')
    .insert({
      vehicle_id: vehicleId,
      url: path,
      storage_path: path,
      sort_order: sortOrder,
    })
    .select('id')
    .single()

  if (error) fail('Не вдалося зберегти фото.')
  return readPhotoId(data)
}

async function removeStoredFiles(paths: string[]) {
  if (paths.length === 0) return
  const { error } = await supabase.storage.from(bucket).remove(paths)
  if (error) fail('Не вдалося видалити фото зі сховища.')
}

async function shiftSortOrders(vehicleId: number) {
  const { data, error } = await supabase
    .from('vehicle_photos')
    .select('id, sort_order')
    .eq('vehicle_id', vehicleId)

  if (error) fail('Не вдалося оновити порядок фото.')

  const rows = (data ?? []).flatMap((row) => {
    if (!isRecord(row) || typeof row.id !== 'string') return []
    const sortOrder = Number(row.sort_order)
    return [{ id: row.id, sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0 }]
  })
  const maxSort = rows.reduce((highest, row) => Math.max(highest, row.sortOrder), 0)

  for (const [index, row] of rows.entries()) {
    const { error: updateError } = await supabase
      .from('vehicle_photos')
      .update({ sort_order: maxSort + 1 + index })
      .eq('id', row.id)

    if (updateError) fail('Не вдалося оновити порядок фото.')
  }
}

async function writeFinalOrder(ids: string[]) {
  for (const [index, id] of ids.entries()) {
    const { error } = await supabase.from('vehicle_photos').update({ sort_order: index }).eq('id', id)
    if (error) fail('Не вдалося оновити порядок фото.')
  }
}

async function deletePhotoRecords(photos: Array<{ id: string; storagePath: string }>) {
  if (photos.length === 0) return
  await removeStoredFiles(photos.map((photo) => photo.storagePath))

  const { error } = await supabase
    .from('vehicle_photos')
    .delete()
    .in(
      'id',
      photos.map((photo) => photo.id),
    )

  if (error) fail('Не вдалося видалити фото.')
}

export async function createVehicle(input: VehicleInput, files: File[]) {
  if (files.length === 0) fail('Додайте хоча б одне фото.')

  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      brand: input.brand,
      model: input.model,
      year: input.year,
      price: input.price,
      mileage: input.mileage,
      fuel: input.fuel,
      body_type: input.bodyType,
      image: 'pending',
      status: 'hidden',
    })
    .select('id')
    .single()

  if (error) fail('Не вдалося створити автомобіль.')

  const id = readId(data)
  const uploaded: string[] = []

  try {
    for (const [index, file] of files.entries()) {
      const path = await uploadFile(id, file)
      uploaded.push(path)
      await insertPhoto(id, path, index)
    }
  } catch {
    if (uploaded.length > 0) {
      await supabase.storage.from(bucket).remove(uploaded)
    }
    const { error: deleteError } = await supabase.from('vehicles').delete().eq('id', id)
    if (deleteError) {
      fail('Не вдалося зберегти фото. Прихований запис лишився у складі — видаліть його вручну.')
    }
    fail('Не вдалося зберегти фото. Автомобіль не додано до складу.')
  }

  const { error: publishError } = await supabase.from('vehicles').update({ status: input.status }).eq('id', id)

  if (publishError) {
    fail('Авто збережено як приховане, бо не вдалося встановити статус.')
  }

  return id
}

export async function updateVehicle(
  id: number,
  input: VehicleInput,
  ordered: PhotoChange[],
  removed: Array<{ id: string; storagePath: string }>,
) {
  if (ordered.length === 0) fail('Залиште хоча б одне фото.')

  const uploaded: string[] = []
  const inserted: string[] = []
  const orderedIds: string[] = []

  try {
    let temporaryOrder = 200000
    for (const photo of ordered) {
      if (photo.existingId) {
        orderedIds.push(photo.existingId)
        continue
      }
      if (!photo.file) fail('Не вдалося прочитати фото для збереження.')

      const path = await uploadFile(id, photo.file)
      uploaded.push(path)
      const photoId = await insertPhoto(id, path, temporaryOrder)
      temporaryOrder += 1
      inserted.push(photoId)
      orderedIds.push(photoId)
    }
  } catch (cause) {
    if (inserted.length > 0) {
      await supabase.from('vehicle_photos').delete().in('id', inserted)
    }
    if (uploaded.length > 0) {
      await supabase.storage.from(bucket).remove(uploaded)
    }
    if (cause instanceof Error) throw cause
    fail('Не вдалося завантажити нові фото.')
  }

  await deletePhotoRecords(removed)
  await shiftSortOrders(id)
  await writeFinalOrder(orderedIds)

  const { error } = await supabase
    .from('vehicles')
    .update({
      brand: input.brand,
      model: input.model,
      year: input.year,
      price: input.price,
      mileage: input.mileage,
      fuel: input.fuel,
      body_type: input.bodyType,
      status: input.status,
    })
    .eq('id', id)

  if (error) fail('Фото оновлено, але не вдалося зберегти дані автомобіля.')
}

export async function deleteVehicle(id: number) {
  const { data, error } = await supabase
    .from('vehicle_photos')
    .select('storage_path')
    .eq('vehicle_id', id)

  if (error) fail('Не вдалося підготувати видалення автомобіля.')

  const paths = (data ?? []).flatMap((row) =>
    isRecord(row) && typeof row.storage_path === 'string' ? [row.storage_path] : [],
  )

  await removeStoredFiles(paths)

  const { error: deleteError } = await supabase.from('vehicles').delete().eq('id', id)
  if (deleteError) fail('Фото зі сховища прибрано, але запис автомобіля лишився.')
}
