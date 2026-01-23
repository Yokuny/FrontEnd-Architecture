import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";

const scales_petro = require('./scales_petro.json');

const SelectLocalScales = ({
  onChange,
  value,
  isDisabled = false,
  placeholderID = "scale",
  placeholderText = "",
  isProcessValue = false,
  className = ""
}) => {
  const intl = useIntl();

  const options = scales_petro

  return (
    <>
      <Select
        className={className}
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={placeholderText || intl.formatMessage({
          id: placeholderID,
        })}
        onChange={onChange}
        value={isProcessValue ? options.find((x) => x.value == value) : value}
        isDisabled={isDisabled}
        menuPosition="fixed"
        isClearable
      />
    </>
  );
};

export default SelectLocalScales;
