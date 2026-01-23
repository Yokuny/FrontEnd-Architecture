import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch from "../Fetch/Fetch";

const SelectAlertRule = ({ onChange, idEnterprise, value, className, placeholderId = "" }) => {
  const intl = useIntl()
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (idEnterprise) {
      getData();
    } else onChange(undefined);
  }, [idEnterprise]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/alertrule/list/all?idEnterprise=${idEnterprise}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => ({ value: x.id, label: x.rule?.then?.message }));

  return (
    <>
      <Select
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholderId || "select.alert.rule",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isMulti
        menuPosition="fixed"
        className={className}
      />
    </>
  );
};

export default SelectAlertRule;
