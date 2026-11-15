import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { validateLogin } from '@/features/admin/model/login'
import { adminAccessQueryKey, loadAdminAccess, signInAdmin } from '@/features/admin/services/adminAuth'

const fieldClass =
  'h-12 w-full rounded-control border border-white/10 bg-ink px-4 text-sm text-white outline-none transition focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/20'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const access = useQuery({
    queryKey: adminAccessQueryKey,
    queryFn: loadAdminAccess,
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<ReturnType<typeof validateLogin>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const forbidden = isForbiddenState(location.state)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateLogin(email, password)
    setErrors(nextErrors)
    setFormError(null)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    try {
      await signInAdmin(email, password)
      await queryClient.invalidateQueries({ queryKey: adminAccessQueryKey })
      navigate('/admin', { replace: true })
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : 'Не вдалося увійти.')
    } finally {
      setPending(false)
    }
  }

  if (access.data === 'allowed') {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-4 py-10 text-white">
      <form
        onSubmit={(event) => void submit(event)}
        noValidate
        className="w-full max-w-md rounded-card border border-white/10 bg-panel p-6 sm:p-8"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">AUTO MARKET</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Вхід адміністратора</h1>
        <p className="mt-3 text-sm leading-6 text-mist">
          Панель лише для адміністратора компанії. Реєстрація нових облікових записів вимкнена.
        </p>

        {forbidden ? (
          <p className="mt-4 rounded-control border border-heart/40 bg-heart/10 px-4 py-3 text-sm">
            Цей обліковий запис не має доступу до панелі.
          </p>
        ) : null}
        {formError ? <p className="mt-4 text-sm text-heart">{formError}</p> : null}

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-semibold">Електронна пошта</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
          {errors.email ? <span className="mt-2 block text-sm text-heart">{errors.email}</span> : null}
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold">Пароль</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
          />
          {errors.password ? <span className="mt-2 block text-sm text-heart">{errors.password}</span> : null}
        </label>

        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-control bg-accent text-sm font-bold text-white transition hover:bg-accent-strong disabled:opacity-60"
        >
          {pending ? 'Вхід…' : 'Увійти'}
        </button>
        <Link to="/" className="mt-4 inline-flex text-sm font-semibold text-mist hover:text-white">
          Повернутися на сайт
        </Link>
      </form>
    </div>
  )
}

function isForbiddenState(state: unknown) {
  return typeof state === 'object' && state !== null && 'forbidden' in state && state.forbidden === true
}
