import React from "react";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectConsumptionGroup = ({
  onChange,
  value,
  idEnterprise,
  oneBlocked = false,
  isDisabled = false,
}) => {
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();
  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (idEnterprise) {
        getData(idEnterprise);
    } else onChange(undefined);
  }, [idEnterprise]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/group-consumption?idEnterprise=${idEnterprise}`)
      .then((response) => {
        if (response.data?.length) {
          let dataTake = response?.data?.map((x) => ({
            value: x.id,
            label: `${x.id} - ${x.description ? x.description : ''}`,
          }));
          setData(dataTake?.sort((a,b) => a.label?.localeCompare(b?.label)));
          const selectOne = !!oneBlocked && response.data?.length == 1;
          if (selectOne && !value) {
            onChange(dataTake[0]);
          }
        }
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
          id: "operation.consumptiongroup.placeholder",
        })}
        noOptionsMessage={() =>
          intl.formatMessage({
            id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
          })
        }
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isDisabled={(!!oneBlocked && data?.length == 1) || isDisabled}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectConsumptionGroup;
