export const getBreakpointItemsGrouped = (size) => {
  if (!size || size <= 1) {
    return { lg: 12, md: 12, xs: 12, sm: 12, xxl: 12 }
  }
  if (size <= 3) {
    return { lg: 4, md: 4, xs: 4, sm: 4, xxl: 4 }
  }
  return { lg: 2, md: 2, xs: 2, sm: 2, xxl: 2 }
}
