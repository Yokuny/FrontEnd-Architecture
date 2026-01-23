import React from "react";
import { useIntl } from "react-intl";
import SelectCreatable from "./SelectCreatable";
import Fetch from "../Fetch/Fetch";

export default function SelectSignalCreateableByEnterprise({
  idEnterprise,
  sensorId,
  onChange,
  value,
  noOptionsMessage = "nooptions.message",
  placeholder = "",
  sensorNew = false,
}) {
  const intl = useIntl();

  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (idEnterprise && sensorId && !sensorNew) {
      getData();
    } else if (!sensorNew) onChange(undefined);
  }, [idEnterprise, sensorId]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/machine/sensor/signals?id=${idEnterprise}&sensorId=${sensorId}`)
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
    label: `${x.description} (${x.id})`,
    title: x.description,
  }));

  return (
    <React.Fragment>
      <SelectCreatable
        options={options}
        placeholder={intl.formatMessage({
          id: placeholder || "signal.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isClearable
        noOptionsMessage={() =>
          intl.formatMessage({
            id: noOptionsMessage,
          })
        }
        menuPosition="fixed"
      />
    </React.Fragment>
  );
};
