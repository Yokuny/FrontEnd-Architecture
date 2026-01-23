import React from "react";
import Select from "@paljs/ui/Select";
import { useIntl } from "react-intl";
import Fetch from "../Fetch/Fetch";

const SelectFleet = ({ onChange, value, idEnterprise, ...props }) => {
  const intl = useIntl();
  const [options, setOptions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (idEnterprise) {
      loadFleets();
    } else {
      setOptions([]);
    }
  }, [idEnterprise]);

  const loadFleets = () => {
    setIsLoading(true);
    Fetch.get(`/machinefleet/?idEnterprise=${idEnterprise}`)
      .then((response) => {
        if (response.data?.length) {
          const fleets = response.data.map(fleet => ({
            value: fleet.id,
            label: fleet.description,
          }));
          setOptions(fleets);

          if (value && !selectedOption) {
            const currentOption = fleets.find(opt => opt.value === value);
            if (currentOption) {
              onChange(currentOption.value);
            }
          }
        }
      })
      .catch((error) => {
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const selectedOption = value ? options.find(opt => opt.value === value) || null : null;

  return (
    <Select
      options={options}
      placeholder={intl.formatMessage({ id: 'select.fleet' })}
      noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
      onChange={(selected) => onChange(selected?.value || null)}
      value={selectedOption}
      isLoading={isLoading}
      menuPosition="fixed"
      isMulti={false}
      isClearable={true}
      {...props}
    />
  );
};

export default SelectFleet;
