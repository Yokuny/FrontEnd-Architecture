import React from 'react'
import { Button, Col, ContextMenu, EvaIcon } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { getShowVisibility } from "../../../components/Utils";
import { TextSpan } from "../../../components";
import { Link } from "react-router-dom";
import FolderContent from './FolderContent';

const ItemRow = styled.div`
  ${({ colorTextTheme, theme }) => css`
    border-left: 6px solid ${theme[colorTextTheme]};
    padding: 1rem;
    display: flex;
    flex-direction: row;
    width: 100%;

    :hover {
       {
        cursor: pointer;
        background-color: ${theme.colorBasicHover};
        color: ${theme.colorPrimary500};
      }
    }
  `}
`;

const RowContentFolder = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
`

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
`;
export default function ItemFolder(props) {

  const { item, hasPermissionEditor, hasPermissionViewer, isShowEnterprise } = props;

  const [showDashboards, setShowDashboards] = React.useState(false)

  const intl = useIntl();
  const theme = useTheme();

  const showVisibility = getShowVisibility(item.visibility);

  const itemsMenu = [];

  if (hasPermissionEditor && item.isCanEdit) {
    itemsMenu.push({
      icon: "edit-outline",
      title: intl.formatMessage({ id: "edit" }),
      link: { to: `/add-dashboard?id=${item.id}` },
    });
  }

  const clickShow = (item) => {
    setShowDashboards(prevState => !prevState)
  };

  return (<>
    <RowContentFolder>
      <ItemRow
        colorTextTheme={"colorWarning500"}
        style={{ flexWrap: "wrap" }}
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
              name={"folder"}
              options={{
                fill: theme.colorWarning500,
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
          {item.typeLayout && <RowRead>
            <EvaIcon
              name={item.typeLayout === "group" ? "layers-outline" : "layout-outline"}
              className="mt-1 mr-1"
              status="Basic"
              options={{ height: 18, width: 16 }}
            />
            <TextSpan style={{ marginTop: 2 }} hint apparence="s3">
              <FormattedMessage id={item.typeLayout} />
            </TextSpan>
          </RowRead>}
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
      {showDashboards &&
        <RowContentFolder className='ml-4'>
          <FolderContent
            hasPermissionViewer={hasPermissionViewer}
            hasPermissionEditor={hasPermissionEditor}
            item={item}
            isShowEnterprise={isShowEnterprise}
          />
        </RowContentFolder>}
    </RowContentFolder>
  </>
  )
}
