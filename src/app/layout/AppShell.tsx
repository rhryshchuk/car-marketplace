import { useState } from 'react'
import { Car, Menu, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Container } from '@/shared/ui/Container'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow ${
    isActive
      ? 'text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-accent'
      : 'text-mist hover:text-white'
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
              className="inline-flex size-11 items-center justify-center rounded-control border border-white/15 text-white transition hover:border-white/30 hover:bg-white/5 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuLocation(menuOpen ? null : here)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="sr-only">{menuOpen ? 'Закрити меню' : 'Відкрити меню'}</span>
            </button>
          </div>
        </Container>

        <div
          id="mobile-nav"
          className={`menu-panel grid lg:hidden ${menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <nav className="border-t border-white/10 bg-ink" aria-label="Мобільне" inert={!menuOpen}>
              <Container className="flex flex-col gap-1 py-3">
                <NavLink to="/" end onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold transition hover:bg-white/5">
                  Головна
                </NavLink>
                <NavLink to="/catalog" onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold transition hover:bg-white/5">
                  Каталог
                </NavLink>
                <NavLink to="/favorites" onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold transition hover:bg-white/5">
                  Обране
                </NavLink>
                <NavLink to="/contacts" onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold transition hover:bg-white/5">
                  Контакти
                </NavLink>
                <NavLink to="/about" onClick={closeMenu} className="rounded-control px-3 py-3 text-base font-semibold transition hover:bg-white/5">
                  Про компанію
                </NavLink>
              </Container>
            </nav>
          </div>
        </div>
      </header>

      <main id="content" key={location.pathname} className="page-enter flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-ink">
        <Container className="py-12">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
            <div>
              <Link to="/" className="text-lg font-extrabold tracking-tight">
                AUTO <span className="text-glow">MARKET</span>
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-6 text-mist">
                Автомобілі зі США в каталозі компанії. Ціни в USD, пробіг у кілометрах.
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-semibold text-mist" aria-label="Нижнє меню">
              <Link to="/" className="transition hover:text-white">
                Головна
              </Link>
              <Link to="/catalog" className="transition hover:text-white">
                Каталог
              </Link>
              <Link to="/favorites" className="transition hover:text-white">
                Обране
              </Link>
              <Link to="/contacts" className="transition hover:text-white">
                Контакти
              </Link>
              <Link to="/about" className="transition hover:text-white">
                Про компанію
              </Link>
            </nav>
          </div>
          <p className="mt-8 border-t border-white/10 pt-6 text-sm text-mist">
            © {new Date().getFullYear()} AUTO MARKET. Усі права захищені.
          </p>
        </Container>
      </footer>
    </div>
  )
}
