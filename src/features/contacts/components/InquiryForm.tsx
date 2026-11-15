import { useState, type FormEvent } from 'react'
import { validateInquiry, type InquiryErrors, type InquiryInput } from '@/features/contacts/model/inquiry'
import { submitInquiry } from '@/features/contacts/services/submitInquiry'

const fieldClass =
  'w-full rounded-control border border-white/10 bg-ink px-4 text-sm text-white outline-none transition focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/20'

interface InquiryFormProps {
  initialMessage: string
  vehicleTitle: string | null
  vehicleId: number | null
}

const emptyInquiry = (message: string): InquiryInput => ({
  name: '',
  phone: '',
  email: '',
  message,
})

export function InquiryForm({ initialMessage, vehicleTitle, vehicleId }: InquiryFormProps) {
  const [values, setValues] = useState<InquiryInput>(() => emptyInquiry(initialMessage))
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  const update = (field: keyof InquiryInput, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return

    const nextErrors = validateInquiry(values)
    setErrors(nextErrors)
    setFormError(null)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    try {
      await submitInquiry({ ...values, vehicleId })
      setSent(true)
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : 'Не вдалося надіслати заявку. Спробуй ще раз.')
    } finally {
      setPending(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-card border border-white/10 bg-panel p-5 sm:p-7" role="status">
        <h2 className="text-xl font-extrabold">Заявку надіслано</h2>
        <p className="mt-3 text-sm leading-7 text-mist">
          Ми зберегли заявку для адміністратора компанії.
          {vehicleTitle ? ` Вона стосується авто: ${vehicleTitle}.` : ''} Лист на пошту не надсилається.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false)
            setValues(emptyInquiry(initialMessage))
          }}
          className="mt-6 inline-flex h-12 items-center rounded-control border border-white/15 px-4 text-sm font-bold text-white transition hover:bg-white/10"
        >
          Заповнити ще раз
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} noValidate className="rounded-card border border-white/10 bg-panel p-5 sm:p-7">
      <h2 className="text-xl font-extrabold">Залишити заявку</h2>
      {vehicleTitle ? (
        <p className="mt-3 text-sm leading-6 text-mist">Заявка щодо авто: {vehicleTitle}</p>
      ) : null}
      <p className="mt-3 text-sm leading-6 text-mist">
        Заявка зберігається для адміністратора. На електронну пошту вона не надсилається.
      </p>
      {formError ? <p className="mt-4 text-sm text-heart">{formError}</p> : null}

      <div className="mt-6 grid gap-4">
        <Field
          id="inquiry-name"
          label="Ім’я"
          required
          error={errors.name}
          disabled={pending}
          value={values.name}
          onChange={(value) => update('name', value)}
          autoComplete="name"
        />
        <Field
          id="inquiry-phone"
          label="Телефон"
          required
          error={errors.phone}
          disabled={pending}
          value={values.phone}
          onChange={(value) => update('phone', value)}
          autoComplete="tel"
          type="tel"
        />
        <Field
          id="inquiry-email"
          label="Електронна пошта"
          error={errors.email}
          disabled={pending}
          value={values.email}
          onChange={(value) => update('email', value)}
          autoComplete="email"
          type="email"
        />
        <label className="block" htmlFor="inquiry-message">
          <span className="mb-2 block text-sm font-semibold">Повідомлення</span>
          <textarea
            id="inquiry-message"
            rows={5}
            disabled={pending}
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            className={`${fieldClass} min-h-32 py-3 disabled:opacity-60`}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-control bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong disabled:opacity-60 sm:w-auto"
      >
        {pending ? 'Надсилання…' : 'Надіслати заявку'}
      </button>
    </form>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  type = 'text',
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  type?: 'text' | 'tel' | 'email'
  autoComplete?: string
}) {
  const errorId = `${id}-error`

  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold">
        {label} {required ? <span className="text-glow">*</span> : null}
      </span>
      <input
        id={id}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error !== undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${fieldClass} h-12 disabled:opacity-60`}
      />
      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-heart">
          {error}
        </span>
      ) : null}
    </label>
  )
}
