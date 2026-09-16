import { translate } from "../services/translate"
import { downloadServerConfig } from '../services/downloadService'

export function Preview({ preview, language }) {
    return (
        <aside className="preview-panel">
            {/* Vorschaubereich */}
            <div className="preview-header">
                <h2>{translate('ui.headingRight', language)}</h2>
                <button className="action-button" type="button" onClick={() => downloadServerConfig(preview)}>{translate('ui.downloade', language)}</button>
            </div>
            <pre id="server-config-preview">{preview}</pre>
        </aside>
    )
}