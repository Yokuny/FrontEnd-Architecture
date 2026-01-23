import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch from "../Fetch/Fetch";

const SelectAlertType = ({ onChange, value, className, placeholderId = "" }) => {
  const intl = useIntl()
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/alerttype/list`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => ({ value: x.id, label: x.description, type: x.type }));

  return (
    <>
      <Select
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholderId || "scale.alert.type",
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

export default SelectAlertType;
