import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { Fetch } from "../../../components";

const SelectFolder = ({ onChange, value, idEnterprise, isMulti = false }) => {
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();
  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (idEnterprise) {
        getData(idEnterprise);
    } else onChange(undefined);
  }, [idEnterprise]);


  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(`/dashboard/list/onlyfolder?idEnterprise=${idEnterprise}`)
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
    label: x.description,
  }))?.sort((a,b) => a.label?.localeCompare(b?.label));

  return (
    <>
      <Select
        options={options}
        noOptionsMessage={() =>
          intl.formatMessage({
            id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
          })
        }
        placeholder={intl.formatMessage({
          id: "folder",
        })}
        isClearable
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isMulti={isMulti}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectFolder;
