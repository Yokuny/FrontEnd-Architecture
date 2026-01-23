import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { EvaIcon } from "@paljs/ui/Icon";
import styled, { useTheme } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import {
  ListSearchPaginated,
  ItemRow,
  ColCenter,
  TextSpan,
  IconRounded,
} from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { Badge, ContextMenu, List, ListItem } from "@paljs/ui";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
`;

const FormList = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const intl = useIntl();
  const hasPermissionAdd = props.items?.some((x) => x === "/form-add");

  const forms = JSON.parse(localStorage.getItem("forms")) || [];
  const user = JSON.parse(localStorage.getItem("user"));

  const renderItem = ({ item, index, status = "Warning", isPending = false }) => {
    return (
      <>
        <ItemRow key={index} colorTextTheme={`color${status}500`}>
          <Col
            breakPoint={{ md: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconRounded color={`${theme[`color${status}500`]}10`}>
              <EvaIcon
                name={"file-remove-outline"}
                options={{
                  fill: theme[`color${status}500`],
                  width: 25,
                  height: 25,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
            </IconRounded>
          </Col>
          <ColCenter breakPoint={{ md: isPending ? 4 : 5 }}>
            <TextSpan apparence="s1">{item?.description}</TextSpan>
            <TextSpan apparence="c1">{`${
              !props.enterprises?.length
                ? `${item.code ? " / " : ""}${item?.enterprise?.name}`
                : ""
            }`}</TextSpan>
          </ColCenter>
          {isPending && (
            <ColCenter breakPoint={{ md: 3 }}>
              <div>
                <Badge status={"Basic"} style={{ position: "relative" }}>
                  <FormattedMessage id="not.save" />
                </Badge>
              </div>
            </ColCenter>
          )}
          <ColCenter breakPoint={{ md: isPending ? 3 : 5 }}>
            <RowRead style={{ justifyContent: "center" }}>
              <EvaIcon
                name="person-outline"
                status="Basic"
                className="mt-1 mr-1"
                options={{ height: 18, width: 16 }}
              />
              <TextSpan style={{ marginTop: 2 }} apparence="s3">
                {item.user?.name}
              </TextSpan>
            </RowRead>
          </ColCenter>
          <ColCenter breakPoint={{ md: 1, xs: 2 }}>
            {hasPermissionAdd && item?.appliedPermissions?.canEdit && (
              <ContextMenu
                className="inline-block mr-1 text-start"
                placement="left"
                items={[
                  {
                    icon: "edit-outline",
                    title: intl.formatMessage({ id: "edit" }),
                    link: {
                      to: `/form-add?id=${item.id}${
                        isPending ? "&pending=true" : ""
                      }`,
                    },
                  },
                  {
                    icon: "copy-outline",
                    title: intl.formatMessage({ id: "duplicate" }),
                    link: {
                      to: `/form-add?id=${item.id}&duplicate=true`,
                    },
                  },
                ]}
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
              <Col>
                <Row between>
                  <FormattedMessage id="config.form" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() =>
                        navigate(`/form-add?new=true&id=${uuidv4()}`)
                      }
                    >
                      <FormattedMessage id="add" />
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
              pathUrlSearh="/form/list"
              filterEnterprise
            />

            {!!forms.length ? (
              <>
                <TextSpan apparence="p2" style={{ margin: "0 auto" }} hint>
                  {intl.formatMessage({ id: "unsaved.forms" })}
                </TextSpan>

                <List className="mt-1">
                  {forms.map((form, index) => (
                    <ListItem
                      style={{
                        justifyContent: "space-between",
                        padding: 0,
                      }}
                    >
                      {renderItem({
                        status: "Basic",
                        isPending: true,
                        item: {
                          ...form.data,
                          id: form.id,
                          description: form.data.description
                            ? form.data.description
                            : intl.formatMessage({ id: "no.title" }),
                          user,
                        },
                        index,
                      })}
                    </ListItem>
                  ))}
                </List>
              </>
            ) : null}
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

export default connect(mapStateToProps, undefined)(FormList);
