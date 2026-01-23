import React from "react";
import { useIntl } from "react-intl";
import { useFetch } from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectRole = ({ onChange, value, placeholderID = "" }) => {

  const intl = useIntl();
  const { isLoading, data } = useFetch("/role/list/all");

  const options = data?.map((x) => ({
    value: x.id,
    label: x.description,
  }));

  return (
    <React.Fragment>
      <Select
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholderID || "roles.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isMulti
        menuPosition="fixed"
      />
    </React.Fragment>
  );
};

export default SelectRole;
