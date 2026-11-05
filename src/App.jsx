import { useMemo, useState } from 'react'
import { useDepartments } from './useDepartments'
import DepartmentModal from './DepartmentModal'

const normalize = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export default function App() {
  const { departments, loading, error, retry } = useDepartments()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  // Filtrado reactivo: se recalcula en cada pulsación, sin importar tildes.
  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return departments.filter((d) => normalize(d.name).includes(q))
  }, [departments, query])

  return (
    <main className="page">
      <header className="hero">
        <h1>Explora Colombia</h1>
        <p>Busca un departamento y descubre sus ciudades y datos clave.</p>
        <input
          type="search"
          className="search"
          placeholder="Filtrar departamentos…"
          aria-label="Filtrar departamentos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      {loading && <p className="status" role="status">Cargando departamentos…</p>}

      {error && (
        <div className="status status--error" role="alert">
          <p>{error}</p>
          <button className="btn" onClick={retry}>Reintentar</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="count">
            {filtered.length} de {departments.length} departamentos
          </p>

          {filtered.length === 0 ? (
            <p className="status">No hay departamentos que coincidan con “{query}”.</p>
          ) : (
            <ul className="grid">
              {filtered.map((d) => (
                <li key={d.id}>
                  <button className="card" onClick={() => setSelected(d)}>
                    <span className="card__name">{d.name}</span>
                    <span className="card__meta">
                      {d.population
                        ? `${new Intl.NumberFormat('es-CO').format(d.population)} hab.`
                        : 'Ver detalle'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {selected && (
        <DepartmentModal department={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  )
}
