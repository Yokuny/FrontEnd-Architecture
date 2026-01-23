import { useStore } from "react-redux";
import { floatToStringBrazilian } from "../Utils";

export const useFormatDecimal = () => {
  const { getState } = useStore();

  const format = (value, decimals = 2) => {
    return getState()?.settings?.locale === "pt"
    ? floatToStringBrazilian(value, decimals)
    : value
  }

  return {
    format
  }
}
