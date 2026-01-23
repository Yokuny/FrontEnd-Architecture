import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { InputGroup } from "@paljs/ui/Input";
import styled from "styled-components";
import moment from "moment";
import { LabelIcon, TextSpan } from "../../";
import InputDateTime from "../../Inputs/InputDateTime";

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const Step2Header = ({ header, onHeaderChange }) => {
  const intl = useIntl();

  const handleChange = (field, value) => {
    onHeaderChange({
      ...header,
      [field]: value
    });
  };

  return (
    <Container>
      <Row>

      <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
        <LabelIcon 
          title={
            <>
              <FormattedMessage id="ravitec.vessel" defaultMessage="Embarcação" />*
            </>
          } 
        />
        <InputGroup fullWidth>
          <input
            type="text"
            value={header.vessel || ""}
            placeholder={intl.formatMessage({ 
              id: "ravitec.vessel", 
              defaultMessage: "Embarcação" 
            })}
            onChange={(e) => handleChange("vessel", e.target.value)}
          />
        </InputGroup>
      </Col>

      <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
        <LabelIcon 
          title={
            <>
              <FormattedMessage id="local" />*
            </>
          } 
        />
        <InputGroup fullWidth>
          <input
            type="text"
            value={header.local || ""}
            placeholder={intl.formatMessage({ id: "local" })}
            onChange={(e) => handleChange("local", e.target.value)}
          />
        </InputGroup>
      </Col>

      <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
        <LabelIcon 
          title={
            <>
              <FormattedMessage id="service.date" defaultMessage="Data do Atendimento" />*
            </>
          } 
        />
        <InputDateTime
          value={header.serviceDate}
          onChange={(date) => handleChange("serviceDate", moment(date).format("YYYY-MM-DDTHH:mm:ssZ"))}
        />
      </Col>

      <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
        <LabelIcon 
          title={
            <>
              <FormattedMessage id="ravitec.coordinator" defaultMessage="Coordenador" />*
            </>
          } 
        />
        <InputGroup fullWidth>
          <input
            type="text"
            value={header.coordinator || ""}
            placeholder={intl.formatMessage({ 
              id: "ravitec.coordinator", 
              defaultMessage: "Nome do coordenador" 
            })}
            onChange={(e) => handleChange("coordinator", e.target.value)}
          />
        </InputGroup>
      </Col>

      <Col breakPoint={{ lg: 12, md: 12 }}>
        <TextSpan apparence="p2" hint>
          <FormattedMessage 
            id="ravitec.step2.note" 
            defaultMessage="* Campos obrigatórios"
          />
        </TextSpan>
      </Col>
    </Row>
    </Container>
  );
};

export default Step2Header;
