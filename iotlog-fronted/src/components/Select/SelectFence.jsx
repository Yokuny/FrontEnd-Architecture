import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch from "../Fetch/Fetch";

const SelectFence = ({
  onChange,
  value,
  placeholder = "",
  className = "",
  idEnterprise = "",
  notId = [],
  isMulti = false,
  filter = "",
  isDisabled = false,
  justValue = false,
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (idEnterprise) {
      getData(idEnterprise, notId);
    } else {
      onChange(undefined);
    }
  }, [idEnterprise]);

  const getData = (idEnterpriseInternal, notIdInternal) => {
    setIsLoading(true);

    const query = []
    if (idEnterpriseInternal) {
      query.push(`idEnterprise=${idEnterpriseInternal}`)
    }
    if (notIdInternal?.length) {
      notIdInternal?.forEach(x => {
        query.push(`notId[]=${x}`)
      })
    }
    if (filter) {
      query.push(`typeFence=${filter}`)
    }

    Fetch.get(
      `geofence/fences?${query.join('&')}`
    )
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => ({
    value: x.id,
    label: x.description,
    color: x.color,
    location: x.location,
  }))?.sort((a, b) => a?.label?.localeCompare(b?.label));

  const valueNormalized = justValue
  ? isMulti
  ? options?.filter((opt) => value?.includes(opt.value))
  : (value ? options?.find((opt) => opt.value === value) : null)
  : value;

  return (
    <>
      <Select
        className={className}
        options={options}
        placeholder={intl.formatMessage({
          id: placeholder || "fence.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={valueNormalized}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        isClearable
        isMulti={isMulti}
        menuPosition="fixed"
        isDisabled={isDisabled}
      />
    </>
  );
};
export default SelectFence;
