export const vehicleStatuses = ['available', 'expected', 'sold', 'hidden'] as const

export type VehicleStatus = (typeof vehicleStatuses)[number]

export const statusLabels: Record<VehicleStatus, string> = {
  available: 'В наявності',
  expected: 'Очікується',
  sold: 'Продано',
  hidden: 'Приховано',
}

export const fuelOptions = ['Бензин', 'Дизель', 'Гібрид', 'Електро'] as const

export const bodyTypeOptions = ['Седан', 'Позашляховик', 'Купе', 'Універсал'] as const

const photoTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxPhotoBytes = 5 * 1024 * 1024

export type VehicleDraft = {
  brand: string
  model: string
  year: string
  price: string
  mileage: string
  fuel: string
  bodyType: string
  status: string
}

export type VehicleField = keyof VehicleDraft | 'photos'

export type VehicleErrors = Partial<Record<VehicleField, string>>

export type VehicleInput = {
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  bodyType: string
  status: VehicleStatus
}

export function emptyVehicleDraft(): VehicleDraft {
  return {
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuel: fuelOptions[0],
    bodyType: bodyTypeOptions[0],
    status: 'available',
  }
}

export function isVehicleStatus(value: string): value is VehicleStatus {
  return vehicleStatuses.some((status) => status === value)
}

export function validatePhotoFile(file: File): string | null {
  if (!photoTypes.has(file.type)) {
    return 'Дозволені лише JPEG, PNG і WebP.'
  }

  if (file.size > maxPhotoBytes) {
    return 'Файл більший за 5 МБ.'
  }

  return null
}

export function validateVehicleDraft(draft: VehicleDraft, photoCount: number): VehicleErrors {
  const errors: VehicleErrors = {}
  const year = Number(draft.year)
  const price = Number(draft.price)
  const mileage = Number(draft.mileage)

  if (draft.brand.trim() === '') errors.brand = 'Вкажіть марку.'
  if (draft.model.trim() === '') errors.model = 'Вкажіть модель.'

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    errors.year = 'Вкажіть рік від 1900 до 2100.'
  }

  if (draft.price.trim() === '' || !Number.isFinite(price) || price < 0) {
    errors.price = 'Вкажіть ціну в доларах, не меншу за 0.'
  }

  if (!Number.isInteger(mileage) || mileage < 0) {
    errors.mileage = 'Вкажіть пробіг у кілометрах, ціле число від 0.'
  }

  if (draft.fuel.trim() === '') errors.fuel = 'Вкажіть паливо.'
  if (draft.bodyType.trim() === '') errors.bodyType = 'Вкажіть тип кузова.'
  if (!isVehicleStatus(draft.status)) errors.status = 'Оберіть статус.'
  if (photoCount < 1) errors.photos = 'Додайте хоча б одне фото.'

  return errors
}

export function toVehicleInput(draft: VehicleDraft): VehicleInput {
  const status = draft.status
  if (!isVehicleStatus(status)) {
    throw new Error('Оберіть статус.')
  }

  return {
    brand: draft.brand.trim(),
    model: draft.model.trim(),
    year: Number(draft.year),
    price: Number(draft.price),
    mileage: Number(draft.mileage),
    fuel: draft.fuel.trim(),
    bodyType: draft.bodyType.trim(),
    status,
  }
}
