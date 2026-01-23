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
import { Fetch, TextSpan, LabelIcon } from "..";
import { floatToStringBrazilian } from "../Utils";
import { useThemeSelected } from "../Hooks/Theme";
import { buildDataSeriesFromKeyList } from "./Utils/FasKpi";

const FasValueCountChart = ({ filterOptions }) => {
  const theme = useTheme();
  const intl = useIntl();

  const HEADER_DEPENDANT_AXIS_OPTIONS = [
    { value: "month", label: intl.formatMessage({ id: "month" }) },
    { value: "year", label: intl.formatMessage({ id: "year" }) },
    { value: "vessel", label: intl.formatMessage({ id: "vessel" }) },
  ];

  const [dependantAxis, setDependantAxis] = React.useState(
    HEADER_DEPENDANT_AXIS_OPTIONS[0]
  );
  const [dataSeries, setDataSeries] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const dataRef = React.useRef([]);

  const { isDark } = useThemeSelected();

  React.useEffect(() => {
    getData();
  }, [filterOptions, dependantAxis]);

  const getData = () => {
    // Parse filters
    let queryString = `?dependantAxis=${dependantAxis?.value}&`;
    if (filterOptions) {
      Object.entries(filterOptions).forEach(([key, value]) => {
        queryString += `${key}=${value}&`;
      });
    }

    setIsLoading(true);
    Fetch.get(`/fas/analytics/fas-value-grouped-count${queryString}`).then(
      (response) => {
        const dateSeries = buildDataSeriesFromKeyList(
          response.data,
          ["totalWithPaymentDate", "totalWithoutPaymentDate"],
          intl
        );
        setDataSeries(dateSeries);

        const countDataSeriesBuilder = {
          type: "line",
          name: intl.formatMessage({ id: "fas.quantity" }),
          data: response.data.map((groupData) => groupData.count),
        };

        dataRef.current = response.data;
        setDataSeries([...dateSeries, countDataSeriesBuilder]);
        setIsLoading(false);
      }
    );
  };

  const optionsCompletedChart = {
    ...getBaseOptions({
      theme,
      colors: [
        theme.colorPrimary500,
        theme.colorDanger500,
        theme.colorSuccess500,
      ],
      enabledOnSeries: [0, 1],
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
        intl.formatMessage({ id: "fas.quantity" }),
      ],
      categories: formatDependantAxisCategories(
        dataRef.current,
        dependantAxis.value
      ),
    }),
    stacked: true,
    theme: {
      mode: isDark ? "dark" : "light",
    },
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
            options={HEADER_DEPENDANT_AXIS_OPTIONS}
            size="Tiny"
            placeholder={intl.formatMessage({ id: "fas.chart.dependantAxis" })}
          />
        </Col>
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
                series={dataSeries}
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

export default FasValueCountChart;
