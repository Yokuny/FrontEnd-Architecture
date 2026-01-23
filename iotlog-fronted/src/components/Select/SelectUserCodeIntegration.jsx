import React from "react";
import { injectIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { useFetch } from "../Fetch/Fetch";

const SelectUserCodeIntegration = ({
  onChange,
  value,
  intl,
  isDisabled = false,
  isClearable = false,
  isMulti = false,
  placeholder = "select.users.placeholder",
  className = ""
}) => {

  const { data, isLoading } = useFetch(`/user/list/codeintegration`)

  const options = data?.map((x) => ({ value: x.id, label: `${x.name} - (${x.codeIntegrationUser || '-'})`, name: x.name, userId: x.userId, codeIntegrationUser: x.codeIntegrationUser }));

  return (
    <>
      <Select
        options={options}
        placeholder={intl.formatMessage({
          id: placeholder,
        })}
        isLoading={isLoading}
        className={className}
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
export default injectIntl(SelectUserCodeIntegration);
