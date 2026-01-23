import React from "react";
import { Fetch, LabelIcon, Modal, TextSpan } from "../../../../components";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, CardFooter, Col, EvaIcon, Row, Spinner } from "@paljs/ui";
import styled, { css } from "styled-components";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
`;

const RowFlexCenter = styled(Row)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 100px;
  `}
`;

const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;

const ModalMaintenancePlan = ({ onClose, event }) => {
  const [details, setDetails] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const navigate = useNavigate();
  const intl = useIntl();
  React.useLayoutEffect(() => {
    if (event?.id) {
      getDetails(event?.id);
    } else {
      setDetails(undefined);
    }
  }, [event?.id]);

  const getDetails = (idMaintenanceHistory) => {
    setIsLoading(true);
    Fetch.get(`/maintenancemachine/plan?id=${idMaintenanceHistory}`)
      .then((response) => {
        setDetails(response.data || undefined);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Modal
        show={!!event}
        onClose={onClose}
        size="Large"
        title={`${event?.title} - ${moment(event?.nextMaintenance).utc().format("DD/MMM")}${moment(event?.nextMaintenance).isSame(moment(event?.nextEndMaintenance))
          ? ''
          : ` ${intl.formatMessage({ id: "to" }).toLocaleLowerCase()} ${moment(event?.nextEndMaintenance).utc().format("DD/MMM")
          }`
          }`}
        renderFooter={() => (
          <CardFooter>
            <Row end="xs" className="m-0">
              <Button size="Small" className="flex-between" onClick={() => navigate(`/add-maintenance?idMaintenance=${event?.idMaintenancePlan}&idMachine=${event.machine.id}`)}>
                <EvaIcon name="file-add-outline" className="mr-1" />
                <FormattedMessage id="open.os" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        {isLoading ? (
          <RowFlexCenter>
            <SpinnerStyled status="Primary" />
          </RowFlexCenter>
        ) : (
          <Row>
            <ColFlex breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                title={<FormattedMessage id="machine" />}
              />
              <TextSpan apparence="s2">
                {event?.machine?.name ?? ""}
              </TextSpan>
            </ColFlex>
            <ColFlex breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                title={`${intl.formatMessage({ id: 'maintenance' })} / ${intl.formatMessage({ id: 'date' })}`}
              />
              <TextSpan apparence="s2">
                {`${event?.desc} - ${moment(event?.nextMaintenance)
                  .utc()
                  .format(intl.formatMessage({ id: "format.daymonth" }))}`}
              </TextSpan>
            </ColFlex>
            <ColFlex breakPoint={{ md: 2 }} className="mb-4">
              <LabelIcon
                title={`${intl.formatMessage({ id: 'date.start' })}`}
              />
              <TextSpan apparence="s2">
                {event?.nextMaintenance
                  ? moment(event?.nextMaintenance)
                    .utc()
                    .format("DD MMM YYYY")
                  : '-'}
              </TextSpan>
            </ColFlex>
            <ColFlex breakPoint={{ md: 2 }} className="mb-4">
              <LabelIcon
                title={`${intl.formatMessage({ id: 'date.end' })}`}
              />
              <TextSpan apparence="s2">
                {event?.nextEndMaintenance
                  ? moment(event?.nextEndMaintenance)
                    .utc()
                    .format("DD MMM YYYY")
                  : '-'}
              </TextSpan>
            </ColFlex>
            {/* <ColFlex breakPoint={{ md: 4 }} className="mb-4">
              <TextSpan apparence="s1">
                <FormattedMessage id="enterprise" />
              </TextSpan>
              <TextSpan className="ml-2 mt-1" apparence="c1">
                {details?.enterprise?.name}
              </TextSpan>
            </ColFlex> */}

            {details?.servicesGroupe?.length &&
              <Row className="pl-3 pr-3" style={{ width: "100%" }}>
                <ColFlex breakPoint={{ md: 12 }} className="m-b">
                  <TextSpan apparence="s1">Checklist</TextSpan>
                </ColFlex>
                {details?.servicesGrouped?.map((group) => (
                  <Row
                    key={nanoid()}
                    style={{ width: "100%" }}
                    className="mt-3 pl-4 pr-4"
                  >
                    <ColFlex breakPoint={{ md: 3 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="group" />
                      </TextSpan>
                      <TextSpan apparence="c1" className="pl-2">
                        {group.groupName}
                      </TextSpan>
                    </ColFlex>

                    <ColFlex breakPoint={{ md: 3 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="description" />
                      </TextSpan>
                      {group?.itens?.map((item) => (
                        <TextSpan
                          className="ml-2 mt-1"
                          apparence="c1"
                          key={nanoid()}
                        >
                          {item?.description}
                        </TextSpan>
                      ))}
                    </ColFlex>
                    <ColFlex breakPoint={{ md: 3 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="type.maintenance" />
                      </TextSpan>
                      {group?.itens?.map((item, i) => (
                        <TextSpan
                          className="ml-2 mt-1"
                          apparence="c1"
                          key={nanoid()}
                        >
                          {item?.typeService?.label}
                        </TextSpan>
                      ))}
                    </ColFlex>
                    <ColFlex breakPoint={{ md: 3 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="observation" />
                      </TextSpan>
                      {group?.itens?.map((item, i) => (
                        <TextSpan
                          className="ml-2 mt-1"
                          apparence="c1"
                          key={nanoid()}
                        >
                          {item?.observation}
                        </TextSpan>
                      ))}
                    </ColFlex>
                  </Row>
                ))}
              </Row>}
          </Row>
        )}
      </Modal>
    </>
  );
};

export default ModalMaintenancePlan;
