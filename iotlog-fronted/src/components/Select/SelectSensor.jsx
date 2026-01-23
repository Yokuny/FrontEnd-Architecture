import React from "react";
import { injectIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectSensor = ({ onChange, value, intl, isMulti = false, placeholderID = "machine.sensors.placeholder" }) => {
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/sensor`)
      .then((response) => {
        setData(
          response?.data?.map((x) => ({
            value: x.sensorId,
            label: x.sensor,
            id: x.id,
          }))?.sort((a, b) => a?.label?.localeCompare(b?.label))
        );
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Select
        options={data}
        placeholder={intl.formatMessage({
          id: placeholderID,
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isMulti={isMulti}
        isClearable
        menuPosition="fixed"
        noOptionsMessage={() =>
          intl.formatMessage({
            id: "nooptions.message",
          })
        }
      />
    </>
  );
};

export default injectIntl(SelectSensor);
