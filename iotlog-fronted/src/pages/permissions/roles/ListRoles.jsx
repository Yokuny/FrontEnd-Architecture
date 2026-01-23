import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { EvaIcon, ContextMenu } from "@paljs/ui";
import { useTheme } from "styled-components";
import {
  ColCenter,
  ItemRow,
  ListSearchPaginated,
  TextSpan,
} from "../../../components";
import { getShowVisibility } from "../../../components/Utils";
import { Link, useNavigate } from "react-router-dom";

const ListRoles = (props) => {
  const theme = useTheme();
  const intl = useIntl();
  const navigate = useNavigate()

  const hasPermissionAdd = props.items?.some((x) => x === "/add-role");
  const hasPermissionViewUsers = props.items?.some(
    (x) => x === "/list-role-users"
  );

  const renderItem = ({ item, index }) => {
    const showVisibility = getShowVisibility(item.visibility);
    const itemsMenu = [];

    if (hasPermissionAdd) {
      itemsMenu.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: { to: `/add-role?id=${item.id}` },
      });
    }
    if (hasPermissionViewUsers) {
      itemsMenu.push({
        icon: "people-outline",
        title: intl.formatMessage({ id: "users" }),
        link: { to: `/list-role-users?id=${item.id}` },
      });
    }

    return (
      <>
        <ItemRow
          colorTextTheme={"colorWarning600"}
          style={{
            padding: `22px 0px`,
          }}
        >
          <Col breakPoint={{ md: 1 }} className="col-flex-center">
              <EvaIcon
                name={"shield"}
                options={{
                  fill: theme.colorWarning600,
                  width: 25,
                  height: 25,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
          </Col>
          <ColCenter breakPoint={{ md: 8 }}>
            <TextSpan apparence="s1">{item.description}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 2 }}>
            <Row className="row-flex-center">
              <EvaIcon
                name={showVisibility.icon}
                status={showVisibility.theme}
                className="mt-1 mr-1"
                options={{ height: 18, width: 16 }}
              />
              <TextSpan style={{ marginTop: 2 }} apparence="p2" hint>
                <FormattedMessage id={showVisibility.textId} />
              </TextSpan>
            </Row>
          </ColCenter>
          <ColCenter breakPoint={{ md: 1 }}>
            <div>
              {hasPermissionAdd && (
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
            </div>
          </ColCenter>
        </ItemRow>
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between>
              <FormattedMessage id="role" />
              {hasPermissionAdd && (
                <Button
                  size="Small"
                  status="Primary"
                  onClick={() => navigate(`/add-role`)}
                >
                  <FormattedMessage id="new.role" />
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
          pathUrlSearh="/role/list"
          filterEnterprise
        />
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(ListRoles);
