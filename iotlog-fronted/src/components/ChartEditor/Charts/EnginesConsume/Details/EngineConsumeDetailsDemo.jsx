
import { EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import TextSpan from "../../../../Text/TextSpan";
import { floatToStringExtendDot } from "../../../../Utils";
import { ContainerChart } from "../../../Utils";
import { Engine, EngineFilled } from "../../../../Icons";


const EngineConsumeDetailsDemo = ({ height = 200, width = 200 }) => {
  const theme = useTheme();
  const intl = useIntl();


  return (
    <ContainerChart height={height} width={width} className="card-shadow">
      <TextSpan className="mb-2" apparence="s2">{`${intl.formatMessage({ id: 'engines' })} ${intl.formatMessage({ id: 'avg.contraction' })}.`}</TextSpan>
      <div className="row-flex-center">
        <Row className="m-0">
          <Engine
            style={{ height: ' 1.5rem', width: ' 1.5rem', fill: theme.colorInfo600 }}
          />
          <EngineFilled
            style={{ height: ' 1.5rem', width: ' 1.5rem', fill: theme.backgroundBasicColor2 }}
          />
          <EngineFilled
            style={{ height: ' 1.5rem', width: ' 1.5rem', fill: theme.backgroundBasicColor2 }}
          />
        </Row>
        <div className="ml-4">
          <TextSpan apparence="h5">
            {floatToStringExtendDot(75, 1)}
          </TextSpan>
          <TextSpan apparence="p3" style={{ marginLeft: 0.7, marginBottom: 0.6 }}>
            {`%`}
          </TextSpan>
        </div>
      </div>
      <div className="row-flex-center">
      <Row className="m-0">
          <Engine
            style={{ height: ' 1.5rem', width: ' 1.5rem', fill: theme.colorDanger600 }}
          />
          <Engine
            style={{ height: ' 1.5rem', width: ' 1.5rem', fill: theme.colorDanger600 }}
          />
          <Engine
            style={{ height: ' 1.5rem', width: ' 1.5rem', fill: theme.colorDanger600 }}
          />
        </Row>
        <div className="ml-2">
          <TextSpan apparence="h4">
            {floatToStringExtendDot(40.49, 1)}
          </TextSpan>
          <TextSpan apparence="p3" style={{ marginLeft: 0.7, marginBottom: 0.6 }}>
            {`%`}
          </TextSpan>
        </div>
      </div>
    </ContainerChart>
  );
};

export default EngineConsumeDetailsDemo;
