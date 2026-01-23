import React from "react";
import { connect } from "react-redux";
import {
  FetchSupport,
  ListPaginated,
  SpinnerFull,
} from "../../../components";
import { FormattedMessage } from "react-intl";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { Card, CardHeader } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import ItemOrder from "./ItemOrder";
import { useNavigate } from "react-router-dom";

const ListOrders = (props) => {
  
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 5 });
  }, []);

  const hasPermissionAdd = props.items?.some((x) => x == "/new-order-support");

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/ordersupport/my/list?page=${currentPage - 1}&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }

    setIsLoading(true);
    FetchSupport.get(url)
      .then((response) => {
        setOrders(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onClickOpenDetails = (orderId) => {
    navigate(`/details-order?id=${orderId}`)
  }

  const renderItem = ({ item, index }) => (
    <ItemOrder key={index} order={item} onClick={onClickOpenDetails} />
  );

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Col>
                <Row between>
                  <FormattedMessage id="my.support" />
                  {hasPermissionAdd && (
                    <Button
                      size="Small"
                      status="Primary"
                      onClick={() => navigate(`/new-order-support`)}
                    >
                      <FormattedMessage id="new.request" />
                    </Button>
                  )}
                </Row>
              </Col>
            </CardHeader>
            <ListPaginated
              data={orders?.rows}
              totalItems={orders?.count}
              renderItem={renderItem}
              onPageChanged={onPageChanged}
              contentStyle={{
                padding: 0
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
  idEnterprises: state.enterpriseFilter.idEnterprises,
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(ListOrders);
