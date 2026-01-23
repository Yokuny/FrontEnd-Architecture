import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { useFetch } from "../Fetch/Fetch";

const SelectPort = ({ onChange, value, placeholder = "", disabled = false, className = "" }) => {
  const intl = useIntl();

  const { isLoading, data } = useFetch(`/geofence/ports`);

  const options = data?.map((x) => ({
    value: x.id,
    label: `${x.code} - ${x.description}`,
  }));

  return (
    <>
      <Select
        className={className}
        options={options}
        placeholder={intl.formatMessage({
          id: placeholder || "port.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        isClearable
        menuPosition="fixed"
        isDisabled={disabled}
      />
    </>
  );
};
export default SelectPort;
