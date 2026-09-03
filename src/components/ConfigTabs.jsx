import { ConfigInput } from "./ConfigInput"
import { translate } from "../services/translate"
import { allFields } from '../services/fieldMapper'
import { tabs } from '../services/configFields'
import { getFieldOrder, isFieldVisible } from '../services/fieldDisplay'

export function ConfigTabs({activeTab, setActiveTab, language, config, setConfig}) {
    return (
        <section className="settings-panel" aria-label="Einstellungen">
            <div className="preview-header">
                <h2>{translate('ui.headingLeft', language)}</h2>
            </div>
            {/* Konfigurations-Tabs */}
            <nav className="tabs" aria-label="Konfigurationsbereiche">
                {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={activeTab === tab.id ? 'tab is-active' : 'tab'}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                >
                    {translate(tab.label, language)}
                </button>
                ))}
            </nav>
            
            {/* Konfigurations-Elemente */}
            <div className="settings-content">
                {tabs.map((tab) => {
                    const fields = allFields
                    .filter((field) => field.tab === tab.id)
                    .filter((field) => isFieldVisible(field, config))
                    .sort((a, b) => getFieldOrder(a) - getFieldOrder(b))

                    return (
                    <div
                        key={tab.id}
                        style={{
                        display: activeTab === tab.id ? 'block' : 'none'
                        }}
                    >
                        <h3>{translate(tab.label, language)}</h3>

                        {fields.length === 0 ? (
                        <p>Keine Felder für diesen Bereich verfügbar.</p>
                        ) : (
                        <div className="field-grid">
                            {fields.map(field => (
                                <ConfigInput
                                    key={field.name}
                                    field={field}
                                    config={config}
                                    setConfig={setConfig}
                                    language={language}
                                />
                            ))}
                        </div>
                        )}
                    </div>
                    )
                })}
            </div>
        </section>
    )
}
