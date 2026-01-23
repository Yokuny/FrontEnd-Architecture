import React from "react";
import { injectIntl } from "react-intl";
import { useFetch } from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectParams = ({ onChange, value, intl, placeholderID = "params.placeholder", isClearable = true }) => {

  const { isLoading, data } = useFetch("/params/list/all");

  const options = data?.map((x) => ({
    value: x.id,
    label: x.description
  }));

  return (
    <>
      <Select
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholderID,
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        menuPosition="fixed"
        isClearable={isClearable}
      />
    </>
  );
};

export default injectIntl(SelectParams);
