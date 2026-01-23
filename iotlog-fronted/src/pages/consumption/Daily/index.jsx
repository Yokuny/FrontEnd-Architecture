import { Card, CardBody, CardHeader, Checkbox, Col, Row } from '@paljs/ui';
import moment from 'moment';
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useTheme } from 'styled-components';

import { Fetch, LabelIcon, LoadingCard, TextSpan } from '../../../components';
import { useThemeSelected } from '../../../components/Hooks/Theme';
import { toast } from 'react-toastify';
import FilterData from './FilterData';
import ListPolling from './ListPolling';
import { getEChartsOptions } from './OptionsChart';
import Statistics from './Statistics';
import { ColFlex } from '../styles';

function ConsumptionDaily(props) {

  const theme = useTheme()
  const intl = useIntl()
  const themeSelected = useThemeSelected();

  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [filterQuery, setFilterQuery] = React.useState({
    dateMin: new Date(new Date().setDate(new Date().getDate() - 30)),
    dateMax: new Date(),
    machine: null,
    unitSearch: {
      label: "L",
      value: "L",
    },
  })
  const [isReal, setIsReal] = React.useState(true)
  const [isEstimated, setIsEstimated] = React.useState(true)

  const getData = () => {
    setData([])
    if (!filterQuery?.machine?.value) {
      return
    }

    setIsLoading(true)

    let querys = []
    if (filterQuery?.dateMin) {
      querys.push(`min=${moment(filterQuery?.dateMin).format('YYYY-MM-DDT00:00:00Z')}`)
    }
    if (filterQuery?.dateMax) {
      querys.push(`max=${moment(filterQuery?.dateMax).format('YYYY-MM-DDT23:59:59Z')}`)
    }
    if (filterQuery?.unitSearch) {
      querys.push(`unit=${filterQuery?.unitSearch?.value}`);
    }
    if (idEnterprise) {
      querys.push(`idEnterprise=${idEnterprise}`);
    }

    Fetch.get(`/consumption/daily/${filterQuery?.machine?.value}?${querys.join('&')}`)
      .then((response) => {
        setData(response?.data?.sort((a, b) => new Date(a.date) - new Date(b.date)) || [])
      })
      .catch((error) => {
        toast.error(intl.formatMessage({ id: "error.get" }))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onChange = (key, value) => {
    setFilterQuery(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const dataSorted = data?.sort((a, b) => new Date(a.date) - new Date(b.date));

  const echartsOptions = getEChartsOptions({
    theme,
    intl,
    data: dataSorted,
    machine: filterQuery?.machine,
    isReal,
    isEstimated,
    themeSelected
  })

  const hasPermissionEditor = props.items?.some((x) => x === "/edit-poll-consumption-daily");

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0]?.id
    : undefined;

  return (
    <Card>
      <CardHeader>
        <TextSpan apparence="s1">
          <FormattedMessage id="consumption.daily" />
        </TextSpan>
      </CardHeader>
      <CardBody>

        <FilterData
          onChange={onChange}
          filterQuery={filterQuery}
          idEnterprise={idEnterprise}
          onSearchCallback={getData}
        />

        <LoadingCard isLoading={isLoading}>
          <Row>
            <Col breakPoint={{ md: 12, xs: 12 }}>
              <LabelIcon
                iconName="eye-outline"
                title={intl.formatMessage({ id: "display" })}
              />
              <ColFlex>
                <Checkbox
                  checked={isReal}
                  onChange={(e) => setIsReal(!isReal)}
                >
                  <FormattedMessage id="real.consumption" />
                </Checkbox>
                <Checkbox
                  checked={isEstimated}
                  onChange={(e) => setIsEstimated(!isEstimated)}
                >
                  <FormattedMessage id="estimated.consumption" />
                </Checkbox>
              </ColFlex>
              <ReactECharts
                option={echartsOptions}
                style={{ height: 350 }}
                notMerge={true}
              />
            </Col>
            <Col breakPoint={{ md: 12, xs: 12 }} className="mt-4 mb-4">
              <Statistics
                data={data}
                machine={filterQuery?.machine}
                fetchData={getData}
                hasPermissionEditor={hasPermissionEditor}
              />
            </Col>
            <Col breakPoint={{ md: 12, xs: 12 }} className="mt-4">
              <ListPolling
                data={data}
                machine={filterQuery?.machine}
                fetchData={getData}
                hasPermissionEditor={hasPermissionEditor}
              />
            </Col>
          </Row>
        </LoadingCard>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(ConsumptionDaily);
