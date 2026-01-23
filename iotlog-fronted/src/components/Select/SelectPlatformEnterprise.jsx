import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { Fetch } from "./../Fetch/index";

const SelectPlatformEnterprise = ({
  onChange,
  value,
  idEnterprise,
  isMulti = false,
  placeholderText = "",
  placeholder = "",
  valueIsSimple = false
}) => {
  const intl = useIntl();

  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    if (idEnterprise) {
      getData(idEnterprise);
    } else onChange(undefined);
  }, [idEnterprise]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/platform/enterprise?idEnterprise=${idEnterprise}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => ({
    value: x.id,
    label: `${x.name}${x.acronym ? ` - ${x.acronym}` : ""}`,
  }));

  const valueData = valueIsSimple
  ? options?.find(x => x.value === value)
  : value

  return (
    <>
      <Select
        options={options}
        placeholder={placeholderText || intl.formatMessage({
          id: placeholder || "platforms.select.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={valueData}
        noOptionsMessage={() =>
          intl.formatMessage({
            id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
          })
        }
        isClearable
        isMulti={isMulti}
        menuPosition="fixed"
      />
    </>
  );
};
export default SelectPlatformEnterprise;
