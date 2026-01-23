import React from "react";
import { injectIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { AREA_SAFETY } from "../../constants";

const SelectSafety = ({
  onChange,
  value,
  intl,
  isDisabled = false,
  placeholderID = "safety"
}) => {
  const options = [
    {
      value: AREA_SAFETY.INVADED,
      label: intl.formatMessage({ id: "scanner_found" }),
    },
    {
      value: AREA_SAFETY.WARN_1,
      label: intl.formatMessage({ id: "warn.1" }),
    },
    {
      value: AREA_SAFETY.WARN_2,
      label: intl.formatMessage({ id: "warn.2" }),
    }
  ];

  return (
    <>
      <Select
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholderID,
        })}
        onChange={onChange}
        value={value}
        isDisabled={isDisabled}
        menuPosition="fixed"
      />
    </>
  );
};

export default injectIntl(SelectSafety);
