import React from "react";
import { InputGroup } from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import { TextSpan } from "../../../components";
import { floatToStringBrazilian } from "../../../components/Utils";

const ContainerIcon = styled.div`
  ${({ theme }) => css`
    color: ${theme.colorBasic600};
  `}
  position: absolute;
  right: 12px;
  top: 7px;
`;

const valueIsInvalid = (value) => {
  return value === undefined || value === null;
};

export const onCalculateFieldValue = (data, propertiesConfig) => {
  if (
    valueIsInvalid(data[propertiesConfig.field1]) ||
    valueIsInvalid(data[propertiesConfig.field2])
  ) {
    return;
  }
  if (propertiesConfig?.condition === "differenceDate") {
    return (
      (new Date(data[propertiesConfig.field1]).getTime() -
        new Date(data[propertiesConfig.field2]).getTime()) /
      36e5
    );
  }
  if (propertiesConfig?.condition === "consumptionDaily") {
    return (data[propertiesConfig.field1] / data[propertiesConfig.field2]) * 24;
  }
  if (propertiesConfig?.condition === "sum") {
    return data[propertiesConfig.field1] + data[propertiesConfig.field2];
  }
  if (propertiesConfig?.condition === "subtract") {
    return data[propertiesConfig.field1] - data[propertiesConfig.field2];
  }
  return;
};

export default function CalculatedField(props) {
  const { propertiesConfig, data, onChange } = props;

  const refValue = React.useRef();
  const theme = useTheme();

  React.useEffect(() => {
    const valueCalculated = onCalculateFieldValue(data, propertiesConfig);
    if (!valueIsInvalid(valueCalculated)) {
      refValue.current = parseFloat(valueCalculated?.toFixed(2));
    }
    return () => {
      refValue.current = undefined;
    };
  }, []);

  React.useEffect(() => {
    onGetData(data);
  }, [data]);

  const onGetData = (data) => {
    let valueCalculated = onCalculateFieldValue(data, propertiesConfig);
    if (!valueIsInvalid(valueCalculated)) {
      valueCalculated = parseFloat(valueCalculated?.toFixed(2));
      if (refValue.current !== valueCalculated) {
        refValue.current = valueCalculated;
        onChange(valueCalculated);
      }
    }
  };

  // const valueInternal = onCalculateFieldValue(data, propertiesConfig)

  return (
    <>
      <InputGroup fullWidth className="mt-1">
        <input
          value={floatToStringBrazilian(refValue.current, 2)}
          readOnly
          disabled
          style={{ color: theme.textHintColor }}
          placeholder={props.placeholder}
        />
        {propertiesConfig?.unit && (
          <ContainerIcon>
            <TextSpan apparence="s2">{propertiesConfig?.unit}</TextSpan>
          </ContainerIcon>
        )}
      </InputGroup>
    </>
  );
}
