import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { useFetchSupport } from "../Fetch/FetchSupport";

const SelectUserTeam = ({
  idEnterprise,
  onChange,
  value,
  placeholder = "",
  isDisabled = false,
  isClearable = false,
  isMulti = false,
}) => {
  const intl = useIntl();
  const { isLoading, reFetch, data } = useFetchSupport(
    `/userenterprise/enterprise/users?idEnterprise=${idEnterprise}`,
    {
      method: "get",
    }
  );

  React.useEffect(() => {
    reFetch();
  }, [idEnterprise]);

  const options = data
  ?.map((x) => ({ value: x.idUser, label: x.nameUser }))
  ?.sort((a, b) => a?.label?.localeCompare(b?.label));

  return (
    <React.Fragment>
      <Select
        options={options}
        placeholder={
          placeholder ||
          intl.formatMessage({
            id: "select.user.team",
          })
        }
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
    </React.Fragment>
  );
};
export default SelectUserTeam;
