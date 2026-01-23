import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch from "../Fetch/Fetch";

const SelectModelMachine = ({
  onChange,
  value,
  idEnterprise,
  isMulti = false,
  placeholder = "",
  menuPosition = "fixed",
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useLayoutEffect(() => {
    if (idEnterprise) {
      getData();
    } else onChange(undefined);
  }, [idEnterprise]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/modelmachine?idEnterprise=${idEnterprise}`)
      .then((response) => {
        setData(response.data?.length ? response.data : []);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };
  const options = data?.map((x) => ({
    value: x.id,
    label: x.description,
    typeMachine: x.typeMachine,
  }));

  return (
    <>
      <Select
        options={options}
        placeholder={intl.formatMessage({
          id: placeholder || "model.machine.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        isClearable
        menuPosition={menuPosition}
        isMulti={isMulti}
      />
    </>
  );
};
export default SelectModelMachine;
