
function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Car Marketplace
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Tailwind CSS працює!
        </h1>

        <p className="mt-3 text-base leading-relaxed text-slate-600">
          Наш проєкт готовий до створення власного автомобільного маркетплейсу.
        </p>

        <button
          type="button"
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Перевірка кнопки
        </button>
      </section>
    </main>
  )
}

export default App
