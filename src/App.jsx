import { Header } from './components/Header'
import { ConfigTabs } from './components/ConfigTabs'
import { Preview } from './components/Preview'
import { useEffect, useMemo, useState } from 'react'
import { createServerConfigFromTemplate, defaultSettings } from './services/configTemplateService'
import { fetchFieldDefinitions, fetchFieldOptions, fetchTracks, fetchCars } from './services/apiService'
import { createAllFields } from './services/fieldMapper'
import './App.css'

function App() {
  const [language, setLanguage] = useState('de')
  const [activeTab, setActiveTab] = useState('general')

  // State für die Optionsdaten, die von der API geladen werden
  const [optionsBySource, setOptionsBySource] = useState({})
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsError, setOptionsError] = useState(null)

  const [fieldDefinitions, setFieldDefinitions] = useState({})

  useEffect(() => {
    const sources = [
      'enums.weather',
      'enums.damage',
      'enums.damage_scale',
      'enums.penalties',
      'vehicle_classes',
    ]

    async function loadOptions() {
      try {
        const [entries, definitions, tracks, vehicles] = await Promise.all([
          Promise.all(
            sources.map(async (source) => {
              const options = await fetchFieldOptions(source)
              return [source, options]
            })
          ),
          fetchFieldDefinitions(),
          fetchTracks(),
          fetchCars(),
        ])

        setOptionsBySource({...Object.fromEntries(entries), tracks, vehicles})
        setFieldDefinitions(definitions)
      } catch (error) {
        setOptionsError(error.message)
      } finally {
        setOptionsLoading(false)
      }
    }

    loadOptions()
  }, [])
  const allFields = useMemo(() => {
    return createAllFields(fieldDefinitions)
  }, [fieldDefinitions])

  // Standard Konfiguration für den Server, die in der Vorschau angezeigt wird. 
  // Später sollen die Werte aus einer hochgeladenen Datei überschrieben und von den Eingabefeldern geändert werden.
  const [config, setConfig] = useState(defaultSettings)
  const preview = createServerConfigFromTemplate(config)

  return (
    <main className="app">
      <Header language={language} setLanguage={setLanguage}/>
      {/* Anzeige von Lade- und Fehlerzuständen für die Optionsdaten */}
      {optionsError && (
        <p role="alert">
          Backend-Daten konnten nicht geladen werden: {optionsError}
        </p>
      )}
      {/* Konfigurationsbereich */}
      <div className="workspace">
        <ConfigTabs activeTab={activeTab} setActiveTab={setActiveTab} language={language} config={config} setConfig={setConfig} optionsBySource={optionsBySource} optionsLoading={optionsLoading} allFields={allFields}/>
        <Preview preview={preview} language={language}/>
      </div>
    </main>
  )
}

export default App