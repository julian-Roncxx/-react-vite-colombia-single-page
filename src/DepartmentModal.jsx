import { useEffect, useRef, useState } from 'react'
import { getDepartmentCities } from './api'

const nf = new Intl.NumberFormat('es-CO')

export default function DepartmentModal({ department, onClose }) {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const closeRef = useRef(null)

  // Cargar ciudades cada vez que se abre un departamento distinto.
  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      setCities([])
      try {
        const data = await getDepartmentCities(department.id, controller.signal)
        setCities([...data].sort((a, b) => a.name.localeCompare(b.name, 'es')))
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [department.id])

  // Cerrar con Escape, bloquear scroll del fondo y enfocar el botón de cierre.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__head">
          <h2 id="modal-title">{department.name}</h2>
          <button ref={closeRef} className="btn-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <div className="modal__body">
          {department.description && <p className="desc">{department.description}</p>}

          <dl className="facts">
            <div>
              <dt>Población</dt>
              <dd>{department.population ? nf.format(department.population) : '—'}</dd>
            </div>
            <div>
              <dt>Superficie</dt>
              <dd>{department.surface ? `${nf.format(department.surface)} km²` : '—'}</dd>
            </div>
            <div>
              <dt>Prefijo telefónico</dt>
              <dd>{department.phonePrefix || '—'}</dd>
            </div>
            <div>
              <dt>Municipios</dt>
              <dd>{department.municipalities ?? '—'}</dd>
            </div>
          </dl>

          <h3>Ciudades{!loading && !error ? ` (${cities.length})` : ''}</h3>

          {loading && <p className="status" role="status">Cargando ciudades…</p>}
          {error && <p className="status status--error" role="alert">{error}</p>}
          {!loading && !error && cities.length === 0 && (
            <p className="status">Este departamento no tiene ciudades registradas.</p>
          )}
          {!loading && !error && cities.length > 0 && (
            <ul className="cities">
              {cities.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
