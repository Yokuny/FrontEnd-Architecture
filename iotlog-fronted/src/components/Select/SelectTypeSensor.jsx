import Select from "@paljs/ui/Select";
import { useIntl } from "react-intl";
import { VARIABLE_TYPE, VARIABLE_TYPE_DESCRIPTION } from "../../constants";

export const OPTIONS_TYPE = [
  {
    value: VARIABLE_TYPE.INT,
    label: VARIABLE_TYPE_DESCRIPTION.INT,
  },
  {
    value: VARIABLE_TYPE.DECIMAL,
    label: VARIABLE_TYPE_DESCRIPTION.DECIMAL,
  },
  {
    value: VARIABLE_TYPE.DOUBLE,
    label: VARIABLE_TYPE_DESCRIPTION.DOUBLE,
  },
  {
    value: VARIABLE_TYPE.GEO,
    label: VARIABLE_TYPE_DESCRIPTION.GEO,
  },
  {
    value: VARIABLE_TYPE.BOOL,
    label: VARIABLE_TYPE_DESCRIPTION.BOOL,
  },
  {
    value: VARIABLE_TYPE.BOOL_NUMBER,
    label: VARIABLE_TYPE_DESCRIPTION.BOOL_NUMBER,
  },
  {
    value: VARIABLE_TYPE.STRING,
    label: VARIABLE_TYPE_DESCRIPTION.STRING,
  },
  {
    value: VARIABLE_TYPE.OBJECT,
    label: VARIABLE_TYPE_DESCRIPTION.OBJECT,
  },
  {
    value: VARIABLE_TYPE.ARRAY,
    label: VARIABLE_TYPE_DESCRIPTION.ARRAY,
  },
];

const SelectTypeSensor = ({
  onChange,
  value,
  isClearable = false,
  isDisabled = false,
  placeholderID = "variable.type"
}) => {
  const intl = useIntl();
  return (
    <>
      <Select
        options={OPTIONS_TYPE?.sort((a, b) =>
          a.label.localeCompare(b.label)
        )}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: "variable.type" || placeholderID,
        })}
        onChange={onChange}
        value={value?.value
          ? value
          : value !== null
            ? OPTIONS_TYPE.find(x => x.value === value)
            : null
        }
        isDisabled={isDisabled}
        isClearable={isClearable}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectTypeSensor;
