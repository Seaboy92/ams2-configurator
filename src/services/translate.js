import translations from '/src/data/translations.json'


// Funktion zum übersetzen der Feldnamen in Übersetzungsschlüssel
export function buildFieldLabelKey(field) {
    if(!field.translationKey?.startsWith("cfg.")){
        return `attributes.session.${field.name}.label`
    }
    return field.translationKey
}

export function buildFieldDescriptionKey(field) {
    if(!field.translationKey?.startsWith("cfg.")){
        return `attributes.session.${field.name}.description`
    }
    return field.descriptionKey
}

// Funktion für die Übersetzung Deutsch/ Englisch 
export function translate(key, language = 'de') {
    return translations.text[key]?.[language] ?? key
}