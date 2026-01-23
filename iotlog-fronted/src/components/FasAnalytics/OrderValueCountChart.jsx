import * as React from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { FormattedMessage } from "react-intl";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { SkeletonThemed } from "../Skeleton";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import {
  getBaseOptions,
  getMultiYAxisBarChartOptions,
  formatDependantAxisCategories,
} from "./Utils/FasKpiBaseOptions";
import { Fetch, TextSpan, LabelIcon, Toggle} from "..";
import { floatToStringBrazilian } from "../Utils";
import { useThemeSelected } from "../Hooks/Theme";
import { buildDataSeriesFromKeyList } from "./Utils/FasKpi";

const OrderValueCountChart = ({ filterOptions }) => {
  const theme = useTheme();
  const intl = useIntl();

  const ORDER_DEPENDANT_AXIS_OPTIONS = [
    { value: "month", label: intl.formatMessage({ id: "month" }) },
    { value: "year", label: intl.formatMessage({ id: "year" }) },
    { value: "vessel", label: intl.formatMessage({ id: "vessel" }) },
    { value: "supplier", label: intl.formatMessage({ id: "supplier" }) },
  ];

  const [dependantAxis, setDependantAxis] = React.useState(
    ORDER_DEPENDANT_AXIS_OPTIONS[0]
  );
  const [optionsCompletedChart, setOptionsCompletedChart] = React.useState({});
  const [dataSeries, setDataSeries] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showValueByPayment, setShowValueByPayment] = React.useState(false);
  const [valueByPaymentData, setValueByPaymentData] = React.useState(null);

  const { isDark } = useThemeSelected();

  React.useEffect(() => {
    getData();
  }, [filterOptions, dependantAxis]);

  React.useEffect(() => {
    if (showValueByPayment) {
      getValueByPaymentData()
    } else {
      setValueByPaymentData(null);
    }
  }, [showValueByPayment, filterOptions, dependantAxis]);

  const fullDateSeries = React.useMemo(() => {
    if (valueByPaymentData && ["month", "year"].includes(dependantAxis.value)) return [...dataSeries, valueByPaymentData]
    return dataSeries;
  }, [dataSeries, valueByPaymentData, dependantAxis]);


  const getValueByPaymentData = () => {
    //Só buscar no endpooint e fazer o parsing
    let queryString = `?dependantAxis=${dependantAxis?.value}&`;
    if (filterOptions) {
      Object.entries(filterOptions).forEach(([key, value]) => {
        queryString += `${key}=${value}&`;
      });
    }

    setIsLoading(true);
    Fetch.get(`fas/analytics/order-value-grouped-count-by-payment-date${queryString}`).then(
      (response) => {
        const countByPaymentDateDataSeriesBuilder = {
          type: "line",
          name: intl.formatMessage({ id: "value.by.payment.date" }),
          data: response.data.map((groupData) => groupData.total),
        };

        setValueByPaymentData(countByPaymentDateDataSeriesBuilder)

        setIsLoading(false)
    }).catch((err) => setIsLoading(false));
    return [];
  }


  const getData = () => {
    // Parse filters
    let queryString = `?dependantAxis=${dependantAxis?.value}&`;
    if (filterOptions) {
      Object.entries(filterOptions).forEach(([key, value]) => {
        queryString += `${key}=${value}&`;
      });
    }

    setIsLoading(true);
    Fetch.get(`/fas/analytics/order-value-grouped-count${queryString}`).then(
      (response) => {
        //TODO: not working - no bars
        const dateSeriesBuilder = buildDataSeriesFromKeyList(
          response.data,
          ["totalWithPaymentDate", "totalWithoutPaymentDate"],
          intl
        );

        setDataSeries(dateSeriesBuilder);

        const countDataSeriesBuilder = {
          type: "line",
          name: intl.formatMessage({ id: "os.quantity" }),
          data: response.data.map((groupData) => groupData.count),
        };

        setDataSeries([...dateSeriesBuilder, countDataSeriesBuilder]);

        setOptionsCompletedChart({
          ...getBaseOptions({
            theme,
            colors: [
              theme.colorPrimary500,
              theme.colorDanger500,
              theme.colorSuccess500,
              theme.colorWarning500,
            ],
            enabledOnSeries: [0, 1, 2, 3,],
            dataLabelFormatter: (value) => {
              if (!value) return "0";
              if (value > 1_000_000) {
                return floatToStringBrazilian(value / 1_000_000, 1) + " M";
              }
              if (value > 1_000) {
                return floatToStringBrazilian(value / 1_000, 1) + " K";
              }
              return parseInt(value);
            },
          }),
          ...getMultiYAxisBarChartOptions({
            theme,
            labels: [
              `${intl.formatMessage({ id: "fas.value" })} (R$)`,
              intl.formatMessage({ id: "os.quantity" }),
            ],
            categories: formatDependantAxisCategories(
              response.data,
              dependantAxis.value
            ),
            curve: "straight"
          }),
          stacked: true,
          theme: {
            mode: isDark ? "dark" : "light",
          },
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      <Row>
        <Col className="mb-4" breakPoint={{ md: 4 }}>
          <LabelIcon
            title={<FormattedMessage id="fas.chart.dependantAxis" />}
          />
          <Select
            value={dependantAxis}
            onChange={setDependantAxis}
            options={ORDER_DEPENDANT_AXIS_OPTIONS}
            size="Tiny"
            placeholder={intl.formatMessage({ id: "fas.chart.dependantAxis" })}
          />
        </Col>
        {["month", "year"].includes(dependantAxis.value) && <Col className="mb-4" breakPoint={{ md: 4 }}>
          <LabelIcon
            title={<FormattedMessage id="value.by.payment.date" />}
          />
          <Toggle
            className="mt-2"
            checked={showValueByPayment}
            onChange={() => setShowValueByPayment(!showValueByPayment)}
          />
        </Col>}
        <TextSpan
          apparence="c2"
          style={{ width: `100%` }}
          className={"ml-4 mb-2"}
        >
          <FormattedMessage id="fas.bms.value.chart" />
        </TextSpan>
      </Row>
      <Row>
        <Col breakPoint={{ md: 12 }}>
          {isLoading ? (
            <SkeletonThemed width="100%" height="500px" />
          ) : (
            optionsCompletedChart &&
            dataSeries && (
              <ReactApexCharts
                type="line"
                options={optionsCompletedChart}
                series={fullDateSeries}
                width="100%"
                height="500px"
              />
            )
          )}
        </Col>
      </Row>
    </>
  );
};

export default OrderValueCountChart;
