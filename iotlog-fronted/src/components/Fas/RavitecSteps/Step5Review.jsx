import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import styled from "styled-components";
import { TextSpan } from "../../";
import { formatRavitecDate, formatCNPJ } from "../Utils/RavitecHelpers";

const ReviewSection = styled.div`
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

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${props => props.theme.textBasicColor || '#222b45'};
  border-bottom: 2px solid ${props => props.theme.primaryColor || '#0095ff'};
  padding-bottom: 8px;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const Field = styled.div`
  margin-bottom: 12px;
  display: flex;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  .label {
    font-weight: 600;
    margin-right: 8px;
    min-width: 150px;
    flex-shrink: 0;
  }
  
  .value {
    flex: 1;
    min-width: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
`;

const EvaluationItem = styled.div`
  padding: 12px;
  margin-bottom: 12px;
  border-left: 3px solid ${props => props.satisfactory ? '#00d68f' : '#ff3d71'};
  background-color: ${props => props.theme.backgroundBasicColor1 || '#ffffff'};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const OrderBadge = styled.span`
  background-color: ${props => props.theme.primaryColor || '#0095ff'};
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  margin-right: 8px;
  font-size: 12px;
`;

const Step5Review = ({ ravitecData, orders }) => {
  const intl = useIntl();

  const selectedOrdersDetails = orders.filter(order => 
    ravitecData.selectedOrders.includes(order.id)
  );

  return (
    <Container>
      <Row>
        <Col breakPoint={{ lg: 12, md: 12 }}>
          <ReviewSection>
            <SectionTitle>
              <FormattedMessage 
                id="ravitec.selected.orders" 
                defaultMessage="OSs Selecionadas"
              /> ({selectedOrdersDetails.length})
            </SectionTitle>
            <div>
              {selectedOrdersDetails.map(order => (
                <div key={order.id} style={{ marginBottom: '8px' }}>
                  <OrderBadge>#{order.index}</OrderBadge>
                  <TextSpan apparence="s1">
                    {order.name} - {order.job || "Sem JOB"}
                  </TextSpan>
                </div>
              ))}
            </div>
          </ReviewSection>
        </Col>

        <Col breakPoint={{ lg: 12, md: 12 }}>
          <ReviewSection>
            <SectionTitle>
              <FormattedMessage 
                id="ravitec.header.data" 
                defaultMessage="Dados do Cabeçalho"
              />
            </SectionTitle>
            <Field>
              <span className="label">
                <FormattedMessage id="ravitec.vessel" defaultMessage="Embarcação" />:
              </span>
              <span className="value">
                <TextSpan apparence="s1">{ravitecData.header.vessel}</TextSpan>
              </span>
            </Field>
            <Field>
              <span className="label">
                <FormattedMessage id="local" />:
              </span>
              <span className="value">
                <TextSpan apparence="s1">{ravitecData.header.local}</TextSpan>
              </span>
            </Field>
            <Field>
              <span className="label">
                <FormattedMessage id="service.date" defaultMessage="Data do Atendimento" />:
              </span>
              <span className="value">
                <TextSpan apparence="s1">
                  {formatRavitecDate(ravitecData.header.serviceDate)}
                </TextSpan>
              </span>
            </Field>
            <Field>
              <span className="label">
                <FormattedMessage id="ravitec.coordinator" defaultMessage="Coordenador" />:
              </span>
              <span className="value">
                <TextSpan apparence="s1">{ravitecData.header.coordinator}</TextSpan>
              </span>
            </Field>
          </ReviewSection>
        </Col>

        <Col breakPoint={{ lg: 12, md: 12 }}>
          <ReviewSection>
            <SectionTitle>
              <FormattedMessage 
                id="ravitec.evaluations" 
                defaultMessage="Avaliações dos Atendimentos"
              />
            </SectionTitle>
            {ravitecData.evaluations.map((evaluation, index) => (
              <EvaluationItem key={evaluation.orderId} satisfactory={evaluation.satisfactory}>
                <div style={{ marginBottom: '12px' }}>
                  <TextSpan apparence="s1" style={{ fontWeight: 'bold' }}>
                    {evaluation.orderName || `OS #${evaluation.orderIndex}`}
                  </TextSpan>
                </div>
                <Field>
                  <span className="label">
                    <FormattedMessage id="ravitec.enterprise" defaultMessage="Empresa" />:
                  </span>
                  <span className="value">
                    <TextSpan apparence="s2">
                      {evaluation.enterprise?.razao || "N/A"}
                    </TextSpan>
                  </span>
                </Field>
                {evaluation.enterprise?.cnpj && (
                  <Field>
                    <span className="label">
                      <FormattedMessage id="cnpj" defaultMessage="CNPJ" />:
                    </span>
                    <span className="value">
                      <TextSpan apparence="s2">
                        {formatCNPJ(evaluation.enterprise.cnpj)}
                      </TextSpan>
                    </span>
                  </Field>
                )}
                <Field>
                  <span className="label">
                    <FormattedMessage id="ravitec.equipment" defaultMessage="Equipamento" />:
                  </span>
                  <span className="value">
                    <TextSpan apparence="s2">{evaluation.equipment}</TextSpan>
                  </span>
                </Field>
                <Field>
                  <span className="label">
                    <FormattedMessage id="ravitec.satisfactory" defaultMessage="Satisfatório" />:
                  </span>
                  <span className="value">
                    <TextSpan apparence="s2" status={evaluation.satisfactory ? "Success" : "Danger"}>
                      {evaluation.satisfactory 
                        ? intl.formatMessage({ id: "yes", defaultMessage: "Sim" })
                        : intl.formatMessage({ id: "no", defaultMessage: "Não" })
                      }
                    </TextSpan>
                  </span>
                </Field>
                {evaluation.observations && (
                  <Field>
                    <span className="label">
                      <FormattedMessage id="ravitec.observations" defaultMessage="Observações" />:
                    </span>
                    <span className="value">
                      <TextSpan apparence="s2">{evaluation.observations}</TextSpan>
                    </span>
                  </Field>
                )}
              </EvaluationItem>
            ))}
          </ReviewSection>
        </Col>

        <Col breakPoint={{ lg: 12, md: 12 }}>
          <ReviewSection>
            <SectionTitle>
              <FormattedMessage 
                id="ravitec.general.observations" 
                defaultMessage="Observações Gerais e Ronda Produtiva"
              />
            </SectionTitle>
            <Field>
              <span className="label">
                <FormattedMessage id="ravitec.round.performed" defaultMessage="Ronda produtiva realizada" />:
              </span>
              <span className="value">
                <TextSpan apparence="s1">
                  {ravitecData.generalObservations.roundPerformed 
                    ? intl.formatMessage({ id: "yes", defaultMessage: "Sim" })
                    : intl.formatMessage({ id: "no", defaultMessage: "Não" })
                  }
                </TextSpan>
              </span>
            </Field>
            <Field>
              <span className="label">
                <FormattedMessage id="ravitec.deviations.found" defaultMessage="Desvios encontrados" />:
              </span>
              <span className="value">
                <TextSpan apparence="s1">
                  {ravitecData.generalObservations.deviationsFound 
                    ? intl.formatMessage({ id: "yes", defaultMessage: "Sim" })
                    : intl.formatMessage({ id: "no", defaultMessage: "Não" })
                  }
                </TextSpan>
              </span>
            </Field>
            {ravitecData.generalObservations.deviationsFound && (
              <>
                <Field>
                  <span className="label">
                    <FormattedMessage id="ravitec.deviations.description" defaultMessage="Descrição" />:
                  </span>
                  <span className="value">
                    <TextSpan apparence="s2">
                      {ravitecData.generalObservations.deviationsDescription}
                    </TextSpan>
                  </span>
                </Field>
                <Field>
                  <span className="label">
                    <FormattedMessage id="ravitec.deviations.treated" defaultMessage="Tratados de imediato" />:
                  </span>
                  <span className="value">
                    <TextSpan apparence="s1">
                      {ravitecData.generalObservations.deviationsTreated 
                        ? intl.formatMessage({ id: "yes", defaultMessage: "Sim" })
                        : intl.formatMessage({ id: "no", defaultMessage: "Não" })
                      }
                    </TextSpan>
                  </span>
                </Field>
              </>
            )}
          </ReviewSection>
        </Col>
      </Row>
    </Container>
  );
};

export default Step5Review;
