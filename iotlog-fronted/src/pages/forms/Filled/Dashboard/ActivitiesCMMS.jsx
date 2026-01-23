import { CardBody, Col, EvaIcon, Row } from "@paljs/ui";
import styled, { useTheme } from "styled-components";
import { CardNoShadow, Fetch, LabelIcon, TextSpan } from "../../../../components";
import { FormattedMessage, useIntl } from "react-intl";
import React from "react";
import { useSearchParams } from "react-router-dom";

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
  height: 4rem;
`;

export const getStatus = (status) => {
  switch (status) {
    case "Diagnóstico":
    case "Diagnostico":
      return {
        icon: (
          <EvaIcon
            name="search-outline"
            status="Basic"
            options={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          />
        )
      }
    case "Programação":
      return {
        icon: (
          <EvaIcon
            name="calendar-outline"
            status="Primary"
            options={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          />
        ),
      }
    case "Executado":
      return {
        icon: (
          <EvaIcon
            name="checkmark-circle-outline"
            status="Success"
            options={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          />
        ),
      }
    case "Monitoramento":
      return {
        icon: (
          <EvaIcon
            name="activity-outline"
            status="Warning"
            options={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          />
        ),
      }
    case "Planejamento":
      return {
        icon: (
          <EvaIcon
            name="edit-2-outline"
            status="Info"
            options={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          />
        ),
      }
    default: {
      return {
        icon: (
          <EvaIcon
            name="alert-triangle-outline"
            status="Danger"
            options={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          />
        )
      }
    }
  }
};


export default function ActivitiesCMMS({ idForm, onFilter: parentOnFilter }) {

  const onFilter = (value, type) => {
    const queryValue = value === intl.formatMessage({ id: "undefined" }) ? "empty" : value;
    parentOnFilter(queryValue, type);
  };
  const [dashboardData, setDashboardData] = React.useState({
    typeMaintenance: [],
    status: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const tipoManutencaoParam = searchParams.get("tipoManutencao");
  const finishedAt = searchParams.get("finishedAt");
  const equipmentCritical = searchParams.get("equipmentCritical");
  const osCodeJobId = searchParams.get("osCodeJobId");

  const intl = useIntl();

  React.useEffect(() => {
    getDashboardData();
  }, [searchParams]);

  const processDataGroup = (data) => {
    if (!Array.isArray(data)) return [];

    const { defined, undefined } = data.reduce((acc, item) => {
      if (!item.text || item.text.trim() === "") {
        return {
          ...acc,
          undefined: {
            text: intl.formatMessage({ id: "undefined" }),
            total: (acc.undefined.total || 0) + (item.total || 0)
          }
        };
      }
      return {
        ...acc,
        defined: [...acc.defined, item]
      };
    }, { defined: [], undefined: { text: intl.formatMessage({ id: "undefined" }), total: 0 } });

    return undefined.total > 0
      ? [...defined, undefined]
      : defined;
  };

  const getDashboardData = () => {
    const filter = [];

    const machines = searchParams.get("machines");
    const initialDate = searchParams.get("initialDate");
    const finalDate = searchParams.get("finalDate");

    if (machines) {
      filter.push(`machines=${machines}`);
    }

    if (initialDate) {
      filter.push(`dateStart=${new Date(initialDate).toISOString()}`);
    }

    if (finalDate) {
      filter.push(`dateEnd=${new Date(finalDate).toISOString()}`);
    }

    if (statusParam) {
      filter.push(`status=${statusParam}`);
    }

    if (tipoManutencaoParam) {
      filter.push(`tipoManutencao=${tipoManutencaoParam}`);
    }

    if (finishedAt) {
      filter.push(`finishedAt=${finishedAt}`);
    }

    if (osCodeJobId) {
      filter.push(`osCodeJobId=${osCodeJobId}`);
    }

    if (equipmentCritical) {
      filter.push(`equipmentCritical=${equipmentCritical}`);
    }

    setIsLoading(true);
    Fetch.get(`/formdata/cmms/${idForm}/activities?${filter.join("&")}`)
      .then((response) => {
        const data = response.data || {};
        setDashboardData({
          status: processDataGroup(data.status),
          typeMaintenance: processDataGroup(data.typeMaintenance)
        });
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };


  const totalStatus = dashboardData?.status?.length
  const totalTypeMaintenance = dashboardData?.typeMaintenance?.length

  return (
    <>
      <Row className="m-0 pt-2 pl-4 pr-2">
        <LabelIcon
          title={"Status"}
        />
      </Row>
      <Row className="m-0 pt-2 pl-2 pr-2">
        {dashboardData?.status?.map((item, idx) => {

          return (
            <Col
              onClick={() => onFilter(item.text, 'status')}
              style={{ cursor: "pointer" }}
              breakPoint={{ md: 12 / totalStatus }}
              key={idx + 's'}
            >
              <CardNoShadow
                style={
                  (statusParam === item.text || (statusParam === "empty" && item.text === intl.formatMessage({ id: "undefined" })))
                    ? {
                      backgroundColor: theme.backgroundBasicColor3,
                    }
                    : {}
                }
              >
                <CardBody style={{ paddingBottom: "0px" }}>
                  <Row middle="xs" center="xs" className="pt-2">
                    <ColFlex breakPoint={{ xs: 2 }}>
                      {getStatus(item.text)?.icon}
                    </ColFlex>
                    <ColFlex breakPoint={{ xs: 9 }}>
                      <TextSpan apparence="h5">
                        {item?.total || 0}
                      </TextSpan>
                      <TextSpan apparence="p2" hint className="mt-1">
                        {item.text}
                      </TextSpan>
                    </ColFlex>
                  </Row>
                </CardBody>
              </CardNoShadow>
            </Col>
          );
        })}
      </Row>
      <Row className="m-0 pl-4 pr-2">
        <LabelIcon
          title={
            <FormattedMessage
              id="activities"
            />
          }
        />
      </Row>
      <Row className="m-0 pt-2 pl-2 pr-2">
        {dashboardData?.typeMaintenance?.map((item, idx) => {
          return (
            <Col
              onClick={() => onFilter(item.text, 'tipoManutencao')}
              style={{ cursor: "pointer" }}
              breakPoint={{
                md: ((12 / totalTypeMaintenance) < 2)
                  ? 2
                  : 12 / totalTypeMaintenance
              }}
              key={idx}
            >
              <CardNoShadow
                style={
                  (tipoManutencaoParam === item.text || (tipoManutencaoParam === "empty" && item.text === intl.formatMessage({ id: "undefined" })))
                    ? {
                      backgroundColor: theme.backgroundBasicColor3,
                    }
                    : {}
                }
              >
                <CardBody style={{ paddingBottom: "0px" }}>
                  <Row middle="xs" center="xs">
                    <ColFlex breakPoint={{ xs: 11 }}>
                      <TextSpan apparence="h6" hint>
                        {item?.total || 0}
                      </TextSpan>
                      <TextSpan apparence="p2" hint className="mt-1 ml-1">
                        {item.text}
                      </TextSpan>
                    </ColFlex>
                  </Row>
                </CardBody>
              </CardNoShadow>
            </Col>
          );
        })}
      </Row>

    </>
  );
}
