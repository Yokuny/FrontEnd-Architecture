import { Card, CardBody, CardHeader } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Fetch, TextSpan } from "../../../../components";
import { TABLE, TBODY } from "../../../../components/Table";
import LoadingRows from "../../LoadingRows";
import ItemRowCO2 from "./ItemRowCO2";
import TableHeaderCO2 from "./TableHeaderCO2";
import FilterData from "../../../consumption/Interval/FilterData";
import Benchamark from "./Benchamark";

const CardBodyStyled = styled(CardBody)`
  margin-bottom: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  max-height: calc(100vh - 375px);
`

const CO2Emitted = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [filterQuery, setFilterQuery] = React.useState({
    dateMin: moment().subtract(1, 'month').format('YYYY-MM-DD'),
    dateMax: moment().format('YYYY-MM-DD'),
    unitSearch: {
      label: 'L',
      value: 'L'
    },
  })
  const [unit, setUnit] = React.useState({
    label: 'L',
    value: 'L'
  })
  const [orderColumn, setOrderColumn] = React.useState({
    column: "",
    order: "",
  });

  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (props.isReady)
      getData();
  }, [props.isReady, props.enterprises]);

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0]?.id
    : undefined;

  const getData = () => {
    if (!filterQuery?.dateMin || !filterQuery?.dateMax) {
      toast.warning(intl.formatMessage({ id: 'date.required' }))
      return
    }

    if (moment(filterQuery?.dateMin).isAfter(moment(filterQuery?.dateMax))) {
      toast.warning(intl.formatMessage({ id: 'date.end.is.before.date.start' }))
      return
    }

    setIsLoading(true)
    const query = []
    if (idEnterprise) {
      query.push(`idEnterprise=${idEnterprise}`)
    }

    if (filterQuery?.dateMin) {
      query.push(`dateMin=${moment(filterQuery?.dateMin).format('YYYY-MM-DDTHH:mm:ssZ')}`)
    }
    if (filterQuery?.dateMax) {
      query.push(`dateMax=${moment(filterQuery?.dateMax).format('YYYY-MM-DDTHH:mm:ssZ')}`)
    }
    if (filterQuery?.unitSearch) {
      query.push(`unit=${filterQuery?.unitSearch?.value}`)
    }
    if (filterQuery?.machines?.length) {
      filterQuery?.machines?.forEach(x => {
        query.push(`idMachine[]=${x.value}`)
      })
    }

    Fetch.get(`/consumption/co2?${query.join("&")}`)
      .then((res) => {
        setData(res.data)
        setUnit(filterQuery?.unitSearch)
      })
      .finally(() => {
        setIsLoading(false)
      })
  };

  const onChange = (name, value) => {
    setFilterQuery(prevState => ({ ...prevState, [name]: value }));
  }


  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1">
            CO₂
          </TextSpan>
        </CardHeader>
        <CardBodyStyled>
          <div className="ml-4 mr-4 mt-4">
            <FilterData
              onChange={onChange}
              filterQuery={filterQuery}
              idEnterprise={idEnterprise}
              onSearchCallback={getData}
            />
          </div>
        </CardBodyStyled>
        <CardBodyStyled>
          {isLoading ? (
            <TABLE>
              <TBODY>
                <LoadingRows />
              </TBODY>
            </TABLE>
          ) : (
            <>
              <TABLE>
                <TableHeaderCO2
                  setOrderColumn={setOrderColumn}
                  orderColumn={orderColumn}
                />
                <TBODY >
                  {data
                  ?.sort((a,b) => a?.machine?.name?.localeCompare(b?.machine?.name))
                  ?.map((x, i) => (
                    <ItemRowCO2 key={i} item={x} index={i} />
                  ))}
                  <Benchamark
                    unit={unit}
                    itens={data}
                  />
                </TBODY>
              </TABLE>
            </>

          )}
        </CardBodyStyled>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(CO2Emitted);
