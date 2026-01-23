import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch from "../Fetch/Fetch";

const SelectUsers = ({
  idEnterprise,
  onChange,
  value,
  isDisabled = false,
  isClearable = false,
  isMulti = false,
  placeholder = "select.users.placeholder",
  className = "",
  isMoreDetails = false,
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (idEnterprise) {
      getData(idEnterprise);
    } else onChange(undefined);
  }, [idEnterprise]);

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(
      `/user/list/enterprise${isMoreDetails ? "/details" : ""
      }?id=${idEnterprise}`
    )
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) =>
    isMoreDetails
      ? { value: x.id, label: x.name, email: x.email, language: x.language }
      : { value: x.id, label: x.name }
  )?.sort((a, b) => a?.label?.localeCompare(b?.label));

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
            id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
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
export default SelectUsers;
