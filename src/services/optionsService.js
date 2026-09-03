import apiIds from '../data/api_ids.json'
//import tracks from '../data/tracks.csv'

export const getFieldOptions = (field) => {

    if (field.optionsSource === 'enums.weather') {
        return apiIds["enums/weather"]?.list ?? []
    }

    if (field.optionsSource === 'enums.damage') {
        return apiIds["enums/damage"]?.list ?? []
    }

    if (field.optionsSource === 'enums.penalties') {
        return apiIds["enums/penalties"]?.list ?? []
    }

    if (field.optionsSource === 'vehicle_classes') {
        return apiIds["vehicle_classes"]?.list ?? []
    }

    if (field.optionsSource === 'vehicles') {
        return apiIds["vehicles"]?.list ?? []
    }

    if (field.optionsSource === 'tracks') {
        return apiIds["tracks"]?.list ?? []
    }

    return []
}