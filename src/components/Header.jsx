import { translate } from "../services/translate"

export function Header({language, setLanguage}) {
    return(
        <header className="app-header">
            {/* Überschrift und Wilkommensnachricht */}
            <div style={{width: "75%"}}>
                <h1>{translate('ui.title', language)}</h1>
                <p style={{width: "100%"}}>{translate('ui.welcomtext', language)}</p>
            </div>

            {/* Sprachauswahl */}
            <label className="language-select">
                <span>{translate('ui.language', language)}</span>
                <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                </select>
            </label>
        </header>
    )
}