import { Button, CardBody, EvaIcon, InputGroup } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import {
  LabelIcon,
  SelectCondition,
  SelectSensorByEnterprise,
} from "../../../../components";
import { Equals } from "../../../../components/Icons";

const ButtonDeleteFixed = styled(Button)`
  padding: 5px;
  position: absolute;
  right: 10px;
  top: 5px;
`;

export default function OrCondition(props) {
  const intl = useIntl();
  const theme = useTheme();
  const { idEnterprise, data, onChange, onRemove } = props;
  return (
    <CardBody>
      <ButtonDeleteFixed
        appearance="ghost"
        size="Tiny"
        status="Danger"
        onClick={onRemove}
      >
        <EvaIcon name="trash-2-outline" />
      </ButtonDeleteFixed>

      <LabelIcon
        iconName="flash-outline"
        title={`${intl.formatMessage({ id: "sensor" })} *`}
      />
      <div className="mt-1"></div>
      <SelectSensorByEnterprise
        idEnterprise={idEnterprise}
        onChange={(value) => onChange("sensor", value)}
        value={data?.sensor}
        placeholder="sensor"
        noSignal
      />
      <div className="mt-3"></div>
      <LabelIcon
        iconName="code-outline"
        title={`${intl.formatMessage({ id: "condition" })} *`}
      />
      <div className="mt-1"></div>
      <SelectCondition
        placeholderID="condition"
        isProcessValue
        onChange={(value) => onChange("condition", value?.value)}
        value={data?.condition}
      />
      <div className="mt-3"></div>
      <LabelIcon
        renderIcon={() => (
          <Equals
            style={{
              height: 13,
              width: 13,
              fill: theme.textHintColor,
              marginRight: 5,
              marginTop: 2,
            }}
          />
        )}
        title={`${intl.formatMessage({ id: "value" })} *`}
      />
      <div className="mt-1"></div>
      <InputGroup fullWidth className="mt-1">
        <input
          type="text"
          style={{
            lineHeight: "0.5rem",
          }}
          placeholder={intl.formatMessage({
            id: "value",
          })}
          onChange={(e) => onChange("value", e.target.value)}
          value={data?.value}
        />
      </InputGroup>
    </CardBody>
  );
}
