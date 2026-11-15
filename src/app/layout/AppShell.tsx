import { useState } from 'react'
import { Car, Menu, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Container } from '@/shared/ui/Container'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow ${
    isActive ? 'text-white' : 'text-mist hover:text-white'
  }`

export function AppShell() {
  const location = useLocation()
  const here = `${location.pathname}${location.hash}`
  const [menuLocation, setMenuLocation] = useState<string | null>(null)
  const menuOpen = menuLocation === here

  const closeMenu = () => setMenuLocation(null)

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-white">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-3"
      >
        До вмісту
      </a>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-white">
              <Car size={20} aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              AUTO <span className="text-glow">MARKET</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Головне">
            <NavLink to="/" end className={navLinkClass}>
              Головна
            </NavLink>
            <NavLink to="/catalog" className={navLinkClass}>
              Каталог
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              Обране
            </NavLink>
            <NavLink to="/contacts" className={navLinkClass}>
              Контакти
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              Про компанію
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/catalog"
              className="hidden h-11 items-center rounded-control bg-accent px-4 text-sm font-bold text-white transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow sm:inline-flex"
            >
              До каталогу
            </Link>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-control border border-white/15 text-white lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuLocation(menuOpen ? null : here)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="sr-only">{menuOpen ? 'Закрити меню' : 'Відкрити меню'}</span>
            </button>
          </div>
        </Container>

        {menuOpen ? (
          <nav id="mobile-nav" className="border-t border-white/10 bg-ink lg:hidden" aria-label="Мобільне">
            <Container className="flex flex-col gap-1 py-3">
              <NavLink to="/" end onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold hover:bg-white/5">
                Головна
              </NavLink>
              <NavLink to="/catalog" onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold hover:bg-white/5">
                Каталог
              </NavLink>
              <NavLink to="/favorites" onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold hover:bg-white/5">
                Обране
              </NavLink>
              <NavLink to="/contacts" onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold hover:bg-white/5">
                Контакти
              </NavLink>
              <NavLink to="/about" onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold hover:bg-white/5">
                Про компанію
              </NavLink>
            </Container>
          </nav>
        ) : null}
      </header>

      <main id="content" key={location.pathname} className="page-enter flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-ink">
        <Container className="flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link to="/" className="text-lg font-extrabold tracking-tight">
              AUTO <span className="text-glow">MARKET</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm leading-6 text-mist">
              Знайди автомобіль, який підходить саме тобі. Твій наступний автомобіль починається тут.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-mist" aria-label="Нижнє меню">
            <Link to="/" className="hover:text-white">
              Головна
            </Link>
            <Link to="/catalog" className="hover:text-white">
              Каталог
            </Link>
            <Link to="/favorites" className="hover:text-white">
              Обране
            </Link>
            <Link to="/contacts" className="hover:text-white">
              Контакти
            </Link>
            <Link to="/about" className="hover:text-white">
              Про компанію
            </Link>
          </nav>
          <p className="text-sm text-mist">© {new Date().getFullYear()} AUTO MARKET. Усі права захищені.</p>
        </Container>
      </footer>
    </div>
  )
}
