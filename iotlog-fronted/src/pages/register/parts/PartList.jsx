import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { UserImage, ListSearchPaginated } from "../../../components";
import { useNavigate } from "react-router-dom";

const PartList = (props) => {
  const navigate = useNavigate();
  
  const onEdit = (part) => {
    navigate(`/part-add?id=${part.id}`);
  };

  const hasPermissionAdd = props.items?.some((x) => x == "/part-add");

  const renderItem = ({ item, index }) => {
    return (
      <>
        <UserImage
          size="Large"
          image={item?.image?.url}
          title={`SKU: ${item.sku}${
            item.enterprise?.name ? ` / ${item.enterprise?.name}` : ""
          }`}
          name={item.name}
        />
        {hasPermissionAdd && (
          <Button size="Tiny" status="Success" onClick={() => onEdit(item)}>
            <FormattedMessage id="edit" />
          </Button>
        )}
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
                  <FormattedMessage id="parts" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/part-add`)}
                    >
                      <FormattedMessage id="part.new" />
                    </Button>
                  )}
                </Row>
              </Col>
            </CardHeader>
            <ListSearchPaginated
              renderItem={renderItem}
              contentStyle={{
                borderLeft: `6px solid #f7910c`,
                justifyContent: "space-between",
              }}
              pathUrlSearh="/part/list"
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

export default connect(mapStateToProps, undefined)(PartList);
