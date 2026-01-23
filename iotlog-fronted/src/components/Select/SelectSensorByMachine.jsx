import React from "react";
import { useIntl } from "react-intl";
import SelectCreatable from "./SelectCreatable";
import Fetch from "../Fetch/Fetch";

const SelectSensorByMachine = ({
  idMachine, onChange, value, placeholder, placeholderText = "", isMulti = false,
  isOnlyValue = false,
  idsNotAllowed = [],
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
    Fetch.get(`/machine/sensors?id=${idMachine}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.filter(x => x)?.map((x) => ({
    value: x.sensorId,
    label: `${x.sensor} (${x.sensorId})`,
    title: x.sensor,
    id: x.id,
    type: x.type
  }))
  ?.filter(x => !idsNotAllowed?.includes(x.value?.toLowerCase()))
  ?.sort((a, b) => a?.label?.localeCompare(b?.label));



  return (
    <React.Fragment>
      <SelectCreatable
        options={options}
        placeholder={placeholderText || intl.formatMessage({
          id: placeholder || "sensor.placeholder",
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
        menuPosition="fixed"
        noOptionsMessage={() =>
          intl.formatMessage({
            id: !idMachine ? "select.first.machine" : "nooptions.message",
          })
        }
      />
    </React.Fragment>
  );
};
export default SelectSensorByMachine;
