import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { InputGroup } from "@paljs/ui/Input";
import { Radio } from "@paljs/ui";
import styled from "styled-components";
import { LabelIcon, TextSpan } from "../../";
import { formatCNPJ } from "../Utils/RavitecHelpers";

const EvaluationCard = styled.div`
  border: 1px solid ${props => props.theme.borderBasicColor3 || '#e4e9f2'};
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: ${props => props.theme.backgroundBasicColor2 || '#f7f9fc'};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${props => props.theme.textBasicColor || '#222b45'};
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const Step3Evaluation = ({ evaluations, onEvaluationChange, orders }) => {
  const intl = useIntl();

  const handleChange = (index, field, value) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations[index] = {
      ...updatedEvaluations[index],
      [field]: value
    };
    onEvaluationChange(updatedEvaluations);
  };

  const handleEnterpriseChange = (index, field, value) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations[index] = {
      ...updatedEvaluations[index],
      enterprise: {
        ...updatedEvaluations[index].enterprise,
        [field]: value
      }
    };
    onEvaluationChange(updatedEvaluations);
  };

  return (
    <Container>
      <Row>

      <Col breakPoint={{ lg: 12, md: 12 }}>
        <Container>
          {evaluations && evaluations.length > 0 ? (
            evaluations.map((evaluation, index) => {
              const showObservationsWarning = evaluation.satisfactory === false && 
                (!evaluation.observations || evaluation.observations.trim() === '');
              
              return (
                <EvaluationCard key={evaluation.orderId}>
                  <CardTitle>
                    <FormattedMessage id="os" /> #{evaluation.orderIndex}
                  </CardTitle>

                  <Row>
                    <Col breakPoint={{ lg: 12, md: 12 }} className="mb-3">
                      <LabelIcon 
                        title={
                          <>
                            <FormattedMessage id="os" /> / 
                            <FormattedMessage id="service.order.number" defaultMessage="Número da OS" />*
                          </>
                        } 
                      />
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          value={evaluation.orderName || ""}
                          placeholder={intl.formatMessage({ 
                            id: "os", 
                            defaultMessage: "OS" 
                          })}
                          onChange={(e) => handleChange(index, "orderName", e.target.value)}
                        />
                      </InputGroup>
                    </Col>

                    <Col breakPoint={{ lg: 8, md: 8 }} className="mb-3">
                      <LabelIcon 
                        title={
                          <>
                            <FormattedMessage id="ravitec.enterprise" defaultMessage="Empresa (Razão Social)" />*
                          </>
                        } 
                      />
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          value={evaluation.enterprise?.razao || ""}
                          placeholder={intl.formatMessage({ 
                            id: "ravitec.enterprise", 
                            defaultMessage: "Razão Social" 
                          })}
                          onChange={(e) => handleEnterpriseChange(index, "razao", e.target.value)}
                        />
                      </InputGroup>
                    </Col>

                    <Col breakPoint={{ lg: 4, md: 4 }} className="mb-3">
                      <LabelIcon 
                        title={
                          <FormattedMessage id="cnpj" defaultMessage="CNPJ" />
                        } 
                      />
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          value={evaluation.enterprise?.cnpj || ""}
                          placeholder={intl.formatMessage({ 
                            id: "cnpj", 
                            defaultMessage: "CNPJ" 
                          })}
                          onChange={(e) => handleEnterpriseChange(index, "cnpj", e.target.value)}
                        />
                      </InputGroup>
                    </Col>

                    <Col breakPoint={{ lg: 12, md: 12 }} className="mb-3">
                      <LabelIcon 
                        title={
                          <>
                            <FormattedMessage 
                              id="ravitec.equipment" 
                              defaultMessage="Equipamento/Serviço" 
                            />*
                          </>
                        } 
                      />
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          value={evaluation.equipment || ""}
                          placeholder={intl.formatMessage({ 
                            id: "ravitec.equipment", 
                            defaultMessage: "Equipamento/Serviço" 
                          })}
                          onChange={(e) => handleChange(index, "equipment", e.target.value)}
                        />
                      </InputGroup>
                    </Col>

                    <Col breakPoint={{ lg: 12, md: 12 }} className="mb-3">
                      <LabelIcon 
                        title={
                          <>
                            <FormattedMessage 
                              id="ravitec.satisfactory" 
                              defaultMessage="Satisfatório" 
                            />*
                          </>
                        } 
                      />
                      <Radio
                        name={`satisfactory-${index}`}
                        onChange={(value) => handleChange(index, "satisfactory", value === "true")}
                        options={[
                          {
                            value: "true",
                            label: intl.formatMessage({ id: "yes", defaultMessage: "Sim" }),
                            checked: evaluation.satisfactory === true
                          },
                          {
                            value: "false",
                            label: intl.formatMessage({ id: "no", defaultMessage: "Não" }),
                            checked: evaluation.satisfactory === false
                          }
                        ]}
                      />
                    </Col>

                    <Col breakPoint={{ lg: 12, md: 12 }} className="mb-2">
                      <LabelIcon 
                        title={
                          <>
                            <FormattedMessage 
                              id="ravitec.observations" 
                              defaultMessage="Observações" 
                            />
                            {evaluation.satisfactory === false && "*"}
                          </>
                        } 
                      />
                      <InputGroup fullWidth>
                        <textarea
                          rows={3}
                          value={evaluation.observations || ""}
                          placeholder={intl.formatMessage({ 
                            id: "ravitec.observations", 
                            defaultMessage: "Observações" 
                          })}
                          onChange={(e) => handleChange(index, "observations", e.target.value)}
                        />
                      </InputGroup>
                      {showObservationsWarning && (
                        <TextSpan apparence="p2" status="Danger" className="mt-1">
                          <FormattedMessage 
                            id="ravitec.observations.required" 
                            defaultMessage="Observações são obrigatórias quando não satisfatório"
                          />
                        </TextSpan>
                      )}
                    </Col>
                  </Row>
                </EvaluationCard>
              );
            })
          ) : (
            <TextSpan apparence="p1" hint>
              <FormattedMessage 
                id="no.evaluations" 
                defaultMessage="Nenhuma avaliação para exibir" 
              />
            </TextSpan>
          )}
        </Container>
      </Col>

      <Col breakPoint={{ lg: 12, md: 12 }} className="mt-3">
        <TextSpan apparence="p2" hint>
          <FormattedMessage 
            id="ravitec.step3.note" 
            defaultMessage="* Campos obrigatórios: Número da OS, Empresa, Equipamento/Serviço e Satisfatório. Observações são obrigatórias quando não satisfatório."
          />
        </TextSpan>
      </Col>
    </Row>
    </Container>
  );
};

export default Step3Evaluation;
