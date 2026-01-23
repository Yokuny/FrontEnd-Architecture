import React from "react";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectMaintenancePlan = ({ onChange, value, placeholder, idEnterprise = "", isMulti = false, isClearable = false}) => {
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();
  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (idEnterprise) {
      getData(idEnterprise);
    } else onChange(undefined);
  }, [idEnterprise]);

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(`/maintenanceplan/list/all?idEnterprise=${idEnterprise}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => ({
    value: x.id,
    label: x.description,
  }))?.sort((a, b) => a?.label?.localeCompare(b?.label));

  return (
    <>
      <Select
        options={options}
        placeholder={placeholder ? placeholder : (isMulti ? intl.formatMessage({
          id: "maintenanceplan.placeholder",
        }) :
        intl.formatMessage({
          id: "maintenanceplan.single.placeholder",
        }))}
        noOptionsMessage={() =>
          intl.formatMessage({
            id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
          })
        }
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isMulti={isMulti}
        isClearable={isClearable}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectMaintenancePlan;
