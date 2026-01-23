import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { CONDITIONS } from "../../constants";

const SelectCondition = ({
  onChange,
  value,
  isDisabled = false,
  placeholderID = "condition.placeholder",
  isProcessValue = false,
  className = ""
}) => {
  const intl = useIntl();

  const options = [
    {
      value: CONDITIONS.LESS_THAN,
      label: intl.formatMessage({ id: "conditions.lessthan" }),
    },
    {
      value: CONDITIONS.LESS_THAN_OR_EQUAL,
      label: intl.formatMessage({ id: "conditions.lessthanorequal" }),
    },
    {
      value: CONDITIONS.EQUAL,
      label: intl.formatMessage({ id: "conditions.equal" }),
    },
    {
      value: CONDITIONS.GREAT_THAN,
      label: intl.formatMessage({ id: "conditions.greatthan" }),
    },
    {
      value: CONDITIONS.GREAT_THAN_OR_EQUAL,
      label: intl.formatMessage({ id: "conditions.greaterthanorequal" }),
    },
    {
      value: CONDITIONS.BETWEEN,
      label: intl.formatMessage({ id: "conditions.between" }),
    },
    {
      value: CONDITIONS.DIFFERENT,
      label: intl.formatMessage({ id: "conditions.different" }),
    },
  ];

  return (
    <>
      <Select
      className={className}
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
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

export default SelectCondition;
