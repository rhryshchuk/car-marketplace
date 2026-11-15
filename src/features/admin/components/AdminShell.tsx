import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { signOutAdmin } from '@/features/admin/services/adminAuth'
import { Container } from '@/shared/ui/Container'

const adminNavClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex h-10 items-center rounded-control px-3 text-sm font-semibold transition ${
    isActive ? 'bg-white/10 text-white' : 'text-mist hover:text-white'
  }`

export function AdminShell() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const logout = async () => {
    setError(null)
    try {
      await signOutAdmin()
      queryClient.clear()
      navigate('/admin/login', { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не вдалося вийти з панелі.')
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-white">
      <header className="border-b border-white/10 bg-ink">
        <Container className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <Link to="/admin" className="text-lg font-extrabold tracking-tight">
            AUTO <span className="text-glow">MARKET</span>
            <span className="ml-2 text-sm font-semibold text-mist">Адмін</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/admin" end className={adminNavClass}>
              Склад
            </NavLink>
            <NavLink to="/admin/inquiries" className={adminNavClass}>
              Заявки
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex h-10 items-center rounded-control px-3 text-sm font-semibold text-mist transition hover:text-white"
            >
              На сайт
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex h-10 items-center rounded-control bg-accent px-4 text-sm font-bold text-white transition hover:bg-accent-strong"
            >
              Вийти
            </button>
          </div>
        </Container>
      </header>
      {error ? (
        <Container className="pt-4">
          <p className="text-sm text-heart">{error}</p>
        </Container>
      ) : null}
      <Outlet />
    </div>
  )
}
