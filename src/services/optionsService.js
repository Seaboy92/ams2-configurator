//import tracks from '../data/tracks.csv'

export const getFieldOptions = (field, optionsBySource) => {
  return optionsBySource[field.optionsSource] ?? []
}