import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { InputGroup } from "@paljs/ui/Input";
import { Radio } from "@paljs/ui";
import styled from "styled-components";
import { LabelIcon, TextSpan } from "../../";

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const Step4GeneralObservations = ({ generalObs, onGeneralObsChange }) => {
  const intl = useIntl();

  const handleChange = (field, value) => {
    onGeneralObsChange({
      ...generalObs,
      [field]: value
    });
  };

  const showDeviationsDescription = generalObs.deviationsFound === true;
  const showDeviationsTreated = generalObs.deviationsFound === true;

  return (
    <Container>
      <Row>

      <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
        <LabelIcon 
          title={
            <>
              <FormattedMessage 
                id="ravitec.round.performed" 
                defaultMessage="Ronda produtiva realizada?" 
              />*
            </>
          } 
        />
        <Radio
          name="roundPerformed"
          onChange={(value) => handleChange("roundPerformed", value === "true")}
          options={[
            {
              value: "true",
              label: intl.formatMessage({ id: "yes", defaultMessage: "Sim" }),
              checked: generalObs.roundPerformed === true
            },
            {
              value: "false",
              label: intl.formatMessage({ id: "no", defaultMessage: "Não" }),
              checked: generalObs.roundPerformed === false
            }
          ]}
        />
      </Col>

      <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
        <LabelIcon 
          title={
            <>
              <FormattedMessage 
                id="ravitec.deviations.found" 
                defaultMessage="Foram encontrados desvios ou pontos de melhoria?" 
              />*
            </>
          } 
        />
        <Radio
          name="deviationsFound"
          onChange={(value) => {
            if (value === "false") {
              onGeneralObsChange({
                ...generalObs,
                deviationsFound: false,
                deviationsDescription: "",
                deviationsTreated: null
              });
            } else {
              handleChange("deviationsFound", true);
            }
          }}
          options={[
            {
              value: "true",
              label: intl.formatMessage({ id: "yes", defaultMessage: "Sim" }),
              checked: generalObs.deviationsFound === true
            },
            {
              value: "false",
              label: intl.formatMessage({ id: "no", defaultMessage: "Não" }),
              checked: generalObs.deviationsFound === false
            }
          ]}
        />
      </Col>

      {showDeviationsDescription && (
        <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
          <LabelIcon 
            title={
              <>
                <FormattedMessage 
                  id="ravitec.deviations.description" 
                  defaultMessage="Descrição dos desvios" 
                />*
              </>
            } 
          />
          <InputGroup fullWidth>
            <textarea
              rows={4}
              value={generalObs.deviationsDescription || ""}
              placeholder={intl.formatMessage({ 
                id: "ravitec.deviations.description.placeholder", 
                defaultMessage: "Descreva os desvios ou pontos de melhoria encontrados" 
              })}
              onChange={(e) => handleChange("deviationsDescription", e.target.value)}
            />
          </InputGroup>
          {generalObs.deviationsFound && (!generalObs.deviationsDescription || generalObs.deviationsDescription.trim() === '') && (
            <TextSpan apparence="p2" status="Danger" className="mt-1">
              <FormattedMessage 
                id="ravitec.deviations.description.required" 
                defaultMessage="A descrição dos desvios é obrigatória"
              />
            </TextSpan>
          )}
        </Col>
      )}

      {showDeviationsTreated && (
        <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
          <LabelIcon 
            title={
              <>
                <FormattedMessage 
                  id="ravitec.deviations.treated" 
                  defaultMessage="Desvios ou pontos de melhoria foram tratados de imediato?" 
                />*
              </>
            } 
          />
          <Radio
            name="deviationsTreated"
            onChange={(value) => handleChange("deviationsTreated", value === "true")}
            options={[
              {
                value: "true",
                label: intl.formatMessage({ id: "yes", defaultMessage: "Sim" }),
                checked: generalObs.deviationsTreated === true
              },
              {
                value: "false",
                label: intl.formatMessage({ id: "no", defaultMessage: "Não" }),
                checked: generalObs.deviationsTreated === false
              }
            ]}
          />
        </Col>
      )}

      <Col breakPoint={{ lg: 12, md: 12 }}>
        <TextSpan apparence="p2" hint>
          <FormattedMessage 
            id="ravitec.step4.note" 
            defaultMessage="* Campos obrigatórios"
          />
        </TextSpan>
      </Col>
    </Row>
    </Container>
  );
};

export default Step4GeneralObservations;
