const BASE_URL = 'https://api-colombia.com/api/v1'

async function request(path, signal) {
  const res = await fetch(`${BASE_URL}${path}`, { signal })
  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}: no se pudo cargar la información.`)
  }
  return res.json()
}

export const getDepartments = (signal) => request('/Department', signal)

export const getDepartmentCities = (id, signal) =>
  request(`/Department/${id}/cities`, signal)
