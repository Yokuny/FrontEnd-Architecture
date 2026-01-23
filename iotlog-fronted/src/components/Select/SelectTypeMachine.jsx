import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { TYPE_MACHINE } from "../../constants";

const SelectTypeMachine = ({ onChange, value, placeholderID = "" }) => {
  const intl = useIntl();
  const options = [
    {
      value: TYPE_MACHINE.SHIP,
      label: intl.formatMessage({ id: "vessel" })
    },
    {
      value: TYPE_MACHINE.TRUCK,
      label: intl.formatMessage({ id: 'truck' })
    },
    {
      value: TYPE_MACHINE.INDUSTRIAL,
      label: intl.formatMessage({ id: 'industrial.machine' })
    },
  ];

  return (
    <>
      <Select
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholderID || "type.machine",
        })}
        onChange={onChange}
        value={options?.find(x => x.value === value)}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectTypeMachine;
