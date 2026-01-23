import React from 'react'
import { InputGroup } from "@paljs/ui";
import styled, { css, useTheme } from 'styled-components';
import * as Sentry from '@sentry/react';
import { TextSpan } from '../../../components';
import { floatToStringBrazilian } from '../../../components/Utils';

const ContainerIcon = styled.div`
  ${({ theme }) => css`
    color: ${theme.colorBasic600};
  `}
  position: absolute;
  right: 12px;
  top: 7px;
`;

function isFunctionSafe(funcStr) {
  const forbiddenPatterns = [
    /eval\(/,
    /window\./,
    /document\./,
    /fetch\(/,
    /XMLHttpRequest/,
    /localStorage/,
    /process\./,
    /require\(/,
    /[\s](for|while|import|export|delete|debugger|with)[\s(]/,
  ];

  return !forbiddenPatterns.some(pattern => pattern.test(funcStr));
}

export const onExecFunction = (data, propertiesConfig) => {
  const { functionString } = propertiesConfig;
  if (!functionString) return undefined;
  try {
    const isSafe = isFunctionSafe(functionString);
    if (!isSafe) {
      if (process.env.REACT_APP_SENTRY_DSN) {
        Sentry.captureException(`Function not safe: ${functionString}`);
      }
      return 0;
    }
    const findVariables = functionString.match(/%[a-zA-Z0-9]+/g);
    if (!findVariables) return 0;
    let functionToRun = functionString;
    findVariables.forEach((variable) => {
      functionToRun = functionToRun.replace(`${variable}`, data[variable.slice(1)] || 0)
    });
    const value = eval(functionToRun)();
    return value;
  } catch (e) {
    return 0;
  }
}

export default function FunctionField(props) {

  const { propertiesConfig, data, onChange } = props;

  const [value, setValue] = React.useState();

  const refValue = React.useRef();
  const theme = useTheme();

  React.useEffect(() => {
    const valueCalculated = onExecFunction(data, propertiesConfig)
    if (valueCalculated === undefined || valueCalculated === null || valueCalculated === "") return
    refValue.current = isNaN(Number(valueCalculated))
      ? valueCalculated
      : parseFloat(valueCalculated?.toFixed(2))
    setValue(refValue.current)
    return () => {
      refValue.current = undefined
    }
  }, [])

  React.useEffect(() => {
    onGetData(data);
  }, [data])


  const onGetData = (data) => {
    const valueCalculated = onExecFunction(data, propertiesConfig)
    if (refValue.current !== valueCalculated) {
      refValue.current = valueCalculated
      setValue(refValue.current)
      onChange(valueCalculated);
    }
  }

  return (<>
    <InputGroup fullWidth className="mt-1">
      <input
        value={
          refValue.current === "" || isNaN(Number(refValue.current))
            ? refValue.current
            : floatToStringBrazilian(refValue.current, 2)}
        readOnly
        disabled
        style={{ color: theme.textHintColor }}
        placeholder={props.placeholder}
      />
      {propertiesConfig?.unit && <ContainerIcon>
        <TextSpan
          apparence="s2"
        >
          {propertiesConfig?.unit}
        </TextSpan>
      </ContainerIcon>}
    </InputGroup>
  </>)
}
