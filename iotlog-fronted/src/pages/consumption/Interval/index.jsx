import { Card, CardBody, CardHeader, Checkbox, Col, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useTheme } from "styled-components";
import {
  DownloadCSV,
  Fetch,
  LabelIcon,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import FilterData from "./FilterData";
import ListByVessels from "./ListByVessels";
import MiniDashboards from "./MiniDashboards";
import TableListConsumption from "./TableListConsumption";
import { ColFlex } from "../styles";

const ConsumptionInterval = (props) => {
  const [data, setData] = React.useState();
  const [filterQuery, setFilterQuery] = React.useState({
    dateMin: moment().subtract(1, "month").format("YYYY-MM-DD"),
    dateMax: moment().format("YYYY-MM-DD"),
    unitSearch: {
      label: "L",
      value: "L",
    },
  });
  const [isReal, setIsReal] = React.useState(true);
  const [isEstimated, setIsEstimated] = React.useState(true);
  const [unit, setUnit] = React.useState({
    label: "L",
    value: "L",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();
  const theme = useTheme();

  React.useEffect(() => {
    if (props.isReady) {
      getData();
    }
  }, [props.enterprises, props.isReady]);

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0]?.id
    : undefined;

  const getData = () => {
    if (!filterQuery?.dateMin || !filterQuery?.dateMax) {
      toast.warning(intl.formatMessage({ id: "date.required" }));
      return;
    }

    if (moment(filterQuery?.dateMin).isAfter(moment(filterQuery?.dateMax))) {
      toast.warning(
        intl.formatMessage({ id: "date.end.is.before.date.start" })
      );
      return;
    }

    setIsLoading(true);
    const query = [];
    if (filterQuery?.dateMin) {
      query.push(
        `dateMin=${moment(filterQuery?.dateMin).format("YYYY-MM-DDT00:00:00Z")}`
      );
    }
    if (filterQuery?.dateMax) {
      query.push(
        `dateMax=${moment(filterQuery?.dateMax).format("YYYY-MM-DDT23:59:59Z")}`
      );
    }
    if (filterQuery?.unitSearch) {
      query.push(`unit=${filterQuery?.unitSearch?.value}`);
    }
    if (filterQuery?.machines?.length) {
      filterQuery?.machines?.forEach((x) => {
        query.push(`idMachine[]=${x.value}`);
      });
    }

    if (idEnterprise) {
      query.push(`idEnterprise=${idEnterprise}`);
    }

    Fetch.get(`/consumption?${query.join("&")}`)
      .then((res) => {
        setData(res.data);
        setUnit(filterQuery?.unitSearch);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onChange = (name, value) => {
    setFilterQuery((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <FormattedMessage id="consumption" />
        </CardHeader>
        <CardBody className="mb-0">
          <FilterData
            onChange={onChange}
            filterQuery={filterQuery}
            idEnterprise={idEnterprise}
            onSearchCallback={getData}
          />

          {/*<Row>
             <Col breakPoint={{ md: 12 }}>
              <LabelIcon
                iconName="eye-outline"
                title={intl.formatMessage({ id: "view" })}
              />
              <ColFlex>
                <Checkbox checked={isReal} onChange={(e) => setIsReal(!isReal)}>
                  <FormattedMessage id="real.consumption" />
                </Checkbox>
                <Checkbox
                  checked={isEstimated}
                  onChange={(e) => setIsEstimated(!isEstimated)}
                >
                  <FormattedMessage id="estimated.consumption" />
                </Checkbox>
              </ColFlex>
            </Col>
          </Row>

          {isReal && (
            <>
              <div className="mt-4"></div>

              <TextSpan
                style={{
                  color: theme["colorPrimary500"],
                }}
                apparence="s2"
              >
                {intl.formatMessage({ id: "polling" }).toLocaleUpperCase()}
              </TextSpan>

              <MiniDashboards data={data} unit={unit} isReal={isReal} />

              <ListByVessels data={data} unit={unit} isReal />
            </>
          )}
          {isEstimated && (
            <>
              {!isReal && <div className="mt-4"></div>}

              <TextSpan
                style={{
                  color: theme["colorWarning500"],
                }}
                apparence="s2"
              >
                {intl.formatMessage({ id: "flowmeter" }).toLocaleUpperCase()}
              </TextSpan>

              <MiniDashboards data={data} unit={unit} isReal={false} />

              <ListByVessels data={data} unit={unit} isReal={false} />
            </>
          )} */}

          {!!data?.length && (
            <>
              <TableListConsumption
                data={data}
                unitSelected={unit}
                isReal={isReal}
                isEstimated={isEstimated}
              />
              <DownloadCSV
                getData={() =>
                  data.map((x) => ({
                    date: moment(x?.date).format("YYYY-MM-DD"),
                    vessel: x?.machine?.name,
                    hours: x?.hours,
                    consumptionReal: x?.consumptionReal?.value,
                    consumptionRealType: x?.consumptionReal?.type,
                    consumptionEstimated: x?.consumption?.value,
                    consumptionEstimatedType: x?.consumption?.type,
                    consumptionEstimatedUnit: unit?.label,
                    consumptionEstimatedCo2: x?.consumption?.co2,
                    stock: x?.oil?.stock,
                    ...x?.engines?.reduce((acc, engine) => {
                      acc[engine?.description] = engine?.consumption?.value;
                      acc[`${engine?.description}HR`] = engine?.hours;
                      return acc;
                    }, {}),
                  })) || []
                }
                fileName={`consumption_interval_${moment().format(
                  "YYYYMMMDDHHmmss"
                )}`}
                className="mr-3 mt-4"
              />
            </>
          )}

          <SpinnerFull isLoading={isLoading} />
        </CardBody>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ConsumptionInterval);
