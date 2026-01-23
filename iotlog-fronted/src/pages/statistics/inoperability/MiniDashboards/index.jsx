import { CardBody, Col, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { CardNoShadow, Fetch, TextSpan } from "../../../../components";
import { Money } from "../../../../components/Icons";
import {
  floatToStringBrazilian,
  floatToStringExtendDot,
} from "../../../../components/Utils";
import { getIconStatusOperation } from "../../../fleet/Status/Utils";

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
`;

function MiniDashboards(props) {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();
  const theme = useTheme();

  React.useEffect(() => {
    if (props.idMachine) {
      onGetData(props.idMachine);
    }
  }, [props.idMachine]);

  const onGetData = (idMachine) => {
    setIsLoading(true);
    Fetch.get(`/assetstatus/lastoperation/${idMachine}`)
      .then((response) => {
        if (response.data) {
          setData(response.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const detailsStatus = getIconStatusOperation(data?.status);

  const series = [
    props.data
      .filter((x) => x.status !== "operacao")
      .reduce((acc, cur) => acc + cur.totalHours, 0),
    props.data
      .filter((x) => x.status === "operacao")
      .reduce((acc, cur) => acc + cur.totalHours, 0),
  ];

  const hasPermissionViewFinancial =
    props.items?.some((x) => x === "/view-inoperability-profit-loss") || false;

  const totalLoss = (hasPermissionViewFinancial ? props.totalLoss : 0) * -1;
  const totalRevenue = (hasPermissionViewFinancial ? props.totalRevenue : 0);

  return (
    <>
      <Col breakPoint={{ xs: 12, md: 4 }}>
        <CardNoShadow>
          <CardBody>
            <Row middle="xs" center="xs" className="pt-2 pb-2">
              <ColFlex breakPoint={{ xs: 2 }}>
                <EvaIcon
                  name="calendar-outline"
                  options={{
                    height: "1.5rem",
                    width: "1.5rem",
                  }}
                  status="Danger"
                />
              </ColFlex>
              <ColFlex breakPoint={{ xs: 9 }}>
                <TextSpan apparence="h5">
                  {floatToStringBrazilian(series[0] / 24, 3)}
                </TextSpan>
                <TextSpan apparence="p2" hint className="mt-1">
                  {intl.formatMessage({ id: "days.downtime" })}
                </TextSpan>
              </ColFlex>
            </Row>
          </CardBody>
        </CardNoShadow>
        <CardNoShadow>
          <CardBody>
            <Row middle="xs" center="xs" className="pt-2 pb-2">
              <ColFlex breakPoint={{ xs: 2 }}>
                <EvaIcon
                  name="calendar-outline"
                  options={{
                    height: "1.5rem",
                    width: "1.5rem",
                  }}
                  status="Primary"
                />
              </ColFlex>
              <ColFlex breakPoint={{ xs: 9 }}>
                <TextSpan apparence="h5">
                  {floatToStringBrazilian(series[1] / 24, 3)}
                </TextSpan>
                <TextSpan apparence="p2" hint className="mt-1">
                  {intl.formatMessage({ id: "days.operational" })}
                </TextSpan>
              </ColFlex>
            </Row>
          </CardBody>
        </CardNoShadow>
        {hasPermissionViewFinancial && props.viewLoss && (
          <CardNoShadow>
            <CardBody>
              <Row middle="xs" center="xs" className="pt-2 pb-2">
                <ColFlex breakPoint={{ xs: 2 }}>
                  <Money
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      fill: theme.colorDanger500,
                    }}
                  />
                </ColFlex>
                <ColFlex breakPoint={{ xs: 9 }}>
                  <TextSpan apparence="h5">
                    {floatToStringExtendDot(totalLoss, 2)}
                  </TextSpan>
                  <TextSpan apparence="p2" hint className="mt-1">
                    {intl.formatMessage({ id: "loss" })} (BRL)
                  </TextSpan>
                </ColFlex>
              </Row>
            </CardBody>
          </CardNoShadow>
        )}
      </Col>
      <Col breakPoint={{ xs: 12, md: 4 }}>
        <CardNoShadow>
          <CardBody>
            <Row middle="xs" center="xs" className="pt-2 pb-2">
              <ColFlex breakPoint={{ xs: 2 }}>
                <EvaIcon
                  name="alert-triangle-outline"
                  options={{
                    height: "1.5rem",
                    width: "1.5rem",
                  }}
                  status="Warning"
                />
              </ColFlex>
              <ColFlex breakPoint={{ xs: 9 }}>
                <TextSpan apparence="h5">
                  {props.typesEvents?.length || 0}
                </TextSpan>
                <TextSpan apparence="p2" hint className="mt-1">
                  {props.typesEvents?.length > 1 ? "Downtimes" : "Downtime"}
                </TextSpan>
              </ColFlex>
            </Row>
          </CardBody>
        </CardNoShadow>
        {detailsStatus && (
          <CardNoShadow>
            <CardBody>
              <Row middle="xs" center="xs" className="pt-2 pb-2">
                <ColFlex breakPoint={{ xs: 2 }}>
                  <TextSpan
                    style={{
                      textAlign: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    {detailsStatus.icon}
                  </TextSpan>
                </ColFlex>
                <ColFlex breakPoint={{ xs: 9 }}>
                  <TextSpan apparence="h6">{detailsStatus.label}</TextSpan>
                  <TextSpan apparence="p2" hint className="mt-1">
                    {intl.formatMessage({ id: "last.status" })}
                  </TextSpan>
                </ColFlex>
              </Row>
            </CardBody>
          </CardNoShadow>
        )}
        {hasPermissionViewFinancial && props.viewLoss && (
          <CardNoShadow>
            <CardBody>
              <Row middle="xs" center="xs" className="pt-2 pb-2">
                <ColFlex breakPoint={{ xs: 2 }}>
                  <Money
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      fill: theme.colorSuccess500,
                    }}
                  />
                </ColFlex>
                <ColFlex breakPoint={{ xs: 9 }}>
                  <TextSpan apparence="h5">
                    {floatToStringExtendDot(totalRevenue, 2)}
                  </TextSpan>
                  <TextSpan apparence="p2" hint className="mt-1">
                    {intl.formatMessage({ id: "revenue" })} (BRL)
                  </TextSpan>
                </ColFlex>
              </Row>
            </CardBody>
          </CardNoShadow>
        )}
      </Col>
    </>
  );
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(MiniDashboards);
