
// Funktion zum Erhalt der Eingabewerte
export const getInputProps = (field, value, onChange) => {
    // Select
    if (field.inputType === 'select') {
        return {
            value: value ?? '',
            onChange: (event) => {
                onChange(Number(event.target.value))
            }
        }
    }    
    // Checkboxen
    if (field.inputType === 'checkbox') {
        return {
            checked: Boolean(value),
            onChange: (event) => {
                onChange(event.target.checked)
            }
        }
    }
    // einfache Zahlenwerte
    if (field.inputType === 'number') {
        return {
            value: value ?? '',
            onChange: (event) => {
                const inputValue = event.target.value

                if (inputValue === '') {
                    onChange('')
                } else {
                    onChange(Number(inputValue))
                }
            },
            onKeyDown: (event) => {
                const allowedControlKeys = [
                    'Backspace',
                    'Delete',
                    'ArrowLeft',
                    'ArrowRight',
                    'Tab',
                    'Home',
                    'End',
                ]

                if (allowedControlKeys.includes(event.key)) {
                    return
                }

                if (
                    event.key.length === 1 &&
                    !/[0-9.,-]/.test(event.key)
                ) {
                    event.preventDefault()
                }
            },
        }
    }
    // alles Andere
    return {
        value: value ?? '',
        onChange: (event) => {
            onChange(event.target.value)
        }
    }
}