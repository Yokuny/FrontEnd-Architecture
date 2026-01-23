import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { TYPE_VESSSEL } from "../../../constants";

const SelectCIIReference = ({ onChange, value }) => {
  const intl = useIntl();
  const options = [
    {
      value: TYPE_VESSSEL.BULK_CARRIER,
      label: 'Bulk Carrier'
    },
    {
      value: TYPE_VESSSEL.GAS_CARRIER,
      label: 'Gas Carrier'
    },
    {
      value: TYPE_VESSSEL.TANKER,
      label: 'Tanker'
    },
    {
      value: TYPE_VESSSEL.CONTAINER_SHIP,
      label: 'Container ship'
    },
    {
      value: TYPE_VESSSEL.GENERAL_CARGO_SHIP,
      label: 'General cargo ship'
    },
    {
      value: TYPE_VESSSEL.REFRIGERATED_CARGO_CARRIER,
      label: 'Refrigerated cargo Carrier'
    },
    {
      value: TYPE_VESSSEL.COMBINATION_CARRIER,
      label: 'Combination Carrier'
    },
    {
      value: TYPE_VESSSEL.LNG_CARRIER,
      label: 'LNG Carrier'
    },
    {
      value: TYPE_VESSSEL.RO_RO_CARGO_SHIP,
      label: 'Ro-ro cargo ship'
    },
    {
      value: TYPE_VESSSEL.RO_RO_CARGO_SHIP_VC,
      label: 'Ro-ro cargo ship (VC)'
    },
    {
      value: TYPE_VESSSEL.RO_RO_PASSENGER_SHIP,
      label: 'Ro-ro passenger ship'
    },
    {
      value: TYPE_VESSSEL.CRUISE_PASSENGER_SHIP,
      label: 'Cruise passenger ship'
    },
  ];

  return (
    <>
      <Select
        options={options}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={`${intl.formatMessage({ id: 'type.vessel' })} (CII reference)`}
        onChange={onChange}
        value={options?.find(x => x.value === value)}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectCIIReference;
