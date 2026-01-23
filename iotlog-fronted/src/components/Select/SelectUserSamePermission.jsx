import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch from "../Fetch/Fetch";

const SelectUserSamePermission = ({
  onChange,
  value,
  isDisabled = false,
  isClearable = false,
  isMulti = false,
  placeholder = "select.users.placeholder",
  className = "",
  optionsDefault = []
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/user/list/sameenterprises`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = [
    ...(data?.map((x) => ({ value: x.id, label: x.name })) || []),
    ...optionsDefault
  ]?.sort((a, b) => a?.label?.localeCompare(b?.label));

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
export default SelectUserSamePermission;
