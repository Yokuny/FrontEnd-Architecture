import React from "react";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectPart = ({
  idEnterprise,
  onChange,
  value,
  isMulti = false,
  placeholder = "machine.parts.placeholder",
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useLayoutEffect(() => {
    if (idEnterprise) {
      getData();
    } else onChange(undefined);
  }, [idEnterprise]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/part?idEnterprise=${idEnterprise}`)
      .then((response) => {
        setData(
          response.data?.map((x) => ({
            label: `${x.name} (${x.sku})`,
            value: x.id,
          }))
        );
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Select
        options={data}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholder,
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isMulti={isMulti}
        menuPosition="fixed"
      />
    </React.Fragment>
  );
};

export default SelectPart;
