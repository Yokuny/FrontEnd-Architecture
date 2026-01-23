import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { Fetch } from "./../Fetch/index";

const SelectConsumptionMachine = ({
  onChange,
  value,
  idEnterprise,
  isMulti = false,
  placeholder = "",
  disabled = false,
  isOnlyValue = false,
  returnMachineIdCallback = null,
}) => {
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (idEnterprise) {
      getData();
    }
    else onChange(undefined);
  }, [idEnterprise]);

const getData = () => {
  setIsLoading(true);

  Fetch.get(`/consumption/machines?idEnterprise=${idEnterprise}`)
    .then((res) => {
      setData(res.data);
      setIsLoading(false);
    })
    .catch((e) => {
      setIsLoading(false);
    });
};

const options = data
  ?.map(({ machine }) => ({ value: machine.id, label: machine.name }))
  ?.sort((a, b) => a?.label?.localeCompare(b?.label));

const handleOnChange = (option) => {
  if (returnMachineIdCallback && data && option) {
    const machineId = data.find((machine) => machine.id === option.value).id;

    returnMachineIdCallback(machineId);
  }

  onChange(option);
};

return (
  <Select
    options={options}
    placeholder={intl.formatMessage({
      id: placeholder || "machine.placeholder",
    })}
    isLoading={isLoading}
    onChange={handleOnChange}
    value={isOnlyValue
      ? isMulti
        ? value?.map((x) => options?.find((y) => y.value === x))
        : options?.find((x) => x.value === value)
      : value}
    noOptionsMessage={() =>
      intl.formatMessage({
        id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
      })
    }
    isClearable
    isMulti={isMulti}
    menuPosition="fixed"
    isDisabled={disabled}
  />
);
};

export default SelectConsumptionMachine;
