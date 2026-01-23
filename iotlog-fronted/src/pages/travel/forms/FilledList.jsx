import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import React from "react";
import { connect } from "react-redux";
import styledComponents from "styled-components";
import { Fetch } from "../../../components";
import {
  TABLE,
} from "../../../components/Table";
import ContentHeader from "../../statistics/ContentHeader";
import LoadingRows from "../../statistics/LoadingRows";
import ContentList from "./ContentList";

const CardBodyStyled = styledComponents(CardBody)`
  margin-bottom: 0px;
  padding-top: 0px;
  max-height: calc(100vh - 282px);
`

const FormTravelFilledList = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    if (props.isReady) {
      getData();
    }
  }, [props.enterprises, props.isReady]);

  const getData = (filters) => {
    setIsLoading(true);
    const queryModels = filters?.filteredModel
      ?.map((x, i) => `idModel[]=${x}`)
      ?.join("&");
    const queryMachine = filters?.filteredMachine
      ?.map((x, i) => `idMachine[]=${x}`)
      ?.join("&");

    const queryDateMin = filters?.dateMin ? `min=${filters?.dateMin}` : "";
    const queryDateMax = filters?.dateMax ? `max=${filters?.dateMax}` : "";

    const queryItens = [
      queryModels,
      queryMachine,
      queryDateMax,
      queryDateMin,
    ]

    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0].id
      : "";

    if (idEnterpriseFilter) {
      queryItens.push(`idEnterprise=${idEnterpriseFilter}`)
    }

    const queryFilterString = queryItens
      .filter((x) => !!x)
      .join("&");

    Fetch.get(`/travel/forms/filled?${queryFilterString}`)
      .then((response) => {
        setData(response.data ? response.data : undefined)
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <ContentHeader
            onFilter={getData}
            titleId="forms.filled"
          />
        </CardHeader>
        <CardBodyStyled>
          <TABLE>
            {isLoading ? (
              <LoadingRows />
            ) : (
              <ContentList data={data} />
            )}
          </TABLE>
        </CardBodyStyled>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(FormTravelFilledList);
