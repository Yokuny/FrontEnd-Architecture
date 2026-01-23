import React from "react";
import { injectIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectMaintenancePlanByMachine = ({
  onChange,
  value,
  intl,
  idMachine,
  filterItems,
  isClearable = false,
  isMulti = false,
  filtered = []
}) => {
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (idMachine) {
      getData();
    } else onChange(undefined);
  }, [idMachine]);

  const getData = () => {
    setIsLoading(true);
    const itensQuery = filterItems?.map((x, i) => `notIdMaintenancePlan[]=${x}`)?.join("&")
    Fetch.get(`/machine/maintenanceplans?onlyWear=true&id=${idMachine}&${itensQuery || ''}`)
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
  }));

  const itensFiltered = filtered?.length
  ? options?.filter(x => !filtered.includes(x.value))
  : options

  return (
    <>
      <Select
        options={itensFiltered}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: "maintenanceplan.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isMulti={isMulti}
        menuPosition="fixed"
        isClearable={isClearable}
      />
    </>
  );
};

export default injectIntl(SelectMaintenancePlanByMachine);
