import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { LANGUAGES } from "../../constants";


const SelectLanguageForm = ({ onChange, value, placeholderID = "", isDisabled = false }) => {

  const intl = useIntl();

  return (
    <React.Fragment>
      <Select
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholderID || "language",
        })}
        options={LANGUAGES}
        onChange={onChange}
        value={value}
        menuPosition="fixed"
        isDisabled={isDisabled}
      />
    </React.Fragment>
  );
};

export default SelectLanguageForm;
