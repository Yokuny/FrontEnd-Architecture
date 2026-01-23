
import { EvaIcon } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import TextSpan from "../../../../Text/TextSpan";
import { floatToStringExtendDot } from "../../../../Utils";
import { ContainerChart } from "../../../Utils";


const ConsumeStatusDetailsDemo = ({ height = 200, width = 200 }) => {
  const theme = useTheme();
  const intl = useIntl();


  return (
    <ContainerChart height={height} width={width} className="card-shadow">
      <TextSpan className="mb-2" apparence="s2">{`${intl.formatMessage({ id: 'consume' })} ${intl.formatMessage({ id: 'avg.contraction' })}.`}</TextSpan>
      <div className="row-flex-center">
        <EvaIcon name="droplet" options={{ fill: theme.colorPrimary600, height: 30, width: 30 }} className="mb-4 mr-3" />
        <div className="ml-2">
          <TextSpan apparence="h4">
            {floatToStringExtendDot(10.5, 2)}
          </TextSpan>
          <TextSpan apparence="p3" style={{ marginLeft: 0.7, marginBottom: 0.6 }}>
            {`m³/nm`}
          </TextSpan>
        </div>
      </div>
      <div className="row-flex-center">
        <EvaIcon name="droplet" options={{ fill: theme.colorInfo600, height: 30, width: 30 }} className="mb-4 mr-3" />
        <div className="ml-2">
          <TextSpan apparence="h4">
            {floatToStringExtendDot(18.49, 2)}
          </TextSpan>
          <TextSpan apparence="p3" style={{ marginLeft: 0.7, marginBottom: 0.6 }}>
            {`HR/nm`}
          </TextSpan>
        </div>
      </div>
    </ContainerChart>
  );
};

export default ConsumeStatusDetailsDemo;
