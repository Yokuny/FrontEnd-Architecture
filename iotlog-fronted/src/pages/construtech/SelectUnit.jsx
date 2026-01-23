import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { useFetchSupport } from "../../components/Fetch/FetchSupport";

const SelectUnit = ({
  onChange,
  value,
  isClearable = false,
  isMulti = false,
}) => {
  const { isLoading, data } = useFetchSupport(
    `/unit/findmany`,
    {
      method: "get",
    }
  );
  const intl = useIntl();

  const options = data?.map((x) => ({
    value: x.id,
    label: x.name,
    address: x?.address,
    number: x?.number,
    zip: x?.zip,
    district: x.district,
    name: x?.name,
    city: x?.city,
    state: x?.state,
   }));

  return (
    <>
      <Select
        options={options}
        placeholder={intl.formatMessage({
          id: "unit",
        })}
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
      />
    </>
  );
};
export default SelectUnit;
