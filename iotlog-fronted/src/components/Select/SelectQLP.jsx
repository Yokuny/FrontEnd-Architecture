import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch from "../Fetch/Fetch";

const SelectQLP
  = ({ onChange, value, idEnterprise, isMulti = false, placeholder = "" }) => {
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
      Fetch.get(`/qlp?idEnterprise=${idEnterprise}`)
        .then((response) => {
          setData(response.data?.length ? response.data : []);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    };
    const options = data?.map((x) => {
      let label = `${x.name} - ${x.month}`
      if(x.qt)
        label = `${label} - ${x.qt}`
      return {
        value: x.id,
        label
      }
    })?.sort((a, b) => a?.label?.localeCompare(b?.label));

    return (
      <>
        <Select
          options={options}
          placeholder={intl.formatMessage({
            id: placeholder || "qlp.placeholder",
          })}
          isLoading={isLoading}
          onChange={onChange}
          value={value}
          noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
          isClearable
          menuPosition="fixed"
          isMulti={isMulti}
        />
      </>
    );
  };
export default SelectQLP
  ;
