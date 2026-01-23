import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { useNavigate } from "react-router-dom";
import {
  Vessel
} from "../../../components/Icons";
import {
  ItemRow,
  ListSearchPaginated,
  TextSpan,
} from "../../../components";

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
`;

const SensorList = (props) => {
  const navigate = useNavigate();
  const onEdit = (sensor) => {
    navigate(`/sensor-add?id=${sensor.id}`);
  };

  const theme = useTheme();

  const hasPermissionAdd = props.items?.some((x) => x == "/sensor-add");

  const renderItem = ({ item, index }) => {

    const hasPermissionEdit = props.itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id === item.enterprise.id &&
        x.paths?.includes("/sensor-add")
    );

    return (
      <>
        <ItemRow colorTextTheme={"colorSuccess500"}>
          <Col
            breakPoint={{ md: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="mt-1 mb-1"
          >
            {/* <IconRounded colorTextTheme={"colorSuccess100"}> */}
              <EvaIcon
                name={"flash"}
                options={{
                  fill: theme.colorSuccess500,
                  width: 25,
                  height: 25,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
            {/* </IconRounded> */}
          </Col>
          <ColCenter breakPoint={{ md: 4 }}>
            <TextSpan apparence="s1">{item.sensor}</TextSpan>
            {!props.enterprises?.length && (
              <TextSpan apparence="c1">{item?.enterprise?.name}</TextSpan>
            )}
          </ColCenter>
          <ColCenter breakPoint={{ md: 3 }}>
            <RowRead>
              <EvaIcon
                name={"cloud-upload-outline"}
                status={"Primary"}
                className="mt-1 mr-1"
                options={{ height: 18, width: 16 }}
              />
              <TextSpan style={{ marginTop: 2 }}  apparence="s3">
                {item.sensorId}
              </TextSpan>
            </RowRead>
          </ColCenter>
          <ColCenter breakPoint={{ md: 3 }}>
            {!!item.machines?.length && <RowRead>
            <Vessel
                  style={{
                    height: 15,
                    width: 14,
                    color: theme.colorInfo700,
                    marginRight: 5,
                    marginTop: 5,
                    marginBottom: 2,
                  }}
                />
              <TextSpan style={{ marginTop: 2 }} hint apparence="s3">
                {item.machines?.join(", ")}
              </TextSpan>
            </RowRead>}
          </ColCenter>
          <ColCenter breakPoint={{ md: 1 }}>
            {hasPermissionEdit && (
              <Button size="Tiny" status="Basic" onClick={() => onEdit(item)}>
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
                  <FormattedMessage id="sensor" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/sensor-add`)}
                    >
                      <FormattedMessage id="sensor.new" />
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
              pathUrlSearh="/sensor/list"
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

export default connect(mapStateToProps, undefined)(SensorList);
