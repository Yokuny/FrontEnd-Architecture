import React from "react";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectEnterprisePreferred = () => {
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();
  const [value, setValue] = React.useState();

  const intl = useIntl();

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/user/enterprises/preferred`)
      .then((response) => {
        if (response.data?.length) {
          let dataTake = response?.data?.map((x) => ({
            value: x.enterprise.id,
            label: `${x.enterprise.name} - ${x.enterprise.city} ${x.enterprise.state}`,
            preferred: x.preferred,
          }))?.sort((a, b) => a.label.localeCompare(b.label));;
          setData(dataTake);
          const thereIsPreferred = dataTake.find((x) => x.preferred);
          if (thereIsPreferred) {
            setValue(thereIsPreferred);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (newValue) => {
    Fetch.put("/user/enterprise/preferred", {
      idEnterprise: newValue?.value,
    })
      .then((response) => {
        setValue(newValue)
      })
      .catch((e) => {});
  };

  return (
    <>
      <Select
        options={data}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: "machine.idEnterprise.placeholder",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectEnterprisePreferred;
