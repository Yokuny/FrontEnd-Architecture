import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import DropdownMenu from "../../../components/DropdownMenu";
import { useNavigate } from "react-router-dom";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import {
  ColCenter,
  ItemRow,
  ListSearchPaginated,
  TextSpan,
  UserImage,
} from "../../../components";
import { MapMarkerDistance } from "../../../components/Icons";
import { Badge } from "@paljs/ui";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
`;

const MachineList = (props) => {
  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();
  const hasPermissionAdd = props.items?.some((x) => x === "/machine-add");
  const hasPermissionToSeeSensors = props.items?.some(
    (x) => x === "/sensors-list"
  );
  const hasPermissionToSeeAlarms = props.items?.some(
    (x) => x === "/machine-alarms"
  );

  const renderItem = ({ item, index }) => {
    let itemsMenu = [];
    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/machine-add")
      )
    ) {
      itemsMenu.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: { to: `/machine-add?id=${item._id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/machine-alarms")
      )
    ) {
      itemsMenu.push({
        icon: "bell-outline",
        title: intl.formatMessage({ id: "editor.alarms.machine" }),
        link: {
          to: `/machine-alarms?id=${item.id}&source=${item.enterprise?.id}`,
        },
      });
    }

    if (hasPermissionToSeeSensors) {
      itemsMenu.push({
        icon: "flash-outline",
        title: intl.formatMessage({ id: "sensors" }),
        link: { to: `/machine-sensors?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/machine-docs")
      )
    ) {
      itemsMenu.push({
        icon: "file-outline",
        title: intl.formatMessage({ id: "machine.docs" }),
        link: { to: `/machine-docs?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/integration-machine")
      )
    ) {
      itemsMenu.push({
        icon: "cloud-upload-outline",
        title: `${intl.formatMessage({ id: "integration" })} AIS`,
        link: { to: `/integration-machine?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/documentation-integration")
      )
    ) {
      itemsMenu.push({
        icon: "upload-outline",
        title: `${intl.formatMessage({ id: "integration" })} MQTT`,
        link: { to: `/documentation-integration?id=${item._id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/config-machine-fleet")
      )
    ) {
      itemsMenu.push({
        icon: "map-outline",
        title: intl.formatMessage({ id: "config.machine.fleet" }),
        link: {
          to: `/config-machine-fleet?id=${item.id}&idEnterprise=${item.enterprise?.id}`,
        },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/config-machine-travel")
      )
    ) {
      itemsMenu.push({
        icon: "cube-outline",
        title: intl.formatMessage({ id: "config.machine.travel" }),
        link: {
          to: `/config-machine-travel?id=${item.id}&idEnterprise=${item.enterprise?.id}`,
        },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/field-wear")
      )
    ) {
      itemsMenu.push({
        icon: "activity-outline",
        title: intl.formatMessage({ id: "wear.field" }),
        link: { to: `/field-wear?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/machine-wear-config")
      )
    ) {
      itemsMenu.push({
        icon: "settings-outline",
        title: intl.formatMessage({ id: "machine.wear.config" }),
        link: { to: `/machine-wear-config?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/machine-control")
      )
    ) {
      itemsMenu.push({
        icon: "swap-outline",
        title: intl.formatMessage({ id: "machine.control.integration" }),
        link: { to: `/machine-control?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/crew-asset")
      )
    ) {
      itemsMenu.push({
        icon: "people-outline",
        title: intl.formatMessage({ id: "crew" }),
        link: {
          to: `/crew-asset?idAsset=${item.id}&idEnterprise=${item.enterprise?.id}`,
        },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/machine-tree-sensors")
      )
    ) {
      itemsMenu.push({
        icon: "shuffle-2-outline",
        title: intl.formatMessage({ id: "tree.sensors" }),
        link: {
          to: `/machine-tree-sensors?idMachine=${item.id}&name=${item.name}`,
        },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.enterprise?.id &&
          x.paths?.includes("/sensor-min-max")
      )
    ) {
      itemsMenu.push({
        icon: "bell",
        title: intl.formatMessage({ id: "alert.min.max" }),
        link: {
          to: `/sensor-min-max?idAsset=${item.id}&days=1`,
        },
      });
    }

    return (
      <>
        <ItemRow
          colorTextTheme={item.isInactive ? "colorBasic600" : "colorPrimary500"}
          style={{ flexWrap: "wrap" }}
        >
          <Col
            breakPoint={{ md: 1, xs: 12 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <UserImage
              size="Large"
              image={item.image?.url}
              title={""}
              name={""}
            />
          </Col>
          <ColCenter
            breakPoint={{ md: 3, xs: 12 }}
            className="center-mobile mt-4 mb-4"
          >
            <TextSpan apparence="s1" hint={item.isInactive}>
              {item.name}
            </TextSpan>
            <TextSpan apparence="p2" hint>{`${item.code || ""}${
              !props.enterprises?.length
                ? `${item.code ? " / " : ""}${item?.enterprise?.name}`
                : ""
            }`}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 3, xs: 6 }}>
            <RowRead>
              <EvaIcon
                name={"cloud-upload-outline"}
                status={item.isInactive ? "Basic" : "Primary"}
                className="mt-1"
                options={{ height: 18, width: 16 }}
              />
              <TextSpan
                style={{ marginTop: 2 }}
                apparence="p3"
                hint={item.isInactive}
              >
                {item.id}
              </TextSpan>
            </RowRead>
          </ColCenter>
          {item.isInactive ? (
            <ColCenter
              breakPoint={{ md: 4, xs: 6 }}
              className="mt-2 mb-2 col-center-middle"
            >
              <Badge status="Basic" position="" className="mr-1">
                {intl.formatMessage({ id: "deactivate" })}
              </Badge>
            </ColCenter>
          ) : (
            <>
              <ColCenter breakPoint={{ md: 2, xs: 6 }}>
                {item.isConfiguredFleet && (
                  <RowRead>
                    <EvaIcon
                      name="globe-2-outline"
                      status="Basic"
                      className="mt-1"
                      options={{ height: 18, width: 16 }}
                    />
                    <TextSpan style={{ marginTop: 3 }} apparence="p3" hint>
                      {intl.formatMessage({ id: "show.in.fleet" })}
                    </TextSpan>
                  </RowRead>
                )}
                {item.isConfiguredTravel && (
                  <RowRead>
                    <MapMarkerDistance
                      style={{
                        height: 17,
                        width: 17,
                        fill: theme["colorBasic600"],
                        padding: 2,
                      }}
                    />
                    <TextSpan
                      style={{ marginLeft: "0.20rem", marginTop: 0 }}
                      apparence="p3"
                      hint
                    >
                      {intl.formatMessage({ id: "setup.travel" })}
                    </TextSpan>
                  </RowRead>
                )}
              </ColCenter>
              <ColCenter breakPoint={{ md: 2, xs: 6 }}>
                <RowRead
                  onClick={() =>
                    hasPermissionToSeeSensors &&
                    navigate(`/machine-sensors?id=${item.id}`)
                  }
                  clickable={hasPermissionToSeeSensors}
                >
                  <EvaIcon
                    name="flash-outline"
                    status="Basic"
                    className="mt-1"
                    options={{ height: 18, width: 16 }}
                  />
                  <TextSpan style={{ marginTop: 3 }} apparence="p3" hint>
                    {`${item.sensors || 0} ${intl
                      .formatMessage({ id: "sensors" })
                      .toLowerCase()}`}
                  </TextSpan>
                </RowRead>
                {/* <RowRead
              onClick={() =>
                hasPermissionToSeeAlarms &&
                navigate(`/machine-alarms?id=${item.id}`)
              }
              clickable={hasPermissionToSeeAlarms}
            >
              <EvaIcon
                name="bell-outline"
                status="Basic"
                className="mt-1"
                options={{ height: 18, width: 16 }}
              />
              <TextSpan style={{ marginTop: 3 }} apparence="p3" hint>
                {`${item.alerts || 0} ${intl
                  .formatMessage({ id: "setup" })
                  .toLowerCase()}`}
              </TextSpan>
            </RowRead> */}
              </ColCenter>
            </>
          )}

          <ColCenter
            breakPoint={{ md: 1, xs: 12 }}
            className="mt-2 mb-2 col-center-middle"
          >
            {!!itemsMenu?.length && (
              <DropdownMenu items={itemsMenu}>
                <Button size="Tiny" status="Basic">
                  <EvaIcon name="more-vertical" />
                </Button>
              </DropdownMenu>
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
                  <FormattedMessage id="machines" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/machine-add`)}
                    >
                      <FormattedMessage id="machine.new" />
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
              pathUrlSearh="/machine/list"
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

export default connect(mapStateToProps, undefined)(MachineList);
