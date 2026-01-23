import React from "react";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectSensorByEnterprise = ({
  idEnterprise,
  onChange,
  value,
  isMulti = false,
  isClearable = false,
  className = "",
  placeholder = "",
  noSignal = false,
  menuPosition = "fixed",
  isOnlyValue = false,
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    if (idEnterprise) {
      getData();
    } else {
      onChange(undefined);
    }
  }, [idEnterprise]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/sensor?idEnterprise=${idEnterprise}`)
      .then((response) => {
        setData(
          response?.data
            ?.map((x) => {
              return noSignal
                ? {
                    value: x.sensorId,
                    label: x.sensor,
                    id: x.id,
                  }
                : {
                    value: x.sensorId,
                    label: x.sensor,
                    signals: x.signals,
                    id: x.id,
                  };
            })
            ?.sort((a, b) => a?.label?.localeCompare(b?.label))
        );
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const optionValue = isOnlyValue
    ? data?.find((option) => option.value === value)
    : value;

  return (
    <>
      <Select
        className={className}
        options={data}
        placeholder={intl.formatMessage({
          id: placeholder || "machine.sensors.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={optionValue}
        isMulti={isMulti}
        isClearable={isClearable}
        menuPosition={menuPosition}
        noOptionsMessage={() =>
          intl.formatMessage({
            id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
          })
        }
      />
    </>
  );
};

export default SelectSensorByEnterprise;
