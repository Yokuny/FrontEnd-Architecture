export const getIsShowBarge = (description) => ["PUSHER","EMPURRADOR"].includes(description?.toUpperCase())
export const getIsBarge = (description) => ["BARGE","BARCAÇA", "BARCACA"].includes(description?.toUpperCase())
