import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl } from "react-intl";
import { ListPaginated, SpinnerFull, UserImage } from "../../../components";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import Fetch from "../../../components/Fetch/Fetch";
import { EvaIcon } from "@paljs/ui/Icon";
import ContextMenu from "@paljs/ui/ContextMenu";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const EnterpriseList = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const navigate = useNavigate();

  const hasPermissionAdd = props.items?.some((x) => x === "/organization-add");

  const renderItem = ({ item }) => {
    let itemsMenu = [];
    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item?.id &&
          x.paths?.includes("/organization-add")
      )
    ) {
      itemsMenu.push({
        icon: "edit-outline",
        title: props.intl.formatMessage({ id: "edit" }),
        link: { to: `/organization-add?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item?.id &&
          x.paths?.includes("/setup-email")
      )
    ) {
      itemsMenu.push({
        icon: "email-outline",
        title: props.intl.formatMessage({ id: "setup.email" }),
        link: { to: `/setup-email?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item?.id &&
          x.paths?.includes("/setup-chatbot")
      )
    ) {
      itemsMenu.push({
        icon: "smiling-face-outline",
        title: props.intl.formatMessage({ id: "setup.chatbot" }),
        link: { to: `/setup-chatbot?id=${item.id}` },
      });
    }


    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item?.id &&
          x.paths?.includes("/enterprise-user-integration")
      )
    ) {
      itemsMenu.push({
        icon: "person-done-outline",
        title: props.intl.formatMessage({ id: "usernames.external" }),
        link: { to: `/enterprise-user-integration?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item?.id &&
          x.paths?.includes("/organization-limits")
      )
    ) {
      itemsMenu.push({
        icon: "people-outline",
        title: props.intl.formatMessage({ id: "setup.limits" }),
        link: { to: `/organization-limits?id=${item.id}` },
      });
    }

    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item?.id &&
          x.paths?.includes("/setup-sso")
      )
    ) {
      itemsMenu.push({
        icon: "lock-outline",
        title: props.intl.formatMessage({ id: "setup.sso" }),
        link: { to: `/setup-sso?id=${item.id}` },
      });
    }

    itemsMenu.push({
      icon: "map-outline",
      title: `${props.intl.formatMessage({ id: "setup" })} Fleet`,
      link: { to: `/setup-fleet-enterprise?id=${item.id}` },
    });

    return (
      <>
        <UserImage
          size="Large"
          image={item?.logo || item?.image?.url}
          title={`${item.city} - ${item.state} / ${item.country}`}
          name={item.name}
        />
        {!!itemsMenu?.length && (
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
        )}
      </>
    );
  };

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/enterprise/my/list?page=${currentPage - 1}&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }

    setIsLoading(true);
    Fetch.get(url)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Col>
                <Row between>
                  <FormattedMessage id="enterprises" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/organization-add`)}
                    >
                      <FormattedMessage id="enterprise.new" />
                    </Button>
                  )}
                </Row>
              </Col>
            </CardHeader>
            <ListPaginated
              data={data?.data}
              totalItems={data?.pageInfo[0]?.count}
              renderItem={renderItem}
              onPageChanged={onPageChanged}
              contentStyle={{
                borderLeft: `6px solid #007bff`,
                justifyContent: "space-between",
              }}
            />
          </Card>
        </Col>
      </Row>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  idEnterprises: state.enterpriseFilter.idEnterprises,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});
const EnterpriseListIntl = injectIntl(EnterpriseList);
export default connect(mapStateToProps, undefined)(EnterpriseListIntl);
