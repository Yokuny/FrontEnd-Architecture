import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  Row,
  Select,
} from "@paljs/ui";
import cryptoJs from "crypto-js";
import moment from "moment";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { FormattedMessage, useIntl } from "react-intl";
import { Fetch, LabelIcon, SpinnerFull, TextSpan } from "../../../components";
import { getColorByTypeVessel } from "../../fleet/Map/Fences/Utils";
import { VesselComing } from "./VesselComing";
import { ports } from "./ports";
import { VesselInPort } from "./VesselInPort";
import { VesselAtAnchor } from "./VesselAtAnchor";

const _WBy_g = (a, y) => {
  try {
    return cryptoJs.AES.decrypt(a, `${process.env.REACT_APP_SECRET_KEY_REQUEST}_${y}`).toString(cryptoJs.enc.Utf8);
  } catch (e) {
    return "";
  }
};

const PortsVesselsComing = (props) => {
  const [portCode, setPortCode] = React.useState();
  const [vesselEncData, setVesselEncData] = React.useState({
    data: {
      incoming: [],
      inPort: [],
      atAnchor: [],
    },
    timestamp: 0,
  });
  const [inPortData, setInPortData] = React.useState([]);
  const [atAnchorData, setAtAnchorData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [vesselData, setVesselData] = React.useState();
  const [typeFilter, setTypeFilter] = React.useState([]);

  const intl = useIntl();

  React.useEffect(() => {
    if (vesselEncData?.data) {
      try {
        if (vesselEncData.data.incoming) {
          const data = decryptData(
            vesselEncData.data.incoming,
            vesselEncData.timestamp
          );

          setVesselData(data);
        }

        if (vesselEncData.data.inPort) {
          const data = decryptData(
            vesselEncData.data.inPort,
            vesselEncData.timestamp
          );

          setInPortData(data);
        }

        if (vesselEncData.data.atAnchor) {
          const data = decryptData(
            vesselEncData.data.atAnchor,
            vesselEncData.timestamp
          );

          setAtAnchorData(data);
        }
      } catch { }
    }
  }, [vesselEncData]);

  const getVesselsInFence = async () => {
    if (portCode?.length < 5) return;

    const timestamp = new Date().getTime();

    setIsLoading(true);

    const incoming = Fetch.get(
      `/integrationthird/ais/port/incoming?code=${portCode}`,
      {
        headers: {
          timestamp,
        },
      }
    );

    const inPort = Fetch.get(
      `/integrationthird/ais/port/inport?code=${portCode}`,
      {
        headers: {
          timestamp,
        },
      }
    );

    const atAnchor = Fetch.get(
      `/integrationthird/ais/port/atanchor?code=${portCode}`,
      {
        headers: {
          timestamp,
        },
      }
    );

    const [incomingData, inPortData, atAnchorData] = await Promise.all([
      incoming,
      inPort,
      atAnchor,
    ]);

    setVesselEncData({
      data: {
        incoming: incomingData.data || null,
        inPort: inPortData.data || null,
        atAnchor: atAnchorData.data || null,
      },
      timestamp,
    });

    setIsLoading(false);
  };

  const decryptData = (data, timestamp) => {
    try {
      const parse = JSON.parse(_WBy_g(data, Number(timestamp) - 1078));

      if (parse?.vessels?.length && Array.isArray(parse?.vessels)) {

        return parse.vessels;
      }
    } catch {
      return [];
    }
  };

  const segments = [
    ...new Set(vesselData?.map((x) => x.vessel?.segment?.label)),
  ]?.sort((a, b) => a.localeCompare(b));

  const segmentsBySeries = segments?.map((seg, i) => ({
    name: seg,
    data: vesselData?.filter((y) => y.vessel?.segment?.label === seg),
  }));

  const series = segments?.map((seg, i) => ({
    name: seg,
    data: vesselData
      ?.filter((y) => y.vessel?.segment?.label === seg)
      .map((y) => [y.vessel.distance, i + 10]),
  }));

  const options = {
    chart: {
      id: "scatter",
      type: "scatter",
      height: 350,
      zoom: {
        enabled: true,
      },
    },
    colors: segments?.map((seg) => getColorByTypeVessel(seg)),
    xaxis: {
      tickAmount: 10,
      min: 0,
    },
    yaxis: {
      show: false,
      tickAmount: segments?.length + 1,
      min: 10,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
        formatter: (val, { seriesIndex }) => ``,

        // `<strong>${intl.formatMessage({ id: "distance" })}</strong>: ${parseFloat(val).toFixed(1)}<i>nm</i>`
      },
      y: {
        formatter: () => ``,
        title: {
          formatter: (value, { seriesIndex, dataPointIndex }) => {
            const item = segmentsBySeries[seriesIndex]?.data[dataPointIndex];

            return `<strong>${item?.vessel?.name}</strong><br/><i>${item?.vessel?.segment?.label
              }</i><br/>
            <strong>ETA</strong>: ${item?.vessel?.aisReport?.eta
                ? moment(item?.vessel?.aisReport?.eta).format("DD MMM, HH:mm")
                : "-"
              }<br/>
          <strong>${intl.formatMessage({
                id: "distance",
              })}</strong>: ${item?.vessel?.distance.toFixed(1)}<i>nm</i>`;
          },
        },
      },
    },
    title: {
      text: intl.formatMessage({ id: "distance" }),
      align: "center",
    },
  };

  const optionsPorts = ports
    .map((c) => ({ value: c.LOCODE, label: `${c.PORTOS} (${c.LOCODE})` }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1">
            <FormattedMessage id="port.vessels.coming" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ xs: 10, md: 10 }} className="mb-2">
              <Select
                options={optionsPorts}
                menuPosition="fixed"
                placeholder={intl.formatMessage({
                  id: "port",
                })}
                noOptionsMessage={() =>
                  intl.formatMessage({
                    id: "nooptions.message",
                  })
                }
                onChange={(e) => setPortCode(e.value)}
                value={optionsPorts.find((c) => c.value === portCode)}
              />
            </Col>
            <Col breakPoint={{ xs: 2, md: 2 }} className="mb-2">
              <Button
                className="flex-between ml-4"
                onClick={getVesselsInFence}
                size="Small"
                status="Success"
              >
                <EvaIcon name="search-outline" className="mr-1" />
                <FormattedMessage id="search" />
              </Button>
            </Col>
            <Col breakPoint={{ xs: 12, md: 12 }} className="mt-4">
              {!!vesselData?.length && (
                <ReactApexChart
                  options={options}
                  series={series}
                  type="scatter"
                  height={350}
                />
              )}
            </Col>
          </Row>
          {segments?.length > 1 && (
            <Row>
              <Col breakPoint={{ xs: 12, md: 12 }} className="mt-4">
                <LabelIcon
                  title={intl.formatMessage({ id: "filter" })}
                  iconName="funnel-outline"
                />
                <Select
                  options={segments?.map((seg) => ({ value: seg, label: seg }))}
                  isMulti
                  placeholder={intl.formatMessage({
                    id: "type",
                  })}
                  noOptionsMessage={() =>
                    intl.formatMessage({
                      id: "nooptions.message",
                    })
                  }
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e)}
                />
              </Col>
            </Row>
          )}
          {!!vesselData?.length && (
            <VesselComing
            data={vesselData}
            typeFilter={typeFilter} />
          )}

          {!!inPortData?.length && (
            <VesselInPort
              data={inPortData}
              typeFilter={typeFilter} />
          )}

          {!!atAnchorData?.length && (
            <VesselAtAnchor
              data={atAnchorData}
              typeFilter={typeFilter} />
          )}
        </CardBody>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default PortsVesselsComing;
