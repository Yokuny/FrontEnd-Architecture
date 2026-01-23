const capitalizeFirstLetter = (text) => {
  return `${text?.charAt(0)?.toLowerCase()}${text?.slice(1)}`;
};

export function generateCodeFieldName(description) {
  return capitalizeFirstLetter(
    description
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9A-Z]/g, "")
  )
}
