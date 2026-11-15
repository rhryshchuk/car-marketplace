import { Link } from 'react-router-dom'
import { ArrowRight, CarFront, MessageSquare, Search, ShieldCheck } from 'lucide-react'
import { Container } from '@/shared/ui/Container'

const advantages = [
  {
    icon: CarFront,
    title: 'Автомобілі компанії',
    text: 'У каталозі зібрані машини AUTO MARKET, а не оголошення приватних продавців.',
  },
  {
    icon: ShieldCheck,
    title: 'Зрозумілі дані',
    text: 'На сторінці авто вказані ціна в USD, рік, пробіг, паливо і тип кузова.',
  },
  {
    icon: MessageSquare,
    title: 'Заявка на сайті',
    text: 'Питання щодо конкретного авто можна залишити у формі. Зараз форма демонстраційна.',
  },
  {
    icon: Search,
    title: 'Каталог під рукою',
    text: 'Усі доступні авто можна переглянути й зберегти в обране на цьому сайті.',
  },
]

const steps = [
  {
    title: 'Перегляньте каталог',
    text: 'Відкрийте список автомобілів компанії.',
  },
  {
    title: 'Оберіть авто',
    text: 'Порівняйте характеристики на сторінці оголошення.',
  },
  {
    title: 'Напишіть нам',
    text: 'Залиште заявку в контактах або зі сторінки обраного авто.',
  },
  {
    title: 'Обговоріть покупку',
    text: 'Деталі покупки узгоджуються з представником компанії.',
  },
]

export function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=2000&q=80"
          alt="Автомобіль на дорозі"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/90 to-canvas/40" />
        <Container className="relative py-16 sm:py-20 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">Про компанію</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Автомобілі зі США
            <span className="mt-1 block text-glow">в каталозі AUTO MARKET</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-mist sm:text-lg">
            Ми продаємо автомобілі, які компанія пропонує своїм клієнтам. Оберіть машину в каталозі
            та напишіть нам щодо покупки.
          </p>
          <Link
            to="/catalog"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-control bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
          >
            Переглянути каталог
            <ArrowRight size={18} />
          </Link>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">Чим ми займаємось</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Продаж автомобілів зі Сполучених Штатів
            </h2>
            <p className="mt-4 text-base leading-7 text-mist">
              AUTO MARKET — компанія, яка спеціалізується на продажу автомобілів зі США. Усі машини
              в каталозі належать компанії. Додавати оголошення можуть лише адміністратори, коли ця
              можливість з’явиться в системі.
            </p>
            <p className="mt-4 text-base leading-7 text-mist">
              На сайті можна переглянути доступні авто, зберегти їх в обране і залишити заявку.
              Текст цієї сторінки описує напрям роботи і його можна уточнити пізніше.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200"
            alt="BMW 5 Series з каталогу"
            className="aspect-[16/11] w-full rounded-card border border-white/10 object-cover"
          />
        </div>
      </Container>

      <section className="border-y border-white/10 bg-ink/40">
        <Container className="py-16 sm:py-20">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Що є на сайті</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">
            Нижче те, що вже можна зробити на AUTO MARKET. Без обіцянок, яких сайт ще не виконує.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {advantages.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className="rounded-card border border-white/10 bg-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-glow">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-mist">{item.text}</p>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Як це відбувається</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-card border border-white/10 bg-panel p-6">
              <p className="text-sm font-bold tracking-[0.16em] text-glow">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-mist">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <section className="rounded-card border border-white/10 bg-panel px-6 py-10 sm:px-10">
          <h2 className="max-w-xl text-3xl font-extrabold tracking-tight">
            Подивіться авто або напишіть нам
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">
            Каталог показує машини, які є зараз. У контактах можна залишити демонстраційну заявку.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalog"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-control bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong"
            >
              До каталогу
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contacts"
              className="inline-flex h-12 items-center justify-center rounded-control border border-white/15 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Контакти
            </Link>
          </div>
        </section>
      </Container>
    </div>
  )
}
