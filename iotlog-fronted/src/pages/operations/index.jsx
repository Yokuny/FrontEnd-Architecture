import { Card, CardBody, CardHeader, Col, EvaIcon, Row, Tooltip, Button } from "@paljs/ui";
import moment from "moment";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { Fetch, TextSpan } from "../../components";
import { MapMarkerDistance } from "../../components/Icons";
import { floatToStringExtendDot } from "../../components/Utils";
import { AcitivitiesModal } from "./ActivitiesModal";
import { Filter } from "./Filter";


const Img = styled.img`
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;
  object-fit: cover;
`;

const Tip = ({ children, contentMessage }) => {
  return (
    <>
      <Tooltip placement="top" content={contentMessage} trigger="hint">
        {children}
      </Tooltip>
    </>
  );
};

const CardsRow = styled(Row)`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  flex-wrap: wrap;
  gap: 1.4rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 1rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const MetricContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.1rem;
`;

export default function Operations() {
  const intl = useIntl();
  const theme = useTheme();

  const CardContainer = styled(Card)`
    flex: 1 1 calc(33.333% - 1rem);
    min-width: 280px;
    max-width: 420px;
    box-shadow: none;
    border: 1px solid ${theme.borderBasicColor3};
    border-radius: 0.25rem;

    &:hover {
      cursor: pointer;
    }

    @media (max-width: 768px) {
      min-width: 100%;
      max-width: 100%;
    }
  `;

  const CardHeaderStyled = styled("div")`
    padding: 1rem .45rem;
    /* border-bottom: 1px solid ${theme.borderBasicColor3}; */

    .flex-col {
      display: flex;
      flex-direction: column;
    }

    .flex-row {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
    }

    @media (max-width: 768px) {
      padding: 0.5rem 1rem;
    }
  `;

  const InfoBox = styled.div`
    display: flex;
    align-items: start;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 0.5rem;
    background-color: ${theme.backgroundBasicColor1};
    /* border: 1px solid ${theme.borderBasicColor3}; */
    border-radius: 0.25rem;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      gap: 0.25rem;
    }
  `;

  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const query = [];

    if (filter?.machine?.length) {
      query.push(`machines=${filter.machine.map((machine) => machine.value).join(",")}`);
    }

    if (filter?.dateMax) {
      query.push(`dateMax=${new Date(filter.dateMax).toISOString()}`);
    }

    if (filter?.dateMin) {
      query.push(`dateMin=${new Date(filter.dateMin).toISOString()}`);
    }

    Fetch.get(`/operations${query ? "?" + query.join("&") : ""}`)
      .then((response) => {
        setData(response.data);
      })
      .catch(() => { });
  };

  const handleCloseModal = () => {
    setSelectedData(null);
  };

  const handleFilter = (prop, value) => {
    setFilter({
      ...filter,
      [prop]: value,
    });
  };

  const idEnterprise = localStorage.getItem("id_enterprise_filter");

  return (
    <>
      <Card>
        <CardHeader>
          <Filter onChange={handleFilter} filterQuery={filter} idEnterprise={idEnterprise} onSearchCallback={getData} />
        </CardHeader>
        <CardBody>
          <CardsRow>
            {data.map((item) =>
              item.jobs.map((job) => (
                <CardContainer key={job.id} onClick={() => setSelectedData(job)}>
                  <CardHeaderStyled>
                    <Row className="m-0" between="xs" middle="xs">
                      <Col
                        breakPoint={{ xs: 6, sm: 6 }} className="p-0 flex-col">
                        <Row className="m-0 flex-row" middle="xs">
                          <Img src={job.resource.image?.url || "https://siot-file.konztec.com/machine/2023/10/19/20231019_201444_040e2f207d974b7cb27ed76358536ace.jpg"} alt={job.resource.name} />
                          <Col className="p-0 flex-col">
                            <TextSpan apparence="s1">
                              {`OS ${item.tripNumber}`}
                            </TextSpan>
                            <TextSpan apparence="p2" hint>{job.resource.name}</TextSpan>
                          </Col>
                        </Row>
                      </Col>
                      <Col
                        className="flex-col"
                        breakPoint={{ xs: 6, sm: 6 }}>
                        <Row className="m-0" end="xs">
                          <Button
                            appearance="outline"
                            status="Info"
                            size="Tiny"
                            style={{ border: "none" }}
                          >
                            {item.tripType.name}
                          </Button>
                        </Row>
                      </Col>
                    </Row>
                  </CardHeaderStyled>
                  <CardBody>
                    <InfoGrid>
                      <Tip
                        contentMessage={intl.formatMessage({
                          id: "hour.unity",
                        })}>
                        <InfoBox>
                          <EvaIcon name="clock-outline" status="Info" />
                          <MetricContainer>
                            <TextSpan apparence="s1">
                              {floatToStringExtendDot(moment(job.endDate).diff(job.startDate, "hours", true), 2)}
                            </TextSpan>
                            <TextSpan apparence="p2" hint>
                              HR
                            </TextSpan>
                          </MetricContainer>
                        </InfoBox>
                      </Tip>

                      <Tip
                        contentMessage={intl.formatMessage({
                          id: "real.consumption",
                        })}>
                        <InfoBox>
                          <EvaIcon name="droplet" status="Primary" />
                          <MetricContainer>
                            <TextSpan apparence="s1">{floatToStringExtendDot(job.consumption, 3)}</TextSpan>
                            <TextSpan apparence="p2" hint>
                              m³
                            </TextSpan>
                          </MetricContainer>
                        </InfoBox>
                      </Tip>

                      <Tip
                        contentMessage={intl.formatMessage({
                          id: "distance",
                        })}>
                        <InfoBox>
                          <MapMarkerDistance
                            style={{
                              marginLeft: 1,
                              height: 17,
                              width: 17,
                              fill: theme.colorSuccess600,
                            }}
                          />
                          <MetricContainer>
                            <TextSpan apparence="s1">{floatToStringExtendDot(job.distance, 2)}</TextSpan>
                            <TextSpan apparence="p2" hint>
                              nm
                            </TextSpan>
                          </MetricContainer>
                        </InfoBox>
                      </Tip>
                    </InfoGrid>
                  </CardBody>
                </CardContainer>
              ))
            )}
          </CardsRow>
        </CardBody>
      </Card>

      {selectedData && <AcitivitiesModal data={selectedData} onClose={handleCloseModal} />}
    </>
  );
}
