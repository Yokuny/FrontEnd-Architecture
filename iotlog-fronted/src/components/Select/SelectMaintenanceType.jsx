import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { Fetch } from "../Fetch";

const SelectMaintenanceType = ({
  onChange,
  value,
  placeholderText = "",
  placeholder = "",
  disabled = false,
  idEnterprise = null,
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    if (idEnterprise) {
      getData(idEnterprise);
    } else {
      onChange(undefined);
    }
  }, [idEnterprise]);

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(`/form/cmms/maintenance/${idEnterprise}`)
      .then((response) => {
         const options = [
           {
             value: "empty",
             label: intl.formatMessage({ id: "undefined" })
           },
           ...(response.data?.map((x) => ({
             value: x || intl.formatMessage({ id: "undefined" }),
             label: x || intl.formatMessage({ id: "undefined" }),
           })) || [])
         ];
        setOptions(options?.sort((a, b) => a?.label?.localeCompare(b?.label)));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <Select
      options={options}
      placeholder={placeholderText || intl.formatMessage({
        id: placeholder || "maintenance.type.placeholder",
      })}
      isLoading={isLoading}
      onChange={onChange}
      value={value}
      noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
      isClearable
      menuPosition="fixed"
      isDisabled={disabled}
    />
  );
};

export default SelectMaintenanceType;
