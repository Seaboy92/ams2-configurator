// Funktion zum herunterladen der Optionsdaten von der API
const API_URL = 'http://localhost:3001/api'

export async function fetchFieldOptions(source) {
  const response = await fetch(
    `${API_URL}/options?source=${encodeURIComponent(source)}`
  )

  if (!response.ok) {
    throw new Error('Optionsdaten konnten nicht geladen werden.')
  }

  return response.json()
}

// Funktion zum herunterladen der Felddefinitionen von der API
export async function fetchFieldDefinitions() {
  const response = await fetch(`${API_URL}/fields`)

  if (!response.ok) {
    throw new Error('Felddefinitionen konnten nicht geladen werden.')
  }

  return response.json()
}