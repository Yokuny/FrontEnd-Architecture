import React from "react";
import Select from "@paljs/ui/Select";
import { useIntl } from "react-intl";

const Sizenation = ({ onChange, value, total }) => {
  const options = [
    {
      value: 5,
      label: 5,
    },
    {
      value: 10,
      label: 10,
    },
    {
      value: 25,
      label: 25,
    },
    {
      value: 50,
      label: 50,
    },
    {
      value: 100,
      label: 100,
    },
  ];
  const intl = useIntl();

  return (
    <>
      <Select
        options={options.filter((x) => x.value < total)}
        placeholder={intl.formatMessage({
          id: "size.list.placeholder",
        })}
        onChange={onChange}
        value={options.find(x => x.value === value)}
        menuPosition="fixed"
      />
    </>
  );
};

export default Sizenation;
