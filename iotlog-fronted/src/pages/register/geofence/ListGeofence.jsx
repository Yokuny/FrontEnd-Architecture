import { ContextMenu } from "@paljs/ui";
import { Button } from "@paljs/ui/Button";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import { EvaIcon } from "@paljs/ui/Icon";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { ColCenter, ItemRow, TextSpan } from "../../../components";
import { getIconItemType } from "./TypeGeofence";
import ListSearchPaginatedGeofense from "../../../components/ListPaginated/ListSearchPaginatedGeofense";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
`;

const ListGeofence = (props) => {
  const theme = useTheme();
  const intl = useIntl();
  const navigate = useNavigate();

  const hasPermissionAdd = props.items?.some((x) => x === "/add-geofence");

  const renderItem = ({ item, index }) => {
    const iconType = getIconItemType(item.type, theme, item.color);

    return (
      <>
        <ItemRow color={item.color}>
          <Col breakPoint={{ md: 1 }} className="col-flex-center">
            {iconType.icon}
          </Col>
          <ColCenter breakPoint={{ md: 4 }}>
            <TextSpan apparence="s1">{item?.description}</TextSpan>
            <TextSpan apparence="c1">{item?.code}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 3, xs: 4 }}>
            <RowRead style={{ justifyContent: "flexStart" }}>
              <EvaIcon
                name="flag"
                className="mt-1 mr-1"
                options={{ height: 18, width: 16, fill: item.color }}
              />
              <TextSpan style={{ marginTop: 2 }} apparence="s3">
                {intl.formatMessage({ id: item.type?.value })}
              </TextSpan>
            </RowRead>
          </ColCenter>
          <ColCenter breakPoint={{ md: 3, xs: 4 }}>
            {item?.city && (
              <RowRead style={{ justifyContent: "flexStart" }}>
                <EvaIcon
                  name="pin"
                  className="mt-1 mr-1"
                  options={{ height: 18, width: 16, fill: item.color }}
                />
                <TextSpan style={{ marginTop: 2 }} apparence="s3">
                  {`${item.city} - ${item?.state ?? ""}`}
                </TextSpan>
              </RowRead>
            )}
          </ColCenter>
          <ColCenter breakPoint={{ md: 1, xs: 2 }}>
            {hasPermissionAdd && (
              <ContextMenu
                className="inline-block mr-1 text-start"
                placement="left"
                items={[
                  {
                    icon: "edit-outline",
                    title: intl.formatMessage({ id: "edit" }),
                    link: { to: `/add-geofence?id=${item.id}` },
                  },
                ]}
                Link={Link}
              >
                <Button size="Tiny" status="Basic">
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
                  <FormattedMessage id="geofences" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/add-geofence`)}
                    >
                      <FormattedMessage id="add.geofence" />
                    </Button>
                  )}
                </Row>
              </Col>
            </CardHeader>
            <ListSearchPaginatedGeofense
              renderItem={renderItem}
              contentStyle={{
                justifyContent: "space-between",
                padding: 0,
              }}
              pathUrlSearh="/geofence/list"
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
});

export default connect(mapStateToProps, undefined)(ListGeofence);
