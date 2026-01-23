import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { useFetchSupport } from "../Fetch/FetchSupport";

const SelectTypeProblem = ({ idEnterprise, onChange, value, isClearable = false, isMulti = false }) => {
  const {
    isLoading,
    reFetch,
    data,
  } = useFetchSupport(`/typeproblem/find/enterprise?id=${idEnterprise}`, {
    method: "get",
  });
  const intl = useIntl();

  React.useEffect(() => {
    reFetch();
  }, [idEnterprise]);

  const options = data?.map((x) => ({ value: x.id, label: x.description }));

  return (
    <React.Fragment>
      <Select
        options={options}
        placeholder={intl.formatMessage({
          id: "support.typeProblem.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        noOptionsMessage={() => intl.formatMessage({ id: !idEnterprise ? "select.first.enterprise" : "nooptions.message" })}
        isClearable={isClearable}
        isMulti={isMulti}
        menuPosition="fixed"
      />
    </React.Fragment>
  );
};
export default SelectTypeProblem;
