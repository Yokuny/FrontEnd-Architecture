import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch from "../Fetch/Fetch";

const SelectScale = ({ onChange, value, placeholderID = "" }) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/scale/list`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => ({ value: x.id, label: x.description }));

  return (
    <>
      <Select
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholderID || "scale",
        })}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        isMulti
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectScale;
