import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { InquiryForm } from '@/features/contacts/components/InquiryForm'
import { getVehicleById, vehicleQueryKey } from '@/services/vehicleService'
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle'
import { Container } from '@/shared/ui/Container'

const contactPlaceholders = [
  { label: 'Телефон', value: 'Буде додано' },
  { label: 'Електронна пошта', value: 'Буде додано' },
  { label: 'Адреса', value: 'Буде додано' },
]

export function ContactsPage() {
  useDocumentTitle('Контакти — AUTO MARKET')
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId')
  const id = Number(vehicleId)
  const canLoad = vehicleId !== null && Number.isInteger(id) && id > 0
  const vehicleQuery = useQuery({
    queryKey: vehicleQueryKey(canLoad ? id : 0),
    queryFn: () => getVehicleById(id),
    enabled: canLoad,
  })
  const vehicle = vehicleQuery.data ?? null
  const vehicleTitle = vehicle ? `${vehicle.brand} ${vehicle.model}` : null
  const initialMessage = vehicleTitle ? `Цікавить ${vehicleTitle}.` : ''

  return (
    <Container className="py-10 sm:py-12">
      <section className="mb-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">AUTO MARKET</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Контакти</h1>
        <p className="mt-3 text-base leading-7 text-mist">
          AUTO MARKET продає автомобілі зі США. Напишіть ім’я і телефон, якщо хочете дізнатися про
          авто з каталогу. Заявка зберігається для адміністратора компанії.
        </p>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-card border border-white/10 bg-panel p-5 sm:p-7">
          <h2 className="text-xl font-extrabold">Як зв’язатися</h2>
          <p className="mt-3 text-sm leading-6 text-mist">
            Контакти компанії ще не додані. Нижче залишено місця, які можна заповнити пізніше.
          </p>
          <dl className="mt-6 grid gap-4">
            {contactPlaceholders.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-mist">{item.label}</dt>
                <dd className="mt-1 font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div>
          {canLoad && vehicleQuery.isPending ? (
            <p className="mb-4 text-sm text-mist">Завантаження автомобіля для заявки…</p>
          ) : null}
          {canLoad && vehicleQuery.isError ? (
            <p className="mb-4 text-sm text-mist">
              Не вдалося підставити автомобіль у заявку. {vehicleQuery.error.message}
            </p>
          ) : null}
          <InquiryForm
            key={vehicle?.id ?? 'general'}
            initialMessage={initialMessage}
            vehicleTitle={vehicleTitle}
            vehicleId={vehicle?.id ?? null}
          />
        </div>
      </div>
    </Container>
  )
}
