import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { TYPE_GEOFENCE } from "../../pages/register/geofence/Constants";

const SelectFenceType = ({ onChange, value = null, disabled = false, isMulti = false }) => {
  const intl = useIntl();
  const [selectedType, setSelectedType] = React.useState(value);

  const optionsTypeFence = [
    {
      value: TYPE_GEOFENCE.ANCHORAGE,
      label: intl.formatMessage({ id: TYPE_GEOFENCE.ANCHORAGE }),
      color: "#00A2E8",
    },
    {
      value: TYPE_GEOFENCE.BAR,
      label: intl.formatMessage({ id: TYPE_GEOFENCE.BAR }),
      color: "#A349A4",
    },
    {
      value: TYPE_GEOFENCE.BASIN,
      label: intl.formatMessage({ id: "basin" }),
      color: "#1939B7",
    },
    {
      value: TYPE_GEOFENCE.DANGER_NAVIGATION,
      label: intl.formatMessage({ id: "dangerNavigation" }),
      color: "#ED1C24",
    },
    {
      value: TYPE_GEOFENCE.FIELD,
      label: intl.formatMessage({ id: "field" }),
      color: "#11A24F",
    },
    {
      value: TYPE_GEOFENCE.MONITORING,
      label: intl.formatMessage({ id: TYPE_GEOFENCE.MONITORING }),
      color: "#008080",
    },
    {
      value: TYPE_GEOFENCE.PIER,
      label: intl.formatMessage({ id: TYPE_GEOFENCE.PIER }),
      color: "#FF7F27",
    },
    {
      value: TYPE_GEOFENCE.PORT,
      label: intl.formatMessage({ id: TYPE_GEOFENCE.PORT }),
      color: "#3366FF",
    },
    {
      value: TYPE_GEOFENCE.ROUTE,
      label: intl.formatMessage({ id: TYPE_GEOFENCE.ROUTE }),
      color: "#22B14C",
    },
    {
      value: TYPE_GEOFENCE.SHIPYARD,
      label: intl.formatMessage({ id: TYPE_GEOFENCE.SHIPYARD }),
      color: "#FFF200",
    },
    {
      value: TYPE_GEOFENCE.WARN_NAVIGATION,
      label: intl.formatMessage({ id: TYPE_GEOFENCE.WARN_NAVIGATION }),
      color: "#FFB70F",
    },
    {
      value: TYPE_GEOFENCE.OTHER,
      label: intl.formatMessage({ id: TYPE_GEOFENCE.OTHER }),
      color: "#7F7F7F",
    },
  ];

  React.useEffect(() => {
    if (value) {
      const matched  = Array.isArray(value)
      ? optionsTypeFence.filter(
        (opt) => value.find((v) => v.value === opt.value || v === opt.value)
      )
      : optionsTypeFence.find(
        (opt) => opt.value === value?.value || opt.value === value
      );
      setSelectedType(matched || null);
    } else {
      setSelectedType(null);
    }
  }, [value]);

  const handleSelectChange = (option) => {
    setSelectedType(option);

    if (typeof onChange === "function") {
      onChange(option);
    }
    if (!option) {
      onChange("remove");
    }
  };

  return (
    <>
      <Select
        options={optionsTypeFence?.sort((a, b) =>
          a.label.localeCompare(b.label)
        )}
        placeholder={intl.formatMessage({ id: "type" })}
        onChange={handleSelectChange}
        value={selectedType}
        isClearable
        isDisabled={disabled}
        isMulti={isMulti}
      />
    </>
  );
};

export default SelectFenceType;
