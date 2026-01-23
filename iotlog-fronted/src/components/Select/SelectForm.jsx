import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select"
import Fetch from "../Fetch/Fetch";

export const convertFormTOSelect = (x) => ({
  value: x.id,
  label: x.description
})

const SelectForm = ({
  idEnterprise,
  onChange,
  value,
  isDisabled = false,
  isClearable = false,
  isMulti = false,
  placeholder = "form",
  className = "",
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    getData(idEnterprise);
  }, [idEnterprise]);

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(
      `/form/list/all${idEnterprise ? `?idEnterprise=${idEnterprise}` : ""}`
    )
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => convertFormTOSelect(x));

  return (
    <>
      <Select
        options={options}
        placeholder={intl.formatMessage({
          id: placeholder,
        })}
        className={className}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        noOptionsMessage={() =>
          intl.formatMessage({
            id: "nooptions.message",
          })
        }
        isClearable={isClearable}
        isMulti={isMulti}
        menuPosition="fixed"
        isDisabled={isDisabled}
      />
    </>
  );
};
export default SelectForm;
