import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { Fetch } from "./../Fetch/index";

const SelectOperationsContract = ({
  onChange,
  value,
  idEnterprise,
  idMachine,
  isMulti = false,
  placeholder = "",
  placeholderText = ""
}) => {
  const intl = useIntl();

  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    if (idEnterprise && idMachine) {
        getData(idEnterprise, idMachine);
    } else onChange(undefined);
  }, [idEnterprise, idMachine]);

  const getData = (idEnterprise, idMachine) => {
    setIsLoading(true);
    Fetch.get(`/contract-asset/operations-by-asset?idEnterprise=${idEnterprise}&idMachine=${idMachine}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => ({ value: x.idOperation, label: `${x.idOperation} - ${x.name}` }));

  return (
    <>
      <Select
        options={options}
        placeholder={placeholderText || intl.formatMessage({
          id: placeholder || "machine.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        noOptionsMessage={() =>
          intl.formatMessage({
            id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
          })
        }
        isClearable
        isMulti={isMulti}
        menuPosition="fixed"
      />
    </>
  );
};
export default SelectOperationsContract;
