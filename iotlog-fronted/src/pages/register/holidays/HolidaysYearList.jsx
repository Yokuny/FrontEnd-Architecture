import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  SpinnerFull,
  FetchSupport,
  ListPaginated,
  ItemRow,
  IconRounded,
  TextSpan,
} from "../../../components";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { useNavigate } from "react-router-dom";

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RowLeft = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const HolidaysYearList = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const navigate = useNavigate();
  React.useLayoutEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 5 });
  }, []);

  const onEdit = (holiday) => {
    navigate(
      `/holidays-add?year=${holiday.year}&enterprise=${holiday.idEnterprise}`
    );
  };

  const hasPermissionAdd = props.items?.some((x) => x == "/holidays-add");

  const renderItem = ({ item, index }) => {
    return (
      <>
        <ItemRow colorTextTheme={"colorWarning500"}>
          <Col
            breakPoint={{ md: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconRounded colorTextTheme={"colorWarning500"}>
              <EvaIcon
                name={"calendar-outline"}
                options={{
                  fill: "#fff",
                  width: 25,
                  height: 25,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
            </IconRounded>
          </Col>
          <ColCenter breakPoint={{ md: 8 }}>
            <TextSpan apparence="s1">{item.year}</TextSpan>
            <TextSpan apparence="c1">{item.nameEnterprise}</TextSpan>
          </ColCenter>
          {hasPermissionAdd && (
            <ColCenter breakPoint={{ md: 3 }}>
              <RowLeft>
                <Button
                  size="Tiny"
                  status="Success"
                  onClick={() => onEdit(item)}
                >
                  <FormattedMessage id="edit" />
                </Button>
                </RowLeft>
            </ColCenter>
          )}
        </ItemRow>
      </>
    );
  };

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/holidays/list?page=${currentPage - 1}&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }
    setIsLoading(true);
    FetchSupport.get(url)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Col>
                <Row between>
                  <FormattedMessage id="holidays" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/holidays-add`)}
                    >
                      <FormattedMessage id="new.holidays.year" />
                    </Button>
                  )}
                </Row>
              </Col>
            </CardHeader>
            <ListPaginated
              data={data?.rows || []}
              totalItems={data?.count || 0}
              renderItem={renderItem}
              onPageChanged={onPageChanged}
              contentStyle={{
                justifyContent: "space-between",
                padding: 0,
              }}
            />
          </Card>
        </Col>
      </Row>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(
  mapStateToProps,
  undefined
)(injectIntl(HolidaysYearList));
