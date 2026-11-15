import { useState, type FormEvent, type ReactNode } from 'react'
import {
  bodyTypeOptions,
  emptyVehicleDraft,
  fuelOptions,
  statusLabels,
  toVehicleInput,
  validatePhotoFile,
  validateVehicleDraft,
  vehicleStatuses,
  type VehicleDraft,
  type VehicleInput,
} from '@/features/admin/model/vehicleDraft'

const fieldClass =
  'h-12 w-full rounded-control border border-white/10 bg-ink px-4 text-sm text-white outline-none transition focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/20'

export type VehiclePhotoDraft = {
  key: string
  name: string
  previewUrl: string
  file?: File
  existingId?: string
  storagePath?: string
}

type VehicleFormProps = {
  title: string
  submitLabel: string
  initialDraft?: VehicleDraft
  initialPhotos?: VehiclePhotoDraft[]
  pending: boolean
  formError: string | null
  onSubmit: (input: VehicleInput, photos: VehiclePhotoDraft[]) => void
}

export function VehicleForm({
  title,
  submitLabel,
  initialDraft = emptyVehicleDraft(),
  initialPhotos = [],
  pending,
  formError,
  onSubmit,
}: VehicleFormProps) {
  const [draft, setDraft] = useState(initialDraft)
  const [photos, setPhotos] = useState(initialPhotos)
  const [errors, setErrors] = useState<ReturnType<typeof validateVehicleDraft>>({})
  const [photoMessage, setPhotoMessage] = useState<string | null>(null)
  const update = (field: keyof VehicleDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  const addPhotos = (list: FileList | null) => {
    if (!list) return
    const accepted: VehiclePhotoDraft[] = []
    const problems: string[] = []

    for (const file of list) {
      const problem = validatePhotoFile(file)
      if (problem) {
        problems.push(`${file.name}: ${problem}`)
        continue
      }

      accepted.push({
        key: crypto.randomUUID(),
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        file,
      })
    }

    setPhotos((current) => [...current, ...accepted])
    setPhotoMessage(problems.length > 0 ? problems.join(' ') : null)
  }

  const removePhoto = (key: string) => {
    setPhotos((current) => {
      const photo = current.find((item) => item.key === key)
      if (photo?.file) URL.revokeObjectURL(photo.previewUrl)
      return current.filter((item) => item.key !== key)
    })
  }

  const makeMain = (key: string) => {
    setPhotos((current) => {
      const index = current.findIndex((item) => item.key === key)
      if (index <= 0) return current
      const next = [...current]
      const [photo] = next.splice(index, 1)
      if (!photo) return current
      next.unshift(photo)
      return next
    })
  }

  const movePhoto = (key: string, direction: -1 | 1) => {
    setPhotos((current) => {
      const index = current.findIndex((item) => item.key === key)
      const target = index + direction
      if (index < 0 || target < 0 || target >= current.length) return current
      const next = [...current]
      const [photo] = next.splice(index, 1)
      if (!photo) return current
      next.splice(target, 0, photo)
      return next
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateVehicleDraft(draft, photos.length)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit(toVehicleInput(draft), photos)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-mist">Перше фото в списку стає головним у каталозі.</p>
      </div>

      {formError ? (
        <p className="rounded-control border border-heart/40 bg-heart/10 px-4 py-3 text-sm text-white">{formError}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Марка" error={errors.brand}>
          <input value={draft.brand} onChange={(event) => update('brand', event.target.value)} className={fieldClass} />
        </Field>
        <Field label="Модель" error={errors.model}>
          <input value={draft.model} onChange={(event) => update('model', event.target.value)} className={fieldClass} />
        </Field>
        <Field label="Рік" error={errors.year}>
          <input
            inputMode="numeric"
            value={draft.year}
            onChange={(event) => update('year', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Ціна, USD" error={errors.price}>
          <input
            inputMode="decimal"
            value={draft.price}
            onChange={(event) => update('price', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Пробіг, км" error={errors.mileage}>
          <input
            inputMode="numeric"
            value={draft.mileage}
            onChange={(event) => update('mileage', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Паливо" error={errors.fuel}>
          <select value={draft.fuel} onChange={(event) => update('fuel', event.target.value)} className={fieldClass}>
            {withCurrent(fuelOptions, draft.fuel).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Тип кузова" error={errors.bodyType}>
          <select
            value={draft.bodyType}
            onChange={(event) => update('bodyType', event.target.value)}
            className={fieldClass}
          >
            {withCurrent(bodyTypeOptions, draft.bodyType).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Статус" error={errors.status}>
          <select value={draft.status} onChange={(event) => update('status', event.target.value)} className={fieldClass}>
            {vehicleStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="rounded-card border border-white/10 bg-panel p-4 sm:p-6">
        <legend className="px-1 text-sm font-bold">Фото</legend>
        <p className="text-sm text-mist">JPEG, PNG або WebP, до 5 МБ кожне.</p>
        <label className="mt-4 inline-flex h-11 cursor-pointer items-center rounded-control bg-accent px-4 text-sm font-bold text-white transition hover:bg-accent-strong">
          Додати фото
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(event) => {
              addPhotos(event.target.files)
              event.target.value = ''
            }}
          />
        </label>
        {errors.photos ? <p className="mt-3 text-sm text-heart">{errors.photos}</p> : null}
        {photoMessage ? <p className="mt-3 text-sm text-heart">{photoMessage}</p> : null}

        {photos.length > 0 ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {photos.map((photo, index) => (
              <li key={photo.key} className="overflow-hidden rounded-card border border-white/10 bg-ink">
                {photo.previewUrl ? (
                  <img src={photo.previewUrl} alt="" className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <div className="grid aspect-[16/10] place-items-center text-sm text-mist">Немає перегляду</div>
                )}
                <div className="flex flex-wrap items-center gap-2 p-3">
                  <p className="min-w-0 flex-1 truncate text-sm">
                    {index === 0 ? 'Головне фото' : photo.name}
                  </p>
                  {index > 0 ? (
                    <button
                      type="button"
                      onClick={() => makeMain(photo.key)}
                      className="h-9 rounded-control px-2 text-xs font-bold text-glow hover:bg-white/5"
                    >
                      Зробити головним
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => movePhoto(photo.key, -1)}
                    disabled={index === 0}
                    className="h-9 rounded-control px-2 text-xs font-bold text-mist disabled:opacity-40"
                  >
                    Вище
                  </button>
                  <button
                    type="button"
                    onClick={() => movePhoto(photo.key, 1)}
                    disabled={index === photos.length - 1}
                    className="h-9 rounded-control px-2 text-xs font-bold text-mist disabled:opacity-40"
                  >
                    Нижче
                  </button>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.key)}
                    className="h-9 rounded-control px-2 text-xs font-bold text-heart hover:bg-white/5"
                  >
                    Прибрати
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-fit items-center rounded-control bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? 'Збереження…' : submitLabel}
      </button>
    </form>
  )
}

function withCurrent(options: readonly string[], current: string) {
  if (current !== '' && !options.includes(current)) return [current, ...options]
  return [...options]
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-heart">{error}</span> : null}
    </label>
  )
}
