import { Button, Col, ContextMenu, EvaIcon } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { getShowVisibility } from "../../../components/Utils";
import { IconRounded, TextSpan } from "../../../components";
import { Link, useNavigate } from "react-router-dom";

const ItemRow = styled.div`
  ${({ colorTextTheme, theme }) => css`
    border-left: 6px solid ${theme[colorTextTheme]};
    padding: 1rem;
    display: flex;
    flex-direction: row;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: ${theme.backgroundBasicColor2};
      color: ${theme.colorPrimary500};
    }
  `}
`;

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
`;
export default function ItemRowListDashboard(props) {

  const { item, hasPermissionViewer, hasPermissionEditor, isShowEnterprise, status = "Primary", isItemFolder } = props;

  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();

  const showVisibility = getShowVisibility(item.visibility);


  const itemsMenu = [];
  if (hasPermissionViewer) {
    itemsMenu.push({
      icon: "bar-chart-outline",
      title: intl.formatMessage({ id: "charts" }),
      link: { to: `/my-${item.typeLayout === "group" ? "group-" : ""}dashboard?id=${item.id}` },
    });
  }

  if (hasPermissionEditor && item.isCanEdit) {
    itemsMenu.push({
      icon: "edit-outline",
      title: intl.formatMessage({ id: "edit" }),
      link: { to: `/add-dashboard?id=${item.id}` },
    });
  }

  function handleLayoutIcon(type) {
    switch (type) {
      case "group":
        return "layers-outline";

      case "simple":
        return "layout-outline";

      default:
        return "layers-outline";
    }
  }

  const clickShow = (item) => {

    if (item.typeData === 'url.external') {
      return navigate(`/my-frame?id=${item.id}`)
    }

    if (hasPermissionViewer) {
      navigate(`/my-${item.typeLayout === "group" ? "group-" : ""}dashboard?id=${item.id}`);
    }
  };

  return (<>
    <ItemRow
      colorTextTheme={`color${status}500`}
      style={isItemFolder ? { flexWrap: "wrap", borderLeft: 'none' } : { flexWrap: "wrap" }}
      onClick={() => clickShow(item)}
    >
      <Col
        breakPoint={{ md: 1, xs: 12 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <EvaIcon
          name={"pie-chart"}
          options={{
            fill: theme[`color${status}500`],
            width: 25,
            height: 25,
            animation: { type: "pulse", infinite: false, hover: true },
          }}
        />
      </Col>
      <ColCenter
        breakPoint={{ md: 5, xs: 12 }}
        className="center-mobile mt-4 mb-4"
      >
        <TextSpan apparence="s1">{item.description}</TextSpan>
        {!isShowEnterprise && <TextSpan apparence="c1">{`${item.code ? " / " : ""}${item?.enterprise?.name}`}</TextSpan>}
      </ColCenter>
      <ColCenter breakPoint={{ md: 2, xs: 4 }}>
        <RowRead style={{ justifyContent: "center" }}>
          <EvaIcon
            name={showVisibility.icon}
            status={'Basic'}
            className="mt-1 mr-1"
            options={{ height: 18, width: 16 }}
          />
          <TextSpan style={{ marginTop: 2 }} apparence="s3" hint>
            <FormattedMessage id={showVisibility.textId} />
          </TextSpan>
        </RowRead>
      </ColCenter>
      <ColCenter breakPoint={{ md: 1, xs: 4 }}>
        {item.typeData === `url.external`
          ? <RowRead>
            <EvaIcon
              name={"link-2-outline"}
              className="mt-1 mr-1"
              status="Basic"
              options={{ height: 18, width: 16 }}
            />
            <TextSpan style={{ marginTop: 2 }} hint apparence="s3">
              Link
            </TextSpan>
          </RowRead>
          : <>
            {item.typeLayout && <RowRead>
              <EvaIcon
                name={handleLayoutIcon(item.typeLayout)}
                className="mt-1 mr-1"
                status="Basic"
                options={{ height: 18, width: 16 }}
              />
              <TextSpan style={{ marginTop: 2 }} hint apparence="s3">
                <FormattedMessage id={item.typeLayout} />
              </TextSpan>
            </RowRead>}
          </>}
      </ColCenter>
      <ColCenter breakPoint={{ md: 2, xs: 4 }}>
        <RowRead style={{ justifyContent: "center" }}>
          <EvaIcon
            name="person-outline"
            status="Basic"
            className="mt-1 mr-1"
            options={{ height: 18, width: 16 }}
          />
          <TextSpan style={{ marginTop: 2 }} hint apparence="s3">
            {item.user?.name}
          </TextSpan>
        </RowRead>
      </ColCenter>
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
  )
}
