import { useState, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  inquiryStatusLabels,
  inquiryStatuses,
  type InquiryStatus,
} from '@/features/admin/model/inquiryStatus'
import {
  adminInquiriesQueryKey,
  deleteInquiry,
  getAdminInquiries,
  updateInquiryStatus,
  type AdminInquiry,
} from '@/features/admin/services/adminInquiries'
import { Container } from '@/shared/ui/Container'

const fieldClass =
  'h-10 rounded-control border border-white/10 bg-ink px-3 text-sm text-white outline-none focus-visible:border-accent'

export function AdminInquiriesPage() {
  const queryClient = useQueryClient()
  const inquiriesQuery = useQuery({
    queryKey: adminInquiriesQueryKey,
    queryFn: getAdminInquiries,
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const inquiries = inquiriesQuery.data ?? []
  const selected = inquiries.find((inquiry) => inquiry.id === selectedId) ?? null

  const refresh = () => queryClient.invalidateQueries({ queryKey: adminInquiriesQueryKey })

  const statusChange = useMutation({
    mutationFn: (payload: { id: string; status: InquiryStatus }) =>
      updateInquiryStatus(payload.id, payload.status),
    onSuccess: async () => {
      setActionError(null)
      await refresh()
    },
    onError: (cause) => {
      setActionError(cause instanceof Error ? cause.message : 'Не вдалося змінити статус заявки.')
    },
  })

  const remove = useMutation({
    mutationFn: deleteInquiry,
    onSuccess: async () => {
      setSelectedId(null)
      setActionError(null)
      await refresh()
    },
    onError: (cause) => {
      setActionError(cause instanceof Error ? cause.message : 'Не вдалося видалити заявку.')
    },
  })

  const removeInquiry = (inquiry: AdminInquiry) => {
    const confirmed = window.confirm(`Видалити заявку від ${inquiry.name}?`)
    if (!confirmed) return
    remove.mutate(inquiry.id)
  }

  return (
    <Container className="py-8 sm:py-10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">Заявки</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Заявки клієнтів</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">
        Нові звернення з сайту. Листи клієнтам не надсилаються.
      </p>

      {actionError ? <p className="mt-4 text-sm text-heart">{actionError}</p> : null}

      <section className="mt-6">
        {inquiriesQuery.isPending ? (
          <Panel title="Завантаження заявок…" text="Отримуємо звернення клієнтів." />
        ) : inquiriesQuery.isError ? (
          <Panel title="Не вдалося завантажити заявки" text={inquiriesQuery.error.message}>
            <button
              type="button"
              onClick={() => void inquiriesQuery.refetch()}
              className="mt-5 inline-flex h-11 items-center rounded-control bg-accent px-4 text-sm font-bold text-white"
            >
              Спробувати ще
            </button>
          </Panel>
        ) : inquiries.length === 0 ? (
          <Panel title="Заявок поки немає" text="Нові звернення з форми контактів з’являться тут." />
        ) : (
          <div className="overflow-x-auto rounded-card border border-white/10 bg-panel">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-white/10 text-mist">
                <tr>
                  <th className="px-4 py-3 font-semibold">Клієнт</th>
                  <th className="px-4 py-3 font-semibold">Телефон</th>
                  <th className="px-4 py-3 font-semibold">Пошта</th>
                  <th className="px-4 py-3 font-semibold">Авто</th>
                  <th className="px-4 py-3 font-semibold">Дата</th>
                  <th className="px-4 py-3 font-semibold">Статус</th>
                  <th className="px-4 py-3 font-semibold">Дії</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-white/10 last:border-0">
                    <td className="px-4 py-3 font-semibold">{inquiry.name}</td>
                    <td className="px-4 py-3">{inquiry.phone}</td>
                    <td className="px-4 py-3">{inquiry.email ?? '—'}</td>
                    <td className="px-4 py-3">{inquiry.vehicleLabel ?? 'Без авто'}</td>
                    <td className="px-4 py-3">{formatSubmittedAt(inquiry.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={inquiry.status}
                        disabled={statusChange.isPending}
                        aria-label={`Статус заявки ${inquiry.name}`}
                        onChange={(event) => {
                          const status = event.target.value
                          if (status === 'new' || status === 'contacted' || status === 'closed') {
                            statusChange.mutate({ id: inquiry.id, status })
                          }
                        }}
                        className={fieldClass}
                      >
                        {inquiryStatuses.map((status) => (
                          <option key={status} value={status}>
                            {inquiryStatusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedId(inquiry.id)}
                          className="inline-flex h-9 items-center rounded-control bg-white/10 px-3 text-xs font-bold hover:bg-white/15"
                        >
                          Деталі
                        </button>
                        <button
                          type="button"
                          onClick={() => removeInquiry(inquiry)}
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

      {selected ? (
        <section className="mt-5 rounded-card border border-white/10 bg-panel p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-glow">Деталі заявки</p>
              <h2 className="mt-2 text-2xl font-extrabold">{selected.name}</h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="text-sm font-semibold text-mist hover:text-white"
            >
              Закрити
            </button>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Detail label="Телефон" value={selected.phone} />
            <Detail label="Електронна пошта" value={selected.email ?? '—'} />
            <Detail label="Авто" value={selected.vehicleLabel ?? 'Без авто'} />
            <Detail label="Дата" value={formatSubmittedAt(selected.createdAt)} />
            <Detail label="Статус" value={inquiryStatusLabels[selected.status]} />
          </dl>
          <div className="mt-4">
            <p className="text-sm text-mist">Повідомлення</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{selected.message ?? '—'}</p>
          </div>
        </section>
      ) : null}
    </Container>
  )
}

function formatSubmittedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-mist">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  )
}

function Panel({
  title,
  text,
  children,
}: {
  title: string
  text: string
  children?: ReactNode
}) {
  return (
    <div className="rounded-card border border-white/10 bg-panel px-6 py-14 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-mist">{text}</p>
      {children}
    </div>
  )
}
