import { Button, Card, CardBody, CardHeader, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { Fetch, TextSpan } from "../../../components";
import { TABLE, TBODY } from "../../../components/Table";
import LoadingRows from "../LoadingRows";
import CII_Header from "./CII_Header";
import Item_CII from "./Item_CII";
// import ModalFilter from '../EeoiCii/ModalFilter';

const CardBodyStyled = styled(CardBody)`
  margin-bottom: 0px;
  padding: 0px;
  max-height: calc(100vh - 290px);
`;

const ColumnFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

const CIIFleet = (props) => {
  const [isReady, setIsReady] = React.useState(false);
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [orderColumn, setOrderColumn] = React.useState({
    column: "",
    order: "",
  });
  const [filter, setFilter] = React.useState({
    filteredModel: [],
    filteredMachine: [],
  });

  React.useLayoutEffect(() => {
    setIsReady(true);
  }, []);

  React.useLayoutEffect(() => {
    if (props.isReady)
      getData(
        {
          idEnterprise: props.enterprises?.length
            ? props.enterprises[0]?.id
            : undefined,
        },
        filter
      );
  }, [props.isReady, isReady, props.enterprises]);

  const getData = (filterParams = undefined, filter = undefined) => {
    setIsLoading(true);
    let filtersQuery = [`idEnterprise=${filterParams.idEnterprise}`];
    if (filter?.filteredMachine?.length) {
      filter?.filteredMachine.forEach((x) => {
        filtersQuery.push(`idMachine[]=${x}`);
      });
    }
    Fetch.get(`/machine/fleet/cii?${filtersQuery.join("&")}`)
      .then((response) => {
        setData(response.data?.length ? response.data : []);
        setIsLoading(false);
        setFilter((prevState) => ({
          ...prevState,
          filteredMachine: filter?.filteredMachine || [],
        }));
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Row between="xs" middle="xs" className="m-0">
            <ColumnFlex>
              <TextSpan apparence="s1">
                <FormattedMessage id="fleet" /> CII
              </TextSpan>
            </ColumnFlex>
          </Row>
        </CardHeader>
        <CardBodyStyled>
          {isLoading ? (
            <TABLE>
              <TBODY>
                <LoadingRows />
              </TBODY>
            </TABLE>
          ) : (
            <TABLE>
              <CII_Header
                setOrderColumn={setOrderColumn}
                orderColumn={orderColumn}
              />
              <TBODY>
                {data?.map((x, i) => (
                  <Item_CII key={i} item={x} index={i} />
                ))}
              </TBODY>
            </TABLE>
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

export default connect(mapStateToProps, undefined)(CIIFleet);
