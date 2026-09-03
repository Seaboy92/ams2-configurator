import apiIds from '/src/data/api_ids.json'
import { getInputProps } from '../services/inputService'
import { getConfigValue, updateConfigValue } from '../services/configService'
import { translate } from "../services/translate"
import { getFieldOptions } from "../services/optionsService"
import { getValidationValue } from '../services/validationService'

export function ConfigInput({field, config, setConfig, language}) {

    const value = getConfigValue(config, field)
    const min = getValidationValue(field.validation, 'min', config)
    const max = getValidationValue(field.validation, 'max', config)
    const inputProps = getInputProps(field, value, (newValue) => {
        setConfig(prev =>
            updateConfigValue(prev, field, newValue)
        )
    })

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
                    >
                        {getFieldOptions(field).map(option => (
                            <option
                                key={option.value ?? option.id}
                                value={option.value ?? option.id}
                            >   
                                {translate(`${field.optionsSource}.${option.name}.label`, language)}
                            </option>
                        ))}
                    </select>
                ) : (
                    // Wenn es alles andere ist
                    <input
                        style={{marginLeft: 'auto'}}
                        type={field.inputType}
                        {...inputProps}
                        readOnly={field.access === 'ReadOnly'}
                        disabled={field.access === 'ReadOnly'}
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