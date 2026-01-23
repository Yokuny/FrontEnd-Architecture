import React from "react";
import { useIntl } from "react-intl";
import SelectCreatable from "./SelectCreatable";
import Fetch from "../Fetch/Fetch";

const SelectCMMSEquipment = ({
  onChange, value, placeholder, placeholderText = "", isMulti = false,
  isOnlyValue = false,
  idEnterprise = null,
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (idEnterprise) {
      getData(idEnterprise);
    } else {
      onChange(undefined);
    }
  }, [idEnterprise]);

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(`/form/cmms/equipment/${idEnterprise}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.filter(x => x)?.map((x) => ({
    value: x,
    label: x,
  }))
  ?.sort((a, b) => a?.label?.localeCompare(b?.label));



  return (
    <React.Fragment>
      <SelectCreatable
        options={options}
        placeholder={placeholderText || intl.formatMessage({
          id: placeholder || "equipment",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={isOnlyValue
          ? isMulti
            ? value?.map((x) => options?.find((y) => y.value === x))
            : options?.find((x) => x.value === value)
          : value}
        isClearable
        isMulti={isMulti}
        menuPosition="relative"
        noOptionsMessage={() =>
          intl.formatMessage({ id: "equipment.placeholder" })
        }
      />
    </React.Fragment>
  );
};
export default SelectCMMSEquipment;
