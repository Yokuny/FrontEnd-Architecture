import React from "react";
import styled, { useTheme } from "styled-components";
import TextSpan from "../../../Text/TextSpan";
import { Col, Row } from "@paljs/ui";
import moment from "moment";
import { floatToStringExtendDot } from "../../../Utils";

const ContainerChart = styled.div`
${({ height, width }) => `
min-width: ${width}px;
min-height: ${height}px;
max-width: ${width}px;
max-height: ${height}px;
display: flex;
flex-direction: column;
justify-content: center;
flex: 1;
padding: 1rem;
`}
`;

export default function FuelConsumptionChart(props) {


  return (
    <ContainerChart height={props.height} width={props.width}>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
        <TextSpan apparence="p2" hint textAlign="center">
          {props.title}
        </TextSpan>
        <Col>
          <Row style={{alignItems: "baseline", flexWrap: `no-wrap !important` }} center="xs">

            <TextSpan apparence="h3">{floatToStringExtendDot(props.fuelConsumption || 0, 2)}</TextSpan>
            <TextSpan apparence="s3" className="ml-1" hint>L</TextSpan>
          </Row>
        </Col>
        <TextSpan apparence="p2" textAlign="center" hint>
          {props.dateFiltered?.dateInit ? moment(props.dateFiltered?.dateInit).format('DD/MMM') : ``} - {props.dateFiltered?.dateEnd ? moment(props.dateFiltered?.dateEnd).format('DD/MMM') : ``}
          </TextSpan>
      </div>
    </ContainerChart>
  );
}
