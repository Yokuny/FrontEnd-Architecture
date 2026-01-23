import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ColCenter,
  ItemRow,
  ListSearchPaginated,
  TextSpan,
} from "../../../components";
import  {SelectPlatform,GetColor}  from "./SelectPlatform";

const PlatformList = (props) => {
  const hasPermissionAdd = props.items?.some((x) => x === "/add-platform");
  const navigate = useNavigate();
  const renderItem = ({ item, index }) => {
    return (
      <>
        <ItemRow color={GetColor(item.modelType).dark}>
          <Col breakPoint={{ md: 1 }} className="col-flex-center">
              <SelectPlatform data ={item.modelType} />
          </Col>
          <ColCenter breakPoint={{ md: 10 }}>
            <TextSpan apparence="s1">{item.name}</TextSpan>
            <TextSpan apparence="c1">{`${item.acronym} / ${item.modelType}`}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 1 }}>
            {hasPermissionAdd && (
              <Button
                size="Tiny"
                status="Success"
                onClick={() =>
                  navigate(`/add-platform?id=${item.id}`)
                }
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
                  <FormattedMessage id="platforms" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/add-platform`)}
                    >
                      <FormattedMessage id="new.platform" />
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
              pathUrlSearh="/platform/list"
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

export default connect(mapStateToProps, undefined)(PlatformList);
