import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  Row,
  Sidebar,
  SidebarBody,
  Spinner,
} from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import { Divide, Fetch, LabelIcon, TextSpan } from "../../../components";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { floatToStringExtendDot } from "../../../components/Utils";
import { setIntegrationVoyage } from "../../../actions";
import { Container, Route, Vessel } from "../../../components/Icons";
import TimeLineVoyage from "../timeline";
import ConnectionsVoyage from "../connections";
import AnalyticsVoyage from "../analytics";
import StatusOperational from "../status-operational";

const ColData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;


export const SidebarDetailsStyled = styled(Sidebar)`
  width: 20rem;
    ${({ theme}) => css`
    background-color: ${theme.backgroundBasicColor1}ee;
    border: 1px solid ${theme.borderBasicColor3 || theme.backgroundBasicColor3};

    div {
      background-color: transparent !important;
    }
  `}

  position: absolute;
  top: 4.7rem;
  left: 16.9rem;
  z-index: 1010;
  border-radius: 12px;
  height: 92%;

  .main-container {
    width: 100%;
    height: calc(100vh - 80px);
  }

  .scrollable {
    padding: 0;
  }

  @media only screen and (max-width: 600px) {
    position: absolute;
    left: 0;
    z-index: 1099;
    width: 100%;

    .btn-aside-mobile-details-fleet {
      visibility: visible;
    }
  }

  @media only screen and (max-width: 768px) and (min-width: 601px) {
    position: absolute;
    right: 0;
    z-index: 1099;
    width: 50%;

    .btn-aside-mobile-details-fleet {
      visibility: visible;
    }
  }

  @media only screen and (min-width: 769px) {
    .btn-aside-mobile-details-fleet {
      visibility: hidden;
      width: 0px;
    }
  }
`;


const DetailsVoyageIntegration = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const theme = useTheme();

  React.useLayoutEffect(() => {
    if (props.integrationVoyageSelect?.idVoyage) {
      getData(props.integrationVoyageSelect.idVoyage);
    }
  }, [props.integrationVoyageSelect]);

  const getData = (idVoyage) => {
    setIsLoading(true);
    Fetch.get(`/voyageintegration/find?idVoyage=${idVoyage}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(true);
      });
  };

  return (
    <>
      {props.integrationVoyageSelect && (
        <SidebarDetailsStyled
          width={30}
          key={`tr-de-${props.integrationVoyageSelect?.code}`}
        >
          <SidebarBody>
            {isLoading ? (
              <div style={{ height: "100%" }}>
                <Spinner
                  status="Primary"
                  style={{ backgroundColor: theme.backgroundBasicColor1 }}
                />
              </div>
            ) : (
              <Card style={{ boxShadow: "none" }}>
                <CardHeader style={{ height: 80 }}>
                  <Row between="xs" middle="xs" className="pl-2">
                    <ColData>
                      <LabelIcon
                        renderIcon={() => (
                          <Route
                            style={{
                              height: 13,
                              width: 13,
                              fill: theme.textHintColor,
                              marginRight: 6,
                              marginTop: 3,
                            }}
                          />
                        )}
                        title={<FormattedMessage id="travel" />}
                      />
                      <TextSpan apparence="s1">
                        {props.integrationVoyageSelect?.code}
                      </TextSpan>
                    </ColData>
                    <div>
                      <Button
                        status="Danger"
                        size="Tiny"
                        appearance="ghost"
                        style={{ padding: 3 }}
                        onClick={() => props.setIntegrationVoyage(undefined)}>
                        <EvaIcon name="close-outline" />
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <LabelIcon
                        renderIcon={() => (
                          <Vessel
                            style={{
                              height: 14,
                              width: 14,
                              color: theme.textHintColor,
                              marginRight: 6,
                              marginTop: 3,
                              marginBottom: 2,
                            }}
                          />
                        )}
                        title={<FormattedMessage id="vessel" />}
                      />
                      <TextSpan apparence="s2">
                        {props.integrationVoyageSelect?.machine?.name}
                      </TextSpan>
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <LabelIcon
                        iconName="person-outline"
                        title={<FormattedMessage id="customer" />}
                      />
                      <TextSpan apparence="s2">
                        {props.integrationVoyageSelect?.customer}
                      </TextSpan>
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <LabelIcon
                        iconName="cube-outline"
                        title={<FormattedMessage id="load" />}
                      />
                      <TextSpan apparence="s2">
                        {props.integrationVoyageSelect?.loadDescription}
                      </TextSpan>
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <LabelIcon
                        renderIcon={() => (
                          <Container
                            style={{
                              height: 14,
                              width: 14,
                              fill: theme.textHintColor,
                              marginRight: 6,
                              marginTop: 3,
                              marginBottom: 2,
                            }}
                          />
                        )}
                        title={<FormattedMessage id="load.weight" />}
                      />
                      <TextSpan apparence="s2">
                        {`${floatToStringExtendDot(props.integrationVoyageSelect?.loadWeight, 1)} T`}
                      </TextSpan>
                    </Col>

                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <LabelIcon
                        iconName="navigation-2-outline"
                        title={<FormattedMessage id="departure" />}
                      />
                      <TextSpan apparence="s1">
                        {moment(props.integrationVoyageSelect?.dateTimeStart).format("DD MMM, HH:mm")}
                      </TextSpan>
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <LabelIcon
                        iconName="flag-outline"
                        title={<FormattedMessage id="end" />}
                      />
                      <TextSpan apparence="s1">
                        {moment(props.integrationVoyageSelect?.dateTimeEnd).format(
                          "DD MMM, HH:mm"
                        )}
                      </TextSpan>
                    </Col>
                  </Row>

                  <Divide mh="-18px" />

                  <ConnectionsVoyage
                    voyages={data}
                  />

                  <AnalyticsVoyage
                    voyages={data}
                  />

                  <Divide mh="-18px" />
                  <StatusOperational
                    voyages={data}
                    idMachine={data?.length ? data[0].idMachine : ''}
                  />

                  <Divide mh="-18px" />

                  <TimeLineVoyage
                    voyages={data}
                  />

                </CardBody>
              </Card>
            )}
          </SidebarBody>
        </SidebarDetailsStyled>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  integrationVoyageSelect: state.voyage.integrationVoyageSelect,
});

const mapDispatchToProps = (dispatch) => ({
  setIntegrationVoyage: (voyage) => {
    dispatch(setIntegrationVoyage(voyage));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsVoyageIntegration);
