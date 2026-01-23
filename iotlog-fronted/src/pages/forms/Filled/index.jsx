import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { EvaIcon } from "@paljs/ui/Icon";
import styled, { css, useTheme } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ContextMenu } from "@paljs/ui";
import { nanoid } from "nanoid";
import { ListSearchPaginated, ColCenter, TextSpan } from "../../../components";

const ItemRow = styled.div`
  ${({ colorTextTheme, theme }) => css`
    border-left: 6px solid ${theme[colorTextTheme]};
    padding: 1rem;
    display: flex;
    flex-direction: row;
    width: 100%;
    cursor: pointer;

    ::hover {
       {
        cursor: pointer;
        background-color: ${theme.colorBasicHover};
        color: ${theme.colorPrimary500};
      }
    }
  `}
`;

const ListTypeForm = (props) => {
  const theme = useTheme();
  const intl = useIntl();
  const navigate = useNavigate();

  const clickShow = (item) => {
    navigate(`/filled-forms?idForm=${item.id}&t=${item.description}`);
  };

  const renderItem = ({ item, index }) => {
    let itemsMenu = [];
    const hasPermissionEdit =
      props.items?.some((x) => x === "/fill-form-board") &&
      item?.appliedPermissions?.canFill;
    if (hasPermissionEdit)
      itemsMenu.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "add.form" }),
        link: {
          to: `/filled-forms?action=new&idForm=${item.id}&t=${item.description}`,
        },
      });

    itemsMenu.push({
      icon: "file-text-outline",
      title: intl.formatMessage({ id: "forms.filled" }),
      link: { to: `/filled-forms?idForm=${item.id}&t=${item.description}` },
    });

    return (
      <>
        <ItemRow
          key={nanoid(4)}
          onClick={() => clickShow(item)}
          colorTextTheme={"colorPrimary500"}
          style={{ paddingTop: 27, paddingBottom: 27 }}
        >
          <Col
            breakPoint={{ md: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <EvaIcon
              name={"file-outline"}
              options={{
                fill: theme.colorPrimary500,
                width: 25,
                height: 25,
                animation: { type: "pulse", infinite: false, hover: true },
              }}
            />
          </Col>
          <ColCenter breakPoint={{ md: 5 }}>
            <TextSpan apparence="s1">{item?.description}</TextSpan>
            {!!props.enterprises?.length && (
              <TextSpan apparence="c1">{`${
                !props.enterprises?.length
                  ? `${item.code ? " / " : ""}${item?.enterprise?.name}`
                  : ""
              }`}</TextSpan>
            )}
          </ColCenter>
          <ColCenter breakPoint={{ md: 5 }}></ColCenter>
          <ColCenter
            breakPoint={{ md: 1, xs: 12 }}
            className="mt-2 mb-2 col-center-middle"
          >
            {!!itemsMenu?.length && (
              <ContextMenu
                className="inline-block mr-1 text-start"
                placement="left"
                items={itemsMenu}
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
              <FormattedMessage id="forms" />
            </CardHeader>
            <ListSearchPaginated
              renderItem={renderItem}
              contentStyle={{
                justifyContent: "space-between",
                padding: 0,
              }}
              pathUrlSearh="/form/list"
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

export default connect(mapStateToProps, undefined)(ListTypeForm);
