import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { Fetch } from "./../Fetch/index";

const SelectContractAssetEnterprise = ({
  onChange,
  value,
  idEnterprise,
  isMulti = false,
  placeholder = "",
}) => {
  const intl = useIntl();

  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    if (idEnterprise) {
        getData(idEnterprise);
    } else onChange(undefined);
  }, [idEnterprise]);

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(`/contract-asset/available-by-enterprise?idEnterprise=${idEnterprise}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => ({ value: x.id, label: x.name }));

  return (
    <>
      <Select
        options={options}
        placeholder={intl.formatMessage({
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
export default SelectContractAssetEnterprise;
