import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { Fetch } from "./../Fetch/index";

const SelectFasPlanner = ({
  onChange,
  value,
  idEnterprise,
  isMulti = false,
  placeholder = "",
  disabled = false,
  isOnlyValue = false,
}) => {
  const intl = useIntl();

  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (idEnterprise) {
      getData(idEnterprise);
    } else {
      onChange(undefined);
    };
  }, [idEnterprise]);

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(`/fas/planner/list?idEnterprise=${idEnterprise}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => ({ value: x.addedById, label: x.addedByName }))
    ?.sort((a, b) => a?.label?.localeCompare(b?.label));

  const handleOnChange = (option) => {
    onChange(option)
  }

  return (
    <Select
      options={options}
      placeholder={intl.formatMessage({
        id: placeholder,
      })}
      isLoading={isLoading}
      onChange={handleOnChange}
      value={isOnlyValue
        ? isMulti
          ? value?.map((x) => options?.find((y) => y.value === x))
          : options?.find((x) => x.value === value)
        : value}
      noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
      isClearable
      isMulti={isMulti}
      menuPosition="fixed"
      isDisabled={disabled}
    />
  );
};

export default SelectFasPlanner;
