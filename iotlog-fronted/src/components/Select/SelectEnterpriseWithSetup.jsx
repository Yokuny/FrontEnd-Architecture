import React from "react";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";
import Select from "@paljs/ui/Select";

const SelectEnterpriseWithSetup = ({
  onChange,
  value,
  oneBlocked = false,
  isDisabled = false,
}) => {
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();
  const intl = useIntl();

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/enterprise/withsetup`)
      .then((response) => {
        if (response.data?.length) {
          let dataTake = response?.data?.map((x) => ({
            value: x.id,
            label: `${x.name} - ${x.city} ${x.state}`,
            ssoSetuped: x.ssoSetuped
          }))?.sort((a, b) => a.label?.localeCompare(b.label));
          setData(dataTake);
          const selectOne = !!oneBlocked && response.data?.length == 1;
          if (selectOne && !value) {
            onChange(dataTake[0]);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Select
        options={data}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: "enterprise",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isDisabled={(!!oneBlocked && data?.length == 1) || isDisabled}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectEnterpriseWithSetup;
