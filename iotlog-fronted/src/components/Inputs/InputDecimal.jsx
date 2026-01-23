import React from "react";
import { floatToStringNormalize, parseToFloatValid } from "../Utils";

const parseValueSizeDecimal = (value, sizeDecimals) => {
  return sizeDecimals
    ? value.includes(",")
      ? `${value.split(",")[0]},${value.split(",")[1]?.slice(0, sizeDecimals)}`
      : value
    : value;
};

export const InputDecimal = ({
  value,
  onChange,
  placeholder,
  sizeDecimals = 0,
  disabled = false,
  isRequired = false,
  style = {},
  onBlur = () => {},
}) => {
  const [valueInternal, setValueInternal] = React.useState();

  React.useEffect(() => {
    setValueInternal(
      floatToStringNormalize(value)
    );
  }, [value]);

  const onChangeInternal = (value) => {
    if (value === null || value === undefined || value === "") {
      onChange(null);
      return;
    }

    let subtract = 0;
    if (value?.includes("-")) {
      subtract++;
    }
    if (value?.includes(",")) {
      subtract++;
    }
    const hasThereLetterOrCharacterInvalid =
      value?.replace(/\D/g, "")?.length !== value.length - subtract;
    const validSizeDecimals = !!(!sizeDecimals && value?.includes(","));

    if (
      (value.length === 1 && value === ",") ||
      hasThereLetterOrCharacterInvalid ||
      (validSizeDecimals && (value.length === 1 && value === ",")) ||
      value?.split(",")?.length > 2
    ) {
      return;
    }

    if (value?.indexOf("-") > 1) {
      return;
    }

    if (value?.slice(0) === "-" || (sizeDecimals && value?.slice(-1) === ",")) {
      setValueInternal(value);
      return;
    }

    const valueToParse = parseValueSizeDecimal(value, sizeDecimals);

    const parsed = parseToFloatValid(valueToParse);
    onChange(parsed);
    setValueInternal(valueToParse);
  };

  return (
    <>
      <input
        value={valueInternal}
        onChange={(e) => onChangeInternal(e.target.value)}
        type="text"
        disabled={disabled}
        placeholder={placeholder}
        onBlur={onBlur}
        required={isRequired}
        style={style}
      />
    </>
  );
};
