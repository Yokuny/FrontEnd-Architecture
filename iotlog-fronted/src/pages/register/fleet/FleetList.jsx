import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { ListSearchPaginated } from "../../../components";
import FleetListItem from "./components/FleetListItem";

const FleetList = (props) => {
  const navigate = useNavigate();


  const renderItem = ({ item }) => {
    return <FleetListItem item={item} />;
  };

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Col>
                <Row between>
                  <FormattedMessage id="fleets" />
                  <Button
                    size="Small"
                    status="Primary"
                    onClick={() => navigate(`/fleet-add`)}
                  >
                    <FormattedMessage id="fleet.add" />
                  </Button>
                </Row>
              </Col>
            </CardHeader>

            <ListSearchPaginated
              renderItem={renderItem}
              contentStyle={{
                justifyContent: "space-between",
                padding: 0,
              }}
              pathUrlSearh="/machinefleet/list"
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

export default connect(mapStateToProps, undefined)(FleetList);
