import { InputGroup } from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon } from "../../../components";

export default function FormulaCodeTravel(props) {
  const intl = useIntl();

  return (
    <React.StrictMode>
      <LabelIcon
        iconName="code-outline"
        title={<FormattedMessage id="formula.travel.code" />}
      />
      <InputGroup fullWidth className="mt-2">
        <textarea
          value={props.value}
          rows={4}
          onChange={props.onChange}
          type="text"
          placeholder={intl.formatMessage({
            id: "formula.optional",
          })}
        />
      </InputGroup>
    </React.StrictMode>
  );
}
