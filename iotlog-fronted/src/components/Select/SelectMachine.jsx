import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { Fetch } from "../Fetch";

const SelectMachine = ({
  onChange,
  value,
  placeholderText = "",
  placeholder = "",
  disabled = false,
  isMulti = false,
  filterQuery = "",
  valueIsSimple = false,
  oneSelected = false
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [options, setOptions] = React.useState();

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/machine?${filterQuery}`)
      .then((response) => {
        const options = response.data?.map((x) => ({
          value: x.id,
          label: `${x.name} (${x.id})`,
        })) || []
        setOptions(options?.sort((a, b) => a?.label?.localeCompare(b?.label)));
        const hasOneData = oneSelected && options?.length === 1;
        setIsLoading(false);
        if (hasOneData) {
          onChange(options[0])
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const valueData = valueIsSimple
  ? options?.find(x => x.value === value)
  : value

  const hasOneData = oneSelected && options?.length === 1;

  return (
    <>
      <Select
        options={options}
        placeholder={placeholderText || intl.formatMessage({
          id: placeholder || "machine.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={valueData}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        isClearable={!hasOneData}
        menuPosition="fixed"
        isMulti={isMulti}
        isDisabled={hasOneData || disabled}
      />
    </>
  );
};
export default SelectMachine;
