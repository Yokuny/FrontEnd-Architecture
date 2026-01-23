import { CardBody, ListItem, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { TextSpan } from "../../components";
import { Fetch } from "../../components/Fetch";
import { LoadingCard } from "../../components/Loading";

const CardContent = styled(CardBody)`
  max-height: 250px;
  padding: 0px;
`;

const Item = styled(ListItem)`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  padding-top: 6px;
  padding-bottom: 6px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const LocationsDashboard = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    getData(
      props.periodFilter,
      props.idUsers,
      props.idUsersNotIncluded,
      props.idEnterprise,
      props.usersFilter
    );
  }, [
    props.periodFilter,
    props.idUsers,
    props.idUsersNotIncluded,
    props.idEnterprise,
    props.usersFilter,
  ]);

  const getData = (
    periodFilter,
    idUsers,
    idUsersNotIncluded,
    idEnterprise,
    usersFilter = []
  ) => {
    setIsLoading(true);

    let queryPaths = [`lastPeriodHours=${periodFilter}`];
    if (idUsers?.length || usersFilter?.length)
      queryPaths = [
        ...queryPaths,
        ...idUsers
          ?.filter((x) => !usersFilter.includes(x))
          ?.map((x) => `idUsers[]=${x}`),
        ...usersFilter?.map((x) => `idUsers[]=${x}`),
      ];
    if (idUsersNotIncluded?.length)
      queryPaths = [
        ...queryPaths,
        ...idUsersNotIncluded?.map((x) => `idUsersNotIncluded[]=${x}`),
      ];
    if (idEnterprise) queryPaths.push(`idEnterprise=${idEnterprise}`);

    Fetch.get(`/tracking/locations?${queryPaths.join(`&`)}`)
      .then((res) => {
        setIsLoading(false);
        setData(res.data);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const dataSorted = data
    ?.filter((x) => x.location?.city || x.location?.state)
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <LoadingCard isLoading={isLoading}>
        <Row between style={{ margin: 0 }} className="pr-2 pl-2">
          <TextSpan apparence="s1">
            <FormattedMessage id="location" />{`${props.name && ` - ${props.name}`}`}
          </TextSpan>
          <TextSpan apparence="s1">
            <FormattedMessage id="access" />
          </TextSpan>
        </Row>
        <CardContent className="mt-1">
          {dataSorted?.map((location, index) => (
            <Item key={index}>
              <Column>
                <TextSpan apparence="s2">
                  {location?.location?.city || "-"}
                </TextSpan>
                <TextSpan apparence="p3">
                  {`${location?.location?.state} - ${location?.location?.country_code}`}
                </TextSpan>
              </Column>
              <TextSpan apparence="p1">{location?.total}</TextSpan>
            </Item>
          ))}
        </CardContent>
      </LoadingCard>
    </>
  );
};

const mapStateToProps = (state) => ({
  usersFilter: state.statistics.usersFilter,
  name: state.statistics.name,
});

export default connect(mapStateToProps, undefined)(LocationsDashboard);
