import React from 'react'
import { Button, Card, CardHeader, ContextMenu, EvaIcon } from "@paljs/ui";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from 'react-intl';
import { ListSearchPaginated, ColCenter, TextSpan } from '../../../../components';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css, useTheme } from 'styled-components';

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

const ListItemStyle = styled(TextSpan)`
  cursor: pointer;
`

const ListContract = (props) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const theme = useTheme();
  const hasPermissionAdd = props.items?.some((x) => x === "/contract-add");
  const hasPermissionEditContractAsset = props.items?.some((x) => x === "/contract-assets-add");

  const clickShow = (item) => {
    navigate(`/contract-view?id=${item.id}`);
  };

  const renderItem = ({ item }) => {
    const contextMenuItems = [];
    contextMenuItems.push({
      icon: "eye-outline",
      title: intl.formatMessage({ id: "view" }),
      link: { to: `/contract-view?id=${item?.id}` },
    });
    if (hasPermissionAdd)
      contextMenuItems.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: { to: `/contract-add?id=${item?.id}` },
      });
    if (hasPermissionEditContractAsset)
      contextMenuItems.push({
        icon: "file-add-outline",
        title: intl.formatMessage({ id: "view.contract.asset" }),
        link: { to: `/contract-assets-add?id=${item?.id}` },
      });

      contextMenuItems.push({
        icon: "copy-outline",
        title: intl.formatMessage({ id: "duplicate" }),
        link: { to: `/contract-add?id=${item?.id}&duplicate=true` },
      });

    return (
      <>
        <ItemRow
          colorTextTheme={"colorPrimary600"}
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
              name={"file-text-outline"}
              options={{
                fill: theme.colorPrimary600,
                width: 25,
                height: 25,
                animation: { type: "pulse", infinite: false, hover: true },
              }}
            />
          </Col>
          <ColCenter breakPoint={{ md: 10, xs: 12 }}>
            <ListItemStyle apparence="s1">{item?.description}</ListItemStyle>
          </ColCenter>
          <ColCenter breakPoint={{ md: 1 }}>
            <ContextMenu
              className="inline-block mr-1 text-start"
              placement="left"
              items={contextMenuItems}
              Link={Link}
            >
              <Button size="Tiny" status="Basic">
                <EvaIcon name="more-vertical" />
              </Button>
            </ContextMenu>
          </ColCenter>
        </ItemRow>
      </>
    );
  };

  return (
    <>
      <Card className="mb-0">
        <CardHeader>
          <Col>
            <Row between>
              <FormattedMessage id="contract" />
              {hasPermissionAdd && (
                <Button size="Tiny" status="Primary" className="flex-between" onClick={() => navigate(`/contract-add`)}>
                  <EvaIcon name="plus-outline" className='mr-1' />
                  <FormattedMessage id="view.contract.add" />
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
          pathUrlSearh="/contract/list"
          filterEnterprise
        />
      </Card>
    </>
  )
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps)(ListContract);
