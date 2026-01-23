import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch, { useFetch } from "../Fetch/Fetch";

const SelectProductService = ({ idEnterprise, onChange, value }) => {
  const intl = useIntl()

  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    if (idEnterprise) {
        getData(idEnterprise);
    } else onChange(undefined);
  }, [idEnterprise]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/machine/enterprise?idEnterprise=${idEnterprise}`)
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
          label: x.name,
          idEnterprise: x.idEnterprise,
          image: x.image ? x.image?.url : "",
        }));

  return (
    <>
      <Select
        options={options}
        placeholder={intl.formatMessage({
          id: "support.product.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        noOptionsMessage={() => intl.formatMessage({ id: !idEnterprise ? "select.first.enterprise" : "nooptions.message" })}
      />
    </>
  );
};
export default SelectProductService;
