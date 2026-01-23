import { Button, Col, EvaIcon, Progress, Row, Spinner } from "@paljs/ui";
import React from "react";
import styled, { css, withTheme } from "styled-components";
import { nanoid } from "nanoid";
import { FormattedMessage, injectIntl } from "react-intl";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import moment from "moment";
import { Fetch, TextSpan, UserImage } from "../../../../../components";
import { connect } from "react-redux";
import AdjustManualWear from "./AdjustManualWear";

import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
`;

const TRStyled = styled(Tr)`
  ${({ theme }) => css`
    :nth-child(even) {
      background-color: ${theme.backgroundBasicColor2};
    }
  `}
`;

const THStyled = styled(Th)`
  ${({ theme, textAlign = "" }) => css`
    background-color: ${theme.backgroundBasicColor4};
    padding: 5px;
    ${textAlign && `text-align: ${textAlign};`}
  `}
`;

const TDStyled = styled(Td)`
  ${({ theme, textAlign = "" }) => css`
    padding: 5px;
    ${textAlign && `text-align: ${textAlign};`}
  `}
`;

const TableStyled = styled(Table)`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

const BadgeDiv = styled.div`
  ${({ backgroundColor }) => css`
    background-color: ${backgroundColor};
    border-radius: 4px;
    display: flex;
    justify-content: center;
  `}
`;

const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ItemMonitoringWear = (props) => {
  const { data } = props;
  const [partsWear, setPartsWear] = React.useState([]);
  const [newPartsWear, setNewPartsWear] = React.useState([]);
  const [visibleDetails, setVisibleDetails] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    let socket;
    // if (visibleDetails) {
    //   socket = CreateSocket();
    //   socket.on(`wear_machine_${data?.machine?.id}`, updateData);
    // }
    return () => {
      socket && socket.disconnect();
      socket = undefined;
    };
  }, [visibleDetails]);

  React.useLayoutEffect(() => {
    const wearInState = [...partsWear];
    wearInState?.forEach((wear) => {
      const hasWearForUpdate = newPartsWear?.find(
        (x) =>
          x.idPart == wear?.part?.id && x.idTypeService == wear?.typeService?.id
      );
      if (hasWearForUpdate) {
        wear.percentual = hasWearForUpdate.percentual;
        wear.wear = hasWearForUpdate.wear;
        wear.lastModified = hasWearForUpdate.lastModified;
      }
    });
    setPartsWear(wearInState.sort((a, b) => b.percentual - a.percentual));
  }, [newPartsWear]);

  const getDetails = () => {
    setIsLoading(true);
    Fetch.get(`/wearstate/monitoring/machine?idMachine=${data.machine.id}`)
      .then((response) => {
        setPartsWear(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const updateData = (newWearUpdate) => {
    if (newWearUpdate?.length) {
      setNewPartsWear(newWearUpdate);
    }
  };

  const changeVibibleDetails = () => {
    setVisibleDetails(!visibleDetails);
    getDetails();
  };

  const getStatus = (percentual) => {
    if (percentual > 97) {
      return "Danger";
    }

    if (percentual > 50) {
      return "Warning";
    }

    if (percentual === 0) {
      return "Control";
    }

    return "Success";
  };

  const hasPermissionManualAdjust = props.itemsByEnterprise?.some(
    (x) =>
      x.enterprise?.id == data?.enterprise?.id &&
      x.paths?.includes("/machine-wear-add")
  );

  return (
    <>
      <Col
        style={{ borderLeft: `6px solid ${props.theme.colorPrimary500}` }}
        className="p-4"
        breakPoint={{ md: 12 }}
      >
        <Col className="pl-0 pr-0" breakPoint={{ md: 12 }}>
          <Row between className="row-between">
            <UserImage
              size="Large"
              image={data?.machine?.image?.url}
              name={data?.machine?.name}
              title={data?.enterprise?.name}
            />

            <RowFlex>
              <Button
                className="ml-4"
                size="Tiny"
                status="Basic"
                onClick={changeVibibleDetails}
              >
                <EvaIcon
                  name={
                    visibleDetails
                      ? "arrow-ios-upward-outline"
                      : "arrow-ios-downward-outline"
                  }
                />
              </Button>
            </RowFlex>
          </Row>
        </Col>
        {isLoading ? (
          <Row center middle="xs"style={{ marginTop: 150 }}>
            <SpinnerStyled />
          </Row>
        ) : visibleDetails ? (
          <TableStyled>
            <Thead>
              <Tr>
                <THStyled>
                  <FormattedMessage id="action" />
                </THStyled>
                <THStyled textAlign="center">SKU</THStyled>
                <THStyled>
                  <FormattedMessage id="part" />
                </THStyled>
                <THStyled textAlign="center">
                  <FormattedMessage id="image" />
                </THStyled>
                <THStyled textAlign="center">
                  <FormattedMessage id="proportional" />
                </THStyled>
                <THStyled textAlign="center">
                  <FormattedMessage id="max.contraction" />
                </THStyled>
                <THStyled textAlign="center">
                  <FormattedMessage id="wear" />
                </THStyled>
                <THStyled textAlign="center">
                  <FormattedMessage id="next.contraction" />
                </THStyled>
                <THStyled textAlign="center">
                  <FormattedMessage id="unity.acronym" />
                </THStyled>
                <THStyled textAlign="center">%</THStyled>
                <THStyled textAlign="center">
                  <FormattedMessage id="last.date.acronym" />
                </THStyled>
                <THStyled textAlign="center">
                  <FormattedMessage id="status" />
                </THStyled>
                {hasPermissionManualAdjust && (
                  <THStyled textAlign="center" style={{ width: 50 }}>
                    Op.
                  </THStyled>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {partsWear?.map((wearPart) => {
                const wearServiceAction = wearPart?.wearConfig?.actions?.find(
                  (x) => x.typeService.value === wearPart?.typeService?.id
                );

                let id = nanoid();

                return (
                  <TRStyled key={id}>
                    <TDStyled>
                      <TextSpan apparence="s2">
                        {wearPart?.typeService?.description}
                      </TextSpan>
                    </TDStyled>
                    <TDStyled textAlign="center">
                      <TextSpan apparence="p2">{wearPart?.part?.sku}</TextSpan>
                    </TDStyled>
                    <TDStyled>
                      <TextSpan apparence="p2">{wearPart?.part?.name}</TextSpan>
                    </TDStyled>
                    <TDStyled textAlign="center">
                      {wearPart?.part?.image?.url ? (
                        <Img
                          src={wearPart?.part?.image?.url}
                          alt={wearPart?.part?.name}
                        />
                      ) : (
                        <div style={{ minHeight: 50 }}></div>
                      )}
                    </TDStyled>
                    <TDStyled textAlign="center">
                      {wearPart?.wearConfig?.proportional ? (
                        <TextSpan apparence="s2">
                          {`${wearPart?.wearConfig?.proportional}%`}
                        </TextSpan>
                      ) : (
                        <div style={{ minHeight: 21 }}></div>
                      )}
                    </TDStyled>
                    <TDStyled textAlign="center">
                      <TextSpan apparence="s2">
                        {wearServiceAction?.valueCycle || 0}
                      </TextSpan>
                    </TDStyled>
                    <TDStyled textAlign="center">
                      <TextSpan
                        style={{
                          color:
                            props.theme[
                              `color${getStatus(wearPart?.percentual)}500`
                            ],
                        }}
                        apparence="s2"
                      >
                        {wearPart?.wear}
                      </TextSpan>
                    </TDStyled>

                    <TDStyled textAlign="center">
                      <TextSpan apparence="s2">
                        {(wearPart?.lastWearDone || 0) +
                          (wearServiceAction?.valueCycle || 0)}
                      </TextSpan>
                    </TDStyled>
                    <TDStyled textAlign="center">
                      <TextSpan apparence="s2">
                        {wearServiceAction?.unityCycle && (
                          <FormattedMessage
                            id={wearServiceAction?.unityCycle}
                          />
                        )}
                      </TextSpan>
                    </TDStyled>
                    <TDStyled textAlign="center">
                      <Progress
                        size={"Small"}
                        value={wearPart?.percentual}
                        status={getStatus(wearPart?.percentual)}
                      />
                      <TextSpan
                        style={{
                          marginTop: -20,
                          display: "flex",
                          justifyContent: "center",
                          color: props.theme.colorBasic100,
                          //textShadow: `0 0 2px ${props.theme.textBasicColor}`,
                        }}
                        apparence="s2"
                      >
                        {wearPart?.percentual}%
                      </TextSpan>
                    </TDStyled>
                    <TDStyled textAlign="center">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <TextSpan apparence="s2">
                          {moment(wearPart.lastModified).format(
                            props.intl.formatMessage({ id: "format.date" })
                          )}
                        </TextSpan>
                        <TextSpan apparence="s2">
                          {moment(wearPart.lastModified).format(
                            props.intl.formatMessage({ id: "format.hours" })
                          )}
                        </TextSpan>
                      </div>
                    </TDStyled>
                    <TDStyled textAlign="center">
                      {wearPart?.percentual >= 100 ? (
                        <BadgeDiv backgroundColor={props.theme.colorDanger500}>
                          <TextSpan
                            apparence="c2"
                            style={{
                              color: props.theme.colorBasic100,
                            }}
                          >
                            <FormattedMessage id="late" />
                          </TextSpan>
                        </BadgeDiv>
                      ) : wearPart?.percentual < 100 &&
                        wearPart?.percentual > 90 ? (
                        <BadgeDiv backgroundColor={props.theme.colorWarning500}>
                          <TextSpan
                            apparence="c2"
                            style={{
                              color: props.theme.colorBasic100,
                            }}
                          >
                            <FormattedMessage id="next" />
                          </TextSpan>
                        </BadgeDiv>
                      ) : (
                        <div style={{ minHeight: 40 }}></div>
                      )}
                    </TDStyled>
                    {hasPermissionManualAdjust && (
                      <TDStyled>
                        <AdjustManualWear
                          part={`${wearPart?.part?.name} (SKU: ${wearPart?.part?.sku})`}
                          action={wearPart?.typeService?.description}
                          idMachine={wearPart?.idMachine}
                          idPart={wearPart?.part?.id}
                          idTypeService={wearPart?.typeService?.id}
                          idWearConfig={wearPart?.wearConfig?.id}
                          onRefresh={() => getDetails()}
                        />
                      </TDStyled>
                    )}
                  </TRStyled>
                );
              })}
            </Tbody>
          </TableStyled>
        ) : (
          <></>
        )}
      </Col>
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});
const ItemMonitoringWearReduxed = connect(
  mapStateToProps,
  undefined
)(ItemMonitoringWear);
const ItemMonitoringWearIntl = injectIntl(ItemMonitoringWearReduxed);
export default withTheme(ItemMonitoringWearIntl);
