import { getInputProps } from '../services/inputService'
import { getConfigValue, updateConfigValue } from '../services/configService'
import { translate } from "../services/translate"
import { getFieldOptions } from "../services/optionsService"
import { getValidationValue } from '../services/validationService'
import { isFieldDisabled } from '../services/fieldDisplay'

export function ConfigInput({field, config, setConfig, language, optionsBySource, optionsLoading}) {

    const value = getConfigValue(config, field)
    const min = getValidationValue(field.validation, 'min', config)
    const max = getValidationValue(field.validation, 'max', config)
    const inputProps = getInputProps(field, value, (newValue) => {
        setConfig(prev =>
            updateConfigValue(prev, field, newValue, optionsBySource)
        )
    })
    const options = getFieldOptions(field, optionsBySource)

    function getOptionLabel(field, option, language) {
        if (field.name === 'TrackId') {
            const dlcLabel = option.isDlc
            ? ` · DLC: ${option.dlc}`
            : ''

            const gridSizeLabel = Number.isInteger(option.gridSize)
            ? ` (${option.gridSize})`
            : ''

            return `${option.track} – ${option.variant}${dlcLabel}${gridSizeLabel}`
        }

        if (field.name === 'VehicleModelId') {
            const dlcLabel = option.isDlc
            ? ` · DLC: ${option.dlc}`
            : ''

            return `${option.cars} – ${option.class}${dlcLabel}`
        }

        return translate(`${field.optionsSource}.${option.name}.label`, language)    
    }

    const disabled = field.access === 'ReadOnly' || isFieldDisabled(field, config)

    return (
        <label
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                marginBottom: '0.75rem'
            }}
        >

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <span>
                    {translate(`${field.translationKey}.label`, language)}
                </span>

                {field.inputType === 'select' ? (
                    // Wenn es ein select-Feld ist
                    <select
                        style={{ marginLeft: 'auto' }}
                        {...inputProps}
                        value={value ?? ''}
                        disabled={disabled || optionsLoading}
                        >
                        {optionsLoading ? (
                            <option>Optionen werden geladen …</option>
                        ) : (
                            options.map(option => (
                            <option
                                key={option.value ?? option.id}
                                value={option.value ?? option.id}
                            >
                                {getOptionLabel(field, option, language)}
                            </option>
                            ))
                        )}
                    </select>
                ) : (
                    // Wenn es alles andere ist
                    <input
                        style={{marginLeft: 'auto'}}
                        type={field.inputType}
                        {...inputProps}
                        readOnly={field.access === 'ReadOnly'}
                        disabled={disabled}
                        min={min}
                        max={max}
                        step={field.validation?.step}
                    />
                )}
            </div>

            <small style={{opacity: 0.7}}>
                {translate(`${field.translationKey}.description`, language)}
            </small>

        </label>
    )
}