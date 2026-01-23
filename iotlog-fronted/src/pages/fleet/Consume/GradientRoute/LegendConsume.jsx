import React from "react";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { TextSpan, Toggle } from "../../../../components";
import { floatToStringBrazilian } from "../../../../components/Utils";

const DivContent = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
  position: absolute;
  right: 8px;
  bottom: -210px;
  z-index: 1020;
  display: flex;
  flex-direction: column;
  padding: 5px;
  border-radius: 4px;

  i {
    width: 18px;
    height: 18px;
    float: left;
    margin-right: 8px;
    border-radius: 0.2rem;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LegendConsume = ({ min, max, theme }) => {
  return (
    <>
      <DivContent>
        <Row style={{ justifyContent: "center" }}>
          <TextSpan apparence="p3">
            <FormattedMessage id="consume" />
            <strong className="ml-1">l/h</strong>
          </TextSpan>
        </Row>
        <>
          <Row className="mt-1">
            <i style={{ background: theme.colorPrimary500 }}></i>
            <TextSpan apparence="s3">{floatToStringBrazilian(min, 1)}</TextSpan>
            <TextSpan
              apparence="p4"
              className="ml-1"
              style={{ marginTop: 1.5 }}
            >
              <FormattedMessage id="min.contraction" />
            </TextSpan>
          </Row>
          <Row className="mt-1 mb-1">
            <i style={{ background: theme.colorWarning500 }}></i>
            <TextSpan apparence="s3">
              {floatToStringBrazilian(min + (max - min) / 2, 1)}
            </TextSpan>
            <TextSpan
              apparence="p4"
              className="ml-1"
              style={{ marginTop: 1.5 }}
            >
              <FormattedMessage id="avg.contraction" />
            </TextSpan>
          </Row>
          <Row>
            <i style={{ background: theme.colorDanger700 }}></i>
            <TextSpan apparence="s3">{floatToStringBrazilian(max, 1)}</TextSpan>
            <TextSpan
              apparence="p4"
              className="ml-1"
              style={{ marginTop: 1.5 }}
            >
              <FormattedMessage id="max.contraction" />
            </TextSpan>
          </Row>
        </>
      </DivContent>
    </>
  );
};

export default LegendConsume;
