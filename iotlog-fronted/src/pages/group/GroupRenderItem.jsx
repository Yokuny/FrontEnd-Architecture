import { Button, Col, ContextMenu, EvaIcon } from "@paljs/ui";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import { ColCenter, TextSpan } from "../../components";
import { ItemRow } from "./styles";

export default function GroupRenderItem({ item, hasPermissionEdit }) {
  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();

  const itemsMenu = hasPermissionEdit
  ? [
    {
      icon: "edit-outline",
      title: intl.formatMessage({ id: "edit.group" }),
      link: {
        to: `/group-add?id=${item.id}`,
      },
    },
  ]
  : [];

  return (
    <>
      <ItemRow
        key={item.id}
        onClick={hasPermissionEdit ? () => navigate(`/group-add?id=${item.id}`) : null}
        colorTextTheme={"colorInfo800"}
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
            name={"book-outline"}
            options={{
              fill: theme.colorInfo800,
              width: 25,
              height: 25,
              animation: { type: "pulse", infinite: false, hover: true },
            }}
          />
        </Col>
        <ColCenter breakPoint={{ md: 5 }}>
          <TextSpan apparence="s1">{item?.name}</TextSpan>
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
}
