import { Button } from "@paljs/ui/Button";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import { EvaIcon } from "@paljs/ui/Icon";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { IconRounded, ItemRow, ColCenter, ListSearchPaginated, TextSpan } from "../../../components";
import { useNavigate } from "react-router-dom";

const PlanMaintenanceList = (props) => {
  const navigate = useNavigate();
  const hasPermissionAdd = props.items?.some(
    (x) => x == "/maintenance-plan-add"
  );

  const onEdit = (maintenance) => {
    navigate(`/maintenance-plan-add?id=${maintenance.id}`);
  };

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
                name={"settings-outline"}
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
              <Button size="Tiny" status="Success" onClick={() => onEdit(item)}>
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
                  <FormattedMessage id="maintenance.plans" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() =>
                        navigate(`/maintenance-plan-add`)
                      }
                    >
                      <FormattedMessage id="maintenance.plan.new" />
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
              pathUrlSearh="/maintenanceplan/list"
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

export default connect(mapStateToProps, undefined)(PlanMaintenanceList);
