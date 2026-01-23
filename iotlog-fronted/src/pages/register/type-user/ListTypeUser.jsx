import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import ContextMenu from "@paljs/ui/ContextMenu";
import { Link, useNavigate } from "react-router-dom";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage, useIntl } from "react-intl";
import {
  ColCenter,
  ItemRow,
  ListSearchPaginated,
  TextSpan,
} from "../../../components";

const ListTypeUser = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const hasPermissionAdd = props.items?.some((x) => x === "/add-type-user");

  const renderItem = ({ item, index }) => {
    let itemsMenu = [];
    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/add-type-user")
      )
    ) {
      itemsMenu.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: { to: `/add-type-user?id=${item.id}` },
      });
    }

    return (
      <>
        <ItemRow
          color={item?.color}
          style={{ flexWrap: "wrap" }}
        >
          <ColCenter
            breakPoint={{ md: 11, xs: 12 }}
            className="center-mobile"
          >
            <TextSpan apparence="s1">{item.description}</TextSpan>
            <TextSpan apparence="c1">{
              !props.enterprises?.length
                ? `${item.code ? " / " : ""}${item?.enterprise?.name}`
                : ""
            }</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 1, xs: 6 }}>
          {!!itemsMenu?.length && (
              <ContextMenu
                className="inline-block mr-1 text-start"
                placement="left"
                items={itemsMenu}
                Link={Link}
              >
                <Button size="Tiny" status="Success">
                  <EvaIcon name="more-vertical" />
                </Button>
              </ContextMenu>
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
                  <FormattedMessage id="types.user" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/add-type-user`)}
                    >
                      <FormattedMessage id="add" />
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
              pathUrlSearh="/typeuser/list"
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
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(ListTypeUser);
