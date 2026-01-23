import React from "react";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import User from "@paljs/ui/User";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  ColCenter,
  FetchSupport,
  IconRounded,
  ItemRow,
  ListPaginated,
  SpinnerFull,
  TextSpan,
} from "../../components";
import { EvaIcon } from "@paljs/ui";
import { useTheme } from "styled-components";
import { useNavigate } from "react-router-dom";

const ListUnit = (props) => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 5 });
  }, []);

  const onEdit = (item) => {
    navigate(`/unit-add?id=${item.id}`);
  };

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/unit/list?page=${currentPage - 1}&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }

    setIsLoading(true);
    FetchSupport.get(url)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const hasPermissionAdd = props.items?.some((x) => x === "/unit-add");

  const renderItem = ({ item, index }) => {
    const hasPermissionEdit = props.itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id == item.idEnterprise && x.paths?.includes("/unit-add")
    );
    return (
      <>
        <ItemRow
          colorTextTheme={"colorDanger700"}
          onClick={() => hasPermissionEdit && onEdit(item)}
        >
          <Col breakPoint={{ md: 1 }} className="col-flex-center">
            <IconRounded colorTextTheme={"colorDanger100"}>
              <EvaIcon
                name={"home"}
                options={{
                  fill: theme.colorDanger700,
                  width: 25,
                  height: 25,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
            </IconRounded>
          </Col>
          <ColCenter breakPoint={{ md: 5 }}>
            <TextSpan apparence="s1">{item?.name}</TextSpan>
            <TextSpan apparence="p3">{`${item?.address ?? ''}, ${item?.number ?? ''}`}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 5 }}>
            <TextSpan apparence="c2">{`${item?.city ?? ''} - ${item?.state ?? ''}`}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 1 }}>
            <div>
              {hasPermissionAdd && (
                <Button
                  size="Tiny"
                  status="Success"
                  onClick={() => onEdit(item)}
                >
                  <FormattedMessage id="edit" />
                </Button>
              )}
            </div>
          </ColCenter>
        </ItemRow>
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between>
              <FormattedMessage id="units" />
              {hasPermissionAdd && (
                <Button
                  size="Small"
                  status="Primary"
                  onClick={() => navigate(`/unit-add`)}
                >
                  <FormattedMessage id="add.unit" />
                </Button>
              )}
            </Row>
          </Col>
        </CardHeader>
        <ListPaginated
          data={data?.rows}
          totalItems={data?.count}
          renderItem={renderItem}
          onPageChanged={onPageChanged}
          contentStyle={{
            justifyContent: "space-between",
            padding: 0,
          }}
        />
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(ListUnit);
