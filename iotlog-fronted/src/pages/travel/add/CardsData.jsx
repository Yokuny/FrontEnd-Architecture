import { Card, CardBody, CardHeader, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import styled, { useTheme } from "styled-components";
import { DateTime, LabelIcon, TextSpan } from "../../../components";

const ColDate = styled(Col)`
  input {
    line-height: 1.1rem;
  }

  a svg {
    top: -7px;
    position: absolute;
    right: -5px;
  }
`;

const CardTitle = styled(CardHeader)`
  display: flex;
  align-items: center;
`;


export default function CardsData({ formData, onChange, intl }) {
  const theme = useTheme();

  return (
    <>
      <Row>
        <ColDate breakPoint={{ md: 6 }}>

        </ColDate>

        <ColDate breakPoint={{ md: 6 }}>

        </ColDate>

      </Row>
    </>
  );
}
