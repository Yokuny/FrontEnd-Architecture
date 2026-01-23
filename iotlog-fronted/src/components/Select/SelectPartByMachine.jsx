import React from "react";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectPartByMachine = ({
  onChange,
  value,
  idMachine,
  filterItems,
  placeholder = "machine.parts.placeholder",
  isClearable = false,
  isMulti = false,
  filtered = [],
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (idMachine) {
      getData();
    } else onChange(undefined);
  }, [idMachine]);

  const getData = () => {
    setIsLoading(true);
    const itensQuery = filterItems
      ?.map((x, i) => `notIdPart[]=${x}`)
      ?.join("&");
    Fetch.get(`/machine/parts?id=${idMachine}&${itensQuery || ""}`)
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
    label: `${x.name} (${x.sku})`,
  }));

  const itensFiltered = filtered?.length
    ? options?.filter((x) => !filtered.includes(x.value))
    : options;

  return (
    <>
      <Select
        options={itensFiltered}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholder,
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isClearable={isClearable}
        isMulti={isMulti}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectPartByMachine;
