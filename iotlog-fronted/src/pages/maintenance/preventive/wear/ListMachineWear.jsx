import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { Fetch, ListPaginated, SpinnerFull, UserImage } from "../../../../components";
import ContextMenu from "@paljs/ui/ContextMenu";
import { EvaIcon } from "@paljs/ui/Icon";
import { Link } from "react-router-dom";



const ListMachineWear = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();

  React.useLayoutEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 5 });
  }, []);

  const renderItem = ({ item, index }) => {
    const itemsMenu = [];
    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id == item.enterprise?.id &&
          x.paths?.includes("/machine-wear-add")
      )
    ) {
      itemsMenu.push({
        icon: "flip-2-outline",
        title: props.intl.formatMessage({ id: "wear.adjust.manual" }),
        link: { to: `/machine-wear-add?id=${item.id}` },
      });
    }
    if (
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id == item.enterprise?.id &&
          x.paths?.includes("/field-wear")
      )
    ) {
      itemsMenu.push({
        icon: "edit-outline",
        title: props.intl.formatMessage({ id: "wear.field" }),
        link: { to: `/field-wear?id=${item.id}` },
      });
    }
    return (
      <>
        <UserImage
          size="Large"
          image={item.image?.url}
          title={item.enterprise?.name}
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
    let url = `/machine/list?page=${currentPage - 1}&size=${pageLimit}`;
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
              <FormattedMessage id="machines" />
            </CardHeader>
            <ListPaginated
              data={data?.data}
              totalItems={data?.pageInfo[0]?.count}
              renderItem={renderItem}
              onPageChanged={onPageChanged}
              contentStyle={{
                borderLeft: `6px solid #0095ff`,
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
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

const ListMachineWearIntl = injectIntl(ListMachineWear);

export default connect(mapStateToProps, undefined)(ListMachineWearIntl);
