import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import ContextMenu from "@paljs/ui/ContextMenu";
import { Link, useNavigate } from "react-router-dom";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { ColCenter, IconRounded, ItemRow, ListSearchPaginated, TextSpan } from "../../components";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
`;

const DiagramList = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const theme = useTheme();
  const hasPermissionAdd = props.items?.some((x) => x === "/diagram-add");

  const renderItem = ({ item, index }) => {
    return (
      <ItemRow
        colorTextTheme={"colorSuccess600"}
        style={{ flexWrap: "wrap", cursor: "pointer" }}
        onClick={() => navigate(`/diagram-details?id=${item.id}`)}
      >
        <Col breakPoint={{ md: 1 }} className="col-flex-center">
          <IconRounded color={`${theme.colorSuccess600}10`}>
            <EvaIcon
              name={"layout-outline"}
              options={{
                fill: theme.colorSuccess600,
                width: 25,
                height: 25,
                animation: { type: "pulse", infinite: false, hover: true },
              }}
            />
          </IconRounded>
        </Col>
        <ColCenter
          breakPoint={{ md: 10, xs: 12 }}
          className="center-mobile mt-4 mb-4"
        >
          <TextSpan apparence="s1" hint={item.isInactive}>
            {item.description}
          </TextSpan>
        </ColCenter>
        <ColCenter breakPoint={{ md: 1, xs: 2 }}>
          <ContextMenu
            className="inline-block mr-1 text-start"
            placement="left"
            items={[
              {
                icon: "eye-outline",
                title: intl.formatMessage({ id: "view" }),
                link: { to: `/diagram-details?id=${item.id}` },
              },
            ]}
            Link={Link}
          >
            <Button size="Tiny" status="Basic">
              <EvaIcon name="more-vertical" />
            </Button>
          </ContextMenu>

        </ColCenter>
      </ItemRow >
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
                  <FormattedMessage id="diagram" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/diagram-details`)}
                    >
                      <FormattedMessage id="diagram.new" />
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
              pathUrlSearh="/machine/plant/list"
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

export default connect(mapStateToProps, undefined)(DiagramList);
