import React from "react";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectCustomer = ({
  idEnterprise,
  onChange,
  value,
  isMulti = false,
  isClearable = false,
  isDisabled = false,
  className = "",
  placeholder = "",
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
    Fetch.get(`/customer/list/all?idEnterprise=${idEnterprise}`)
      .then((response) => {
        setData(
          response?.data?.map((x) => ({
            value: x.id,
            label: x.name,
          })
        ))
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Select
        className={className}
        options={data?.sort((a, b) => a.label?.localeCompare(b.label))}
        placeholder={intl.formatMessage({
          id: placeholder || "customer",
        })}
        isLoading={isLoading}
        onChange={onChange}
        isDisabled={isDisabled}
        value={value}
        isMulti={isMulti}
        isClearable={isClearable}
        menuPosition="fixed"
        noOptionsMessage={() =>
          intl.formatMessage({
            id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
          })
        }
      />
    </>
  );
};

export default SelectCustomer;
