import React from "react";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import { Select } from "@paljs/ui";

const SelectSensorByAssets = ({
  idAssets, onChange, value, placeholder, placeholderText = "", isMulti = false,
  isOnlyValue = false,
  idsNotAllowed = [],
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  const lastRefIdSensors = React.useRef();

  React.useEffect(() => {
    if (idAssets?.length) {
      getData(idAssets);
    } else onChange(undefined);
  }, [idAssets]);

  const getData = (idAssets) => {
    const filtering = idAssets.join(",")
    if (lastRefIdSensors.current === filtering) return;
    setIsLoading(true);
    Fetch.get(`/machine/sensors?id=${filtering}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
        lastRefIdSensors.current = filtering;
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
    <>
      <Select
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
            id: !idAssets ? "select.first.machine" : "nooptions.message",
          })
        }
      />
    </>
  );
};
export default SelectSensorByAssets;
