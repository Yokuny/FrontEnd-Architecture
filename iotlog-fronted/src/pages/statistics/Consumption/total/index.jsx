import React from "react";
import { Card, CardBody, Col, EvaIcon, Row } from "@paljs/ui";
import styled, { css } from "styled-components";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { Fetch, SpinnerFull, TextSpan } from "../../../../components";
import FilterButton from "../filter-button";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { convertPeriodToDate } from "../Utils";

const IconRounded = styled.div`
  ${({ theme, bgColor = "" }) => css`
    ${bgColor && `background-color: ${bgColor};`}
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  `}
`;

const RowContainer = styled(Row)`
  .icon-size-eva-ajust {
    width: auto;
    height: auto;
  }
`;

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ColumnFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

const TotalConsume = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [filter, setFilter] = React.useState({
    dateFilter: "1m",
  });

  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (props.isReady)
      getData(props.enterprises?.length ? props.enterprises[0]?.id : undefined);
  }, [props.enterprises]);

  const getData = (idEnterprise, filterParams = undefined) => {
    setIsLoading(true);
    const filtersQuery = [
      `idEnterprise=${idEnterprise}`,
      `unit=${filterParams?.unit ?? "m³"}`,
      `period=${filterParams?.dateFilter ?? filter.dateFilter}`,
    ];

    Fetch.get(`/travel/statistics/totalfleet?${filtersQuery.join("&")}`)
      .then((response) => {
        if (response.data) setData(response.data);
        setIsLoading(false);
        if (filterParams?.dateFilter) {
          setFilter({ dateFilter: filterParams?.dateFilter });
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onFilterApply = (data) => {
    const idEnteprise = props.enterprises?.length
      ? props.enterprises[0]?.id
      : undefined;
    getData(idEnteprise, data);
  };

  return (
    <>
      <Col breakPoint={{ md: 12 }}>
        <RowContainer between="xs" middle="xs">
          <ColumnFlex>
            <TextSpan apparence="h6">
              {`${intl.formatMessage({
                id: "consumption.total.voyage",
              })}`}
            </TextSpan>
            <TextSpan apparence="s2">{`${intl
              .formatMessage({
                id: filter?.dateFilter === "1m" ? "in.month" : "last.months",
              })
              .replace(
                "{0}",
                filter?.dateFilter?.replace("m", "")
              )} (${convertPeriodToDate(filter?.dateFilter)})`}</TextSpan>
          </ColumnFlex>
          <FilterButton onApply={onFilterApply} />
        </RowContainer>
      </Col>
      <Col breakPoint={{ md: 12 }} style={{ padding: 0 }}>
        <RowContainer className="mt-4">
          {data?.consumption?.map((x, i) =>
          <Col key={i} breakPoint={{ md: 6 }}>
            <Card>
              <CardBody>
                <RowFlex>
                  <IconRounded bgColor={x.color}>
                    <EvaIcon
                      name="droplet"
                      className="icon-size-eva-ajust"
                      options={{ fill: "#fff", height: "2rem", width: "2rem" }}
                    />
                  </IconRounded>
                  <ColumnFlex className="ml-4">
                    <TextSpan apparence="h6">
                      {floatToStringExtendDot(x?.total) ?? 0}{" "}
                      <TextSpan apparence="s2">{data?.unit ?? ""}</TextSpan>
                    </TextSpan>
                    <TextSpan apparence="s2">{x.code}</TextSpan>
                  </ColumnFlex>
                </RowFlex>
              </CardBody>
            </Card>
          </Col>)}
        </RowContainer>
      </Col>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(TotalConsume);
