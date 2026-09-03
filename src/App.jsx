import { Header } from './components/Header'
import { ConfigTabs } from './components/ConfigTabs'
import { Preview } from './components/Preview'
import { useState } from 'react'
import { createServerConfigFromTemplate, defaultSettings } from './services/configTemplateService'

import './App.css'

function App() {
  const [language, setLanguage] = useState('de')
  const [activeTab, setActiveTab] = useState('general')

  // Standard Konfiguration für den Server, die in der Vorschau angezeigt wird. 
  // Später sollen die Werte aus einer hochgeladenen Datei überschrieben und von den Eingabefeldern geändert werden.
  const [config, setConfig] = useState(defaultSettings)
  const preview = createServerConfigFromTemplate(config)

  return (
    <main className="app">
      <Header language={language} setLanguage={setLanguage}/>
      
      {/* Konfigurationsbereich */}
      <div className="workspace">
        <ConfigTabs activeTab={activeTab} setActiveTab={setActiveTab} language={language} config={config} setConfig={setConfig}/>
        <Preview preview={preview} language={language}/>
      </div>
    </main>
  )
}

export default App