
export const isDockingHeader = function (fasHeaderType) {
    return [
        "Docagem - Normal",
        "Docagem - Emergencial",
        "Docagem - Regularizacao"
    ].includes(fasHeaderType)
}

export const isRegularizationHeader = function (fasHeaderType) {
    return [
        "Docagem - Regularizacao",
        "Regularizacao"
    ].includes(fasHeaderType)
}

export const isDockingRegularizationHeader = function (fasHeaderType) {
    return isDockingHeader(fasHeaderType) && isRegularizationHeader(fasHeaderType);
}   