import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";

import { ListSearchPaginated, UserImage } from "../../../components";
import { useTheme } from "styled-components";
import { useNavigate } from "react-router-dom";

const ModelMachineList = (props) => {
  const hasPermissionAdd = props.items?.some((x) => x === "/model-machine-add");

  const theme = useTheme();
  const navigate = useNavigate();
  const renderItem = ({ item, index }) => {
    return (
      <div
        style={{
          borderLeft: `6px solid ${item.color || theme.colorBasic600}`,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: '100%'
        }}
        className="p-4"
      >
        <div className="ml-1">
        <UserImage
          size="Large"
          image={item.image?.url}
          name={item.description}
          title={item.enterprise?.name}
        />
        </div>
        {hasPermissionAdd && (
          <div className="col-flex-center mr-1">
          <Button
            size="Tiny"
            status="Success"
            onClick={() =>
              navigate(`/model-machine-add?id=${item.id}`)
            }
          >
            <FormattedMessage id="edit" />
          </Button>
          </div>
        )}
      </div>
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
                  <FormattedMessage id="models.machine" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/model-machine-add`)}
                    >
                      <FormattedMessage id="new.model" />
                    </Button>
                  )}
                </Row>
              </Col>
            </CardHeader>
            <ListSearchPaginated
              renderItem={renderItem}
              contentStyle={{
                padding: 0,
              }}
              pathUrlSearh="/modelmachine/list"
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

export default connect(mapStateToProps, undefined)(ModelMachineList);
