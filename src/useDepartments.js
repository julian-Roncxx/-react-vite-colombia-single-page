import { useEffect, useState } from 'react'
import { getDepartments } from './api'

// Hook: carga la lista de departamentos con estados de loading y error.
export function useDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getDepartments(controller.signal)
        setDepartments([...data].sort((a, b) => a.name.localeCompare(b.name, 'es')))
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [attempt])

  return { departments, loading, error, retry: () => setAttempt((n) => n + 1) }
}
