import React from "react";
import {  useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { PRIORITY } from "../../constants";

const SelectPriority = ({ onChange, value }) => {
  const intl = useIntl();
  const options = [
    {
      label: intl.formatMessage({ id: "low" }),
      value: PRIORITY.LOW.value,
      color: PRIORITY.LOW.color,
    },
    {
      label: intl.formatMessage({ id: "medium" }),
      value: PRIORITY.MEDIUM.value,
      color: PRIORITY.MEDIUM.color,
    },
    {
      label: intl.formatMessage({ id: "high" }),
      value: PRIORITY.HIGH.value,
      color: PRIORITY.HIGH.color,
    },
  ];

  return (
    <React.Fragment>
      <Select
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: "support.priority.placeholder",
        })}
        onChange={onChange}
        value={value}
      />
    </React.Fragment>
  );
};

export default SelectPriority;
