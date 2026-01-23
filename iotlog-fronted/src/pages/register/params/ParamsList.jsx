import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { EvaIcon } from "@paljs/ui/Icon";
import {
  ColCenter,
  IconRounded,
  ItemRow,
  ListSearchPaginated,
  TextSpan,
} from "../../../components";
import { useNavigate } from "react-router-dom";

const ParamsList = (props) => {
  const hasPermissionAdd = props.items?.some((x) => x === "/params-add");
  const navigate = useNavigate();
  const renderItem = ({ item, index }) => {
    return (
      <>
        <ItemRow colorTextTheme={"colorBasic600"}>
          <Col
            breakPoint={{ md: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconRounded colorTextTheme={"colorBasic600"}>
              <EvaIcon
                name={"list-outline"}
                options={{
                  fill: "#fff",
                  width: 25,
                  height: 25,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
            </IconRounded>
          </Col>
          <ColCenter breakPoint={{ md: 10 }}>
            <TextSpan apparence="s1">{item.description}</TextSpan>
            <TextSpan apparence="c1">{`${item.enterprise?.name}`}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 1 }}>
            {hasPermissionAdd && (
              <Button
                size="Tiny"
                status="Success"
                onClick={() => navigate(`/params-add?id=${item.id}`)}
              >
                <FormattedMessage id="edit" />
              </Button>
            )}
          </ColCenter>
        </ItemRow>
      </>
    );
  };

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Col>
                <Row between>
                  <FormattedMessage id="params" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/params-add`)}
                    >
                      <FormattedMessage id="new.params" />
                    </Button>
                  )}
                </Row>
              </Col>
            </CardHeader>
            <ListSearchPaginated
              renderItem={renderItem}
              contentStyle={{
                justifyContent: "space-between",
                padding: 0,
              }}
              pathUrlSearh="/params/list"
              filterEnterprise
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(ParamsList);
