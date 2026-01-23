export const getValueConsume = (value, unit) => {
  return unit?.toUpperCase() === "L" ? value : value / 1000
}
