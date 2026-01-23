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
import User from "@paljs/ui/User";
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

const ExpedientsList = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const navigate = useNavigate();

  React.useEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 5 });
  }, []);

  const onEdit = (holiday) => {
    navigate(`/expedients-add?id=${holiday.id}`);
  };

  const hasPermissionAdd = props.items?.some((x) => x == "/expedients-add");

  const renderItem = ({ item, index }) => {
    return (
      <>
        <ItemRow colorTextTheme={"colorInfo500"}>
          <Col
            breakPoint={{ md: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconRounded colorTextTheme={"colorInfo500"}>
              <EvaIcon
                name={"clock-outline"}
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
            <TextSpan apparence="s1">{item.description}</TextSpan>
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
    let url = `/expedients/list?page=${currentPage - 1}&size=${pageLimit}`;
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
                  <FormattedMessage id="expedients" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/expedients-add`)}
                    >
                      <FormattedMessage id="new.expedients" />
                    </Button>
                  )}
                </Row>
              </Col>
            </CardHeader>
            <ListPaginated
              data={data?.rows}
              totalItems={data?.count}
              renderItem={renderItem}
              onPageChanged={onPageChanged}
              contentStyle={{
                padding: 0,
                justifyContent: "space-between",
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

export default connect(mapStateToProps, undefined)(injectIntl(ExpedientsList));
