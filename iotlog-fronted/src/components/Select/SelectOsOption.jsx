import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";


const selectOptions = [
    { value: 'Sim', label: 'Sim' },
    { value: 'Não', label: 'Não' },
    { value: 'N/A', label: 'N/A' },
  ];

const SelectOsOption = ({
  onChange,
  value,
  oneBlocked = false,
  isDisabled = false,
}) => {
  const [isLoading, setIsLoading] = React.useState();
  const [internalValue, setInternalValue] = React.useState({});
  const intl = useIntl();

  React.useEffect(() => {
    if (value) {
      setInternalValue(selectOptions.find((x) => x.value === value));
    } else {
      setInternalValue(null);
    }
  }, [value])
  return (
    <>
      <Select
        options={selectOptions}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={"Selecione"}
        isLoading={isLoading}
        onChange={onChange}
        isSearchable
        value={internalValue}
        isDisabled={isDisabled}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectOsOption;
