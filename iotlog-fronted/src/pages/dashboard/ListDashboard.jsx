import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ListSearchPaginated } from "../../components";
import ItemLineDashboard from "./list";


const ListDashboard = (props) => {

  const navigate = useNavigate();
  const hasPermissionViewer = props.items?.some((x) => x === "/list-dashboard");
  const hasPermissionEditor = props.items?.some((x) => x === "/add-dashboard");

  const renderItem = ({ item, index }) => {
    return (
      <>
        <ItemLineDashboard
          key={index}
          item={item}
          hasPermissionViewer={hasPermissionViewer}
          hasPermissionEditor={hasPermissionEditor}
          isShowEnterprise={props.enterprises?.length}
        />
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
                  <FormattedMessage id="dashboard" />
                  {hasPermissionEditor && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/add-dashboard`)}
                    >
                      <FormattedMessage id="new" />
                    </Button>
                  )}
                </Row>
              </Col>
            </CardHeader>
            <ListSearchPaginated
              key={'dashboards'}
              renderItem={renderItem}
              contentStyle={{
                justifyContent: "space-between",
                padding: 0,
              }}
              pathUrlSearh="/dashboard/list"
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
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(ListDashboard);
