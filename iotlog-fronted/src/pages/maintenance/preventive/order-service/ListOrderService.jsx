import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import {
  IconRounded,
  ItemRow,
  ListSearchPaginated,
  TextSpan,
} from "../../../../components";
import ContextMenu from "@paljs/ui/ContextMenu";
import { EvaIcon } from "@paljs/ui/Icon";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import moment from "moment";

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
`;

const TextHint = styled(TextSpan)`
  font-size: 11px !important;
  margin-top: 1px;
  ${({ theme }) => css`
    color: ${theme.textHintColor};
  `}
`;

const ListOrderService = (props) => {

  const intl = useIntl();

  const renderItem = ({ item, index }) => {
    const itemsMenu = [];
    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id == item.enterprise?.id &&
          x.paths?.includes("/os-details")
      )
    ) {
      itemsMenu.push({
        icon: "eye-outline",
        title: intl.formatMessage({ id: "view.os" }),
        link: { to: `/os-details?id=${item.id}` },
      });
    }

    return (
      <>
        <ItemRow colorTextTheme={"colorDanger500"}>
          <Col
            breakPoint={{ md: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconRounded colorTextTheme={"colorDanger500"}>
              <EvaIcon
                name={"file-text"}
                options={{
                  fill: "#fff",
                  width: 25,
                  height: 25,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
            </IconRounded>
          </Col>
          <ColCenter breakPoint={{ md: itemsMenu?.length ? 7 : 8 }}>
            <TextSpan apparence="s1">{`${item.order} - ${item?.maintenancePlan?.description} - ${item?.machine?.name}`}</TextSpan>
            <TextSpan apparence="c1">{`${item?.enterprise?.name}`}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 3 }}>
            <RowRead>
              <EvaIcon
                name="done-all-outline"
                status="Success"
                className="mt-1"
                options={{ height: 17, width: 17 }}
              />
              <TextHint style={{ marginTop: 2 }}>
                {`${intl.formatMessage({ id: "done.at" })} ${moment(
                  item.doneAt
                ).format(intl.formatMessage({ id: "format.date" }))}`}
              </TextHint>
            </RowRead>
          </ColCenter>
          {!!itemsMenu?.length && (
            <ColCenter breakPoint={{ md: 1 }}>
              <ContextMenu
                className="inline-block mr-1 text-start"
                placement="left"
                items={itemsMenu}
                Link={Link}
              >
                <Button size="Tiny" status="Success">
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
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage id="done.os" />
            </CardHeader>
            <ListSearchPaginated
              renderItem={renderItem}
              contentStyle={{
                justifyContent: "space-between",
                padding: 0,
              }}
              pathUrlSearh="/maintenancemachine/os/done/list"
              filterEnterprise
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(ListOrderService);
