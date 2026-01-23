import { CardBody, Col, EvaIcon, Row } from "@paljs/ui";
import styled, { useTheme } from "styled-components";
import { CardNoShadow, Fetch, TextSpan } from "../../../../components";
import { CalendarClose, Platform } from "../../../../components/Icons";
import { useIntl } from "react-intl";
import React from "react";
import { useSearchParams } from "react-router-dom";

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
  height: 4rem;
`;

export const getJustifiedIcon = (theme) => {
  return (
    <EvaIcon
      name="bell-off-outline"
      options={{
        height: "1.5rem",
        width: "1.5rem",
        fill: theme.colorWarning500,
      }}
    />
  );
};

export const getInconsistencies = (theme, style = {}) => ({
  DATE_DIVERGENT: {
    icon: (
      <CalendarClose
        name="calendar-outline"
        style={{
          height: "1.5rem",
          width: "1.5rem",
          color: theme.colorWarning500,
          ...style,
        }}
      />
    ),
    text: "divergence.of.dates",
  },
  OPERATION_OUT_CONTRACT: {
    icon: (
      <EvaIcon
        name="alert-triangle-outline"
        options={{
          height: "1.5rem",
          width: "1.5rem",
          fill: theme.colorWarning500,
          ...style,
        }}
      />
    ),
    text: "operation.not.foreseen.in.the.contract",
  },
  UNIT_OUT_CONTRACT: {
    icon: (
      <Platform
        style={{
          height: "1.5rem",
          width: "1.5rem",
          fill: theme.colorWarning500,
          ...style,
        }}
      />
    ),
    text: "platform.not.provided.for.in.the.contract",
  },
});

export default function Inconsitences({ idForm, onFilter }) {
  const [dashboardData, setDashboardData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const theme = useTheme();
  const intl = useIntl();
  const [searchParams] = useSearchParams();

  const inconsistenceType = searchParams.get("inconsistenceType");

  React.useEffect(() => {
    getDashboardData();
  }, [searchParams]);

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

    setIsLoading(true);
    Fetch.get(`/formdata/inconsistencies?idForm=${idForm}&${filter.join("&")}`)
      .then((response) => {
        setDashboardData(response.data ? response.data : []);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const INCONSISTENCIES = getInconsistencies(theme);

  return (
    <>
      <Row>
        {Object.keys(INCONSISTENCIES).map((key) => {
          return (
            <Col
              onClick={() => onFilter(key)}
              style={{ cursor: "pointer" }}
              breakPoint={{ md: 4 }}
              key={key}
            >
              <CardNoShadow
                style={
                  inconsistenceType?.includes(key)
                    ? {
                        backgroundColor: theme.backgroundBasicColor3,
                      }
                    : {}
                }
              >
                <CardBody>
                  <Row middle="xs" center="xs" className="pt-2 pb-2">
                    <ColFlex breakPoint={{ xs: 2 }}>
                      {INCONSISTENCIES[key].icon}
                    </ColFlex>
                    <ColFlex breakPoint={{ xs: 9 }}>
                      <TextSpan apparence="h5">
                        {dashboardData?.find((x) => x._id === key)?.total || 0}
                      </TextSpan>
                      <TextSpan apparence="p2" hint className="mt-1">
                        {intl.formatMessage({
                          id: INCONSISTENCIES[key].text,
                        })}
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
