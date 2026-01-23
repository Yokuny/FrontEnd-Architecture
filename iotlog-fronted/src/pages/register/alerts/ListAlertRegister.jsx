import {
  Button,
  Card,
  CardHeader,
  Col,
  ContextMenu,
  EvaIcon,
  Row,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import {
  ColCenter,
  IconRounded,
  ItemRow,
  ListSearchPaginated,
  TextSpan,
} from "../../../components";
import { getShowVisibility } from "../../../components/Utils";
import { Link, useNavigate } from "react-router-dom";

const ListAlertRegister = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const intl = useIntl();

  const hasPermissionAdd = props.items?.some((x) => x === "/add-alarm");

  const renderItem = ({ item, index }) => {
    const itemsMenu = [];

    const showVisibility = getShowVisibility(item.visibility);

    const permissionToEdit = props.itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id === item.idEnterprise &&
        x.paths?.includes("/add-alarm")
    );

    if (permissionToEdit) {
      itemsMenu.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: {
          to: `/add-alarm?id=${item.id}`,
        },
      });

      itemsMenu.push({
        icon: "copy-outline",
        title: intl.formatMessage({ id: "duplicate" }),
        link: {
          to: `/add-alarm?id=${item.id}&duplicate=true`,
        },
      });
    }

    return (
      <>
        <ItemRow color={`${theme.colorPrimary600}70`}>
          <Col breakPoint={{ md: 1 }} className="col-flex-center">
            <IconRounded color={`${theme.colorPrimary600}20`}>
              <EvaIcon
                name={"bell-outline"}
                options={{
                  fill: theme.colorPrimary600,
                  width: 25,
                  height: 25,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
            </IconRounded>
          </Col>
          <ColCenter breakPoint={{ md: 6 }}>
            <TextSpan apparence="s1">
              {item?.type === "event"
                ? item?.events?.description
                : item?.type === "min-max"
                ? item?.description
                : item?.rule?.then?.message}
            </TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 2 }}>
            <Row>
              <EvaIcon
                name={
                  item?.type === "event"
                    ? "flash-outline"
                    : item?.type === "min-max"
                    ? "thermometer-outline"
                    : "code-outline"
                }
                status={
                  item?.type === "event"
                    ? "Success"
                    : item?.type === "min-max"
                    ? "Warning"
                    : "Info"
                }
                className="mt-1 mr-1"
                options={{ height: 18, width: 16 }}
              />
              <TextSpan style={{ marginTop: 2 }} apparence="s3">
                {!!item?.type &&
                <FormattedMessage
                  id={item?.type === "min-max"
                    ? "min.max"
                    : item?.type}
                />}
              </TextSpan>
            </Row>
          </ColCenter>
          <ColCenter breakPoint={{ md: 2 }}>
            <Row className="row-flex-center">
              <EvaIcon
                name={showVisibility.icon}
                status={showVisibility.theme}
                className="mt-1 mr-1"
                options={{ height: 18, width: 16 }}
              />
              <TextSpan style={{ marginTop: 2 }} apparence="s3">
                {showVisibility?.textId && <FormattedMessage id={showVisibility.textId} />}
              </TextSpan>
            </Row>
          </ColCenter>
          {!!itemsMenu.length && (
            <ColCenter breakPoint={{ md: 1 }}>
              <ContextMenu
                className="inline-block mr-1 text-start"
                placement="left"
                items={itemsMenu}
                Link={Link}
              >
                <Button size="Tiny" status="Basic">
                  <EvaIcon name="more-vertical" />
                </Button>
              </ContextMenu>
            </ColCenter>
          )}
        </ItemRow>
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Row between className="pr-3 pl-3">
            <TextSpan apparence="s1">
              <FormattedMessage id="rule.alerts" />
            </TextSpan>
            {hasPermissionAdd && (
              <Button
                size="Small"
                status="Primary"
                onClick={() => navigate(`/add-alarm`)}
              >
                <FormattedMessage id="new.alarm" />
              </Button>
            )}
          </Row>
        </CardHeader>

        <ListSearchPaginated
          renderItem={renderItem}
          contentStyle={{
            justifyContent: "space-between",
            padding: 0,
          }}
          pathUrlSearh="/alertrule/list"
          filterEnterprise
        />
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(ListAlertRegister);
